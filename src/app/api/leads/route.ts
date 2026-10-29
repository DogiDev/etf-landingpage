import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { LOCKED_ETF_DETAILS } from '@/data/etfData';

export interface LeadRecord {
  id: string;
  email: string;
  createdAt: string;
  variant: string;
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
  userAgent?: string;
}

const memoryLeads: LeadRecord[] = [];
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const ensureLeadsDirectory = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, '[]', 'utf8');
    }
  } catch {
    // Ignore in read-only environment
  }
};

/**
 * RFC 5322 compliant email format validation.
 * Ensures the email is well-formed, trimmed, and within safe character boundaries (5-254 chars).
 */
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return regex.test(trimmed);
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Anti-spam honeypot check:
    // If hidden input 'hp' is filled, request comes from an automated spambot.
    // We return a silent 200 without saving spam to the database or exposing locked content.
    if (body.hp && typeof body.hp === 'string' && body.hp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Požadavek byl přijat.',
        leadId: 'hp_filtered',
        storage: 'none',
      });
    }

    const rawEmail = body.email;

    // 2. Strict input validation
    if (!rawEmail || !isValidEmail(rawEmail)) {
      return NextResponse.json(
        { success: false, error: 'Zadejte prosím platnou e-mailovou adresu.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();
    const variant = body.variant || 'fees';
    const utmParams = body.utmParams || {};
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const newLead: LeadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      email,
      createdAt: new Date().toISOString(),
      variant,
      utmParams,
      userAgent,
    };

    const isProduction = process.env.NODE_ENV === 'production';
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    let leadPersisted = false;
    let storageType = 'none';

    // 3. Primary Production Storage: Neon Serverless PostgreSQL
    // Auto-migrates table schema on first run. If DATABASE_URL is configured, all leads are stored persistently.
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);

        // Ensure table exists
        await sql`
          CREATE TABLE IF NOT EXISTS leads (
            id VARCHAR(64) PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            variant VARCHAR(32),
            utm_source VARCHAR(128),
            utm_medium VARCHAR(128),
            utm_campaign VARCHAR(128),
            utm_content VARCHAR(128),
            user_agent TEXT
          );
        `;

        // Insert lead record
        await sql`
          INSERT INTO leads (
            id, email, created_at, variant, utm_source, utm_medium, utm_campaign, utm_content, user_agent
          ) VALUES (
            ${newLead.id},
            ${newLead.email},
            ${newLead.createdAt},
            ${newLead.variant},
            ${utmParams.utm_source || null},
            ${utmParams.utm_medium || null},
            ${utmParams.utm_campaign || null},
            ${utmParams.utm_content || null},
            ${userAgent}
          )
          ON CONFLICT (id) DO NOTHING;
        `;

        leadPersisted = true;
        storageType = 'neon-postgres';
      } catch (dbError) {
        // eslint-disable-next-line no-console
        console.error('CRITICAL: Neon PostgreSQL save failed:', dbError);
        leadPersisted = false;
      }
    }

    // 4. Local Development Fallback: Only permitted when NOT in production.
    // In local development without internet/cloud DB, saves to data/leads.json.
    if (!leadPersisted && !isProduction) {
      try {
        ensureLeadsDirectory();
        if (fs.existsSync(LEADS_FILE)) {
          const raw = fs.readFileSync(LEADS_FILE, 'utf8');
          const list: LeadRecord[] = JSON.parse(raw || '[]');
          const idx = list.findIndex((l) => l.email === email);
          if (idx >= 0) {
            list[idx] = newLead;
          } else {
            list.unshift(newLead);
          }
          fs.writeFileSync(LEADS_FILE, JSON.stringify(list, null, 2), 'utf8');
          leadPersisted = true;
          storageType = 'dev-file';
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Local file write failed:', err);
      }
    }

    // Update in-memory cache for fast session verification during test execution
    if (leadPersisted) {
      const idx = memoryLeads.findIndex((l) => l.email === email);
      if (idx >= 0) {
        memoryLeads[idx] = newLead;
      } else {
        memoryLeads.unshift(newLead);
      }
    }

    // 5. Strict Zero-Fake-Success Policy in Production:
    // If the database write failed or DATABASE_URL is missing in production,
    // we MUST NEVER report 200 OK or unlock data. This prevents silent loss of marketing leads.
    if (!leadPersisted) {
      const errorMsg = isProduction
        ? 'Chyba serveru: Databáze kontaktů není dostupná. Kontakt nebyl uložen.'
        : 'Vývojová chyba: Nepodařilo se uložit kontakt ani do lokálního souboru.';

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 503 }
      );
    }

    // 6. Optional External Webhook (e.g. Make, Zapier, Google Sheets, Slack)
    // Non-blocking fire-and-forget notification if LEADS_WEBHOOK_URL is provided in environment.
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: newLead.id,
          email: newLead.email,
          createdAt: newLead.createdAt,
          variant: newLead.variant,
          utmParams: newLead.utmParams,
        }),
      }).catch((webhookErr) => {
        // eslint-disable-next-line no-console
        console.error('Webhook notification failed:', webhookErr);
      });
    }

    // 7. Security Boundary: Locked ETF data is ONLY returned after genuine persistence.
    // The client does not possess the locked records until this point.
    return NextResponse.json({
      success: true,
      message: 'Kontakt byl úspěšně zaznamenán. Srovnání se odemyká.',
      leadId: newLead.id,
      storage: storageType,
      unlockedData: LOCKED_ETF_DETAILS,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unexpected error in /api/leads POST:', error);
    return NextResponse.json(
      { success: false, error: 'Při ukládání kontaktu došlo k neočekávané chybě.' },
      { status: 500 }
    );
  }
}

/**
 * Strictly protected administrative GET endpoint.
 * Requires HTTP header: Authorization: Bearer <ADMIN_SECRET>
 * 
 * In production, this prevents unauthorized visitors from reading stored email addresses.
 * If ADMIN_SECRET is not configured or token does not match, returns 401 Unauthorized.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const adminSecret = process.env.ADMIN_SECRET;

  // Security gate: Never expose leads if ADMIN_SECRET is not set or token doesn't match
  if (!adminSecret || token !== adminSecret) {
    return NextResponse.json(
      { error: 'Unauthorized. Tento endpoint je chráněn a vyžaduje oprávnění administrátora.' },
      { status: 401 }
    );
  }

  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (databaseUrl) {
      const sql = neon(databaseUrl);
      const rows = await sql`SELECT id, email, created_at, variant, utm_source, utm_content FROM leads ORDER BY created_at DESC LIMIT 200;`;
      return NextResponse.json({ success: true, count: rows.length, leads: rows });
    }

    return NextResponse.json({ success: true, count: memoryLeads.length, leads: memoryLeads });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Chyba při čtení z databáze' }, { status: 500 });
  }
}
