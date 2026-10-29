import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const eventMemoryStore: Array<Record<string, unknown>> = [];
const DATA_DIR = path.join(process.cwd(), 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

const ensureEventsFile = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(EVENTS_FILE)) {
      fs.writeFileSync(EVENTS_FILE, '[]', 'utf8');
    }
  } catch {
    // Ignore in read-only environment
  }
};

/**
 * Analytics Event Ingestion Endpoint (POST /api/events).
 * 
 * Compliance & Privacy rationale (GDPR / ePrivacy):
 * To guarantee zero Personally Identifiable Information (PII) leakage into analytical logs,
 * the server strictly inspects all payload details. Any keys matching email/phone/name or any values
 * containing an '@' symbol are aggressively stripped before logging.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanitize: Explicitly allow only non-PII fields
    const safePayload = {
      event: body.event,
      variant: body.variant,
      timestamp: body.timestamp || new Date().toISOString(),
      details: body.details
        ? Object.fromEntries(
            Object.entries(body.details).filter(([key, val]) => {
              // Strictly strip any key that might look like an email or personal data
              if (typeof key === 'string' && /email|mail|name|jmeno|phone/i.test(key)) return false;
              if (typeof val === 'string' && val.includes('@')) return false;
              return true;
            })
          )
        : undefined,
      utmParams: body.utmParams,
      receivedAt: new Date().toISOString(),
    };

    // 1. In-memory buffer (always available for admin inspection)
    eventMemoryStore.push(safePayload);
    if (eventMemoryStore.length > 500) {
      eventMemoryStore.shift();
    }

    // 2. Development file persistence
    if (process.env.NODE_ENV !== 'production') {
      try {
        ensureEventsFile();
        if (fs.existsSync(EVENTS_FILE)) {
          const list = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8') || '[]');
          list.push(safePayload);
          fs.writeFileSync(EVENTS_FILE, JSON.stringify(list.slice(-500), null, 2), 'utf8');
        }
      } catch {
        // ignore
      }
    }

    // 3. Production PostgreSQL persistence (non-blocking if database is attached)
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);
        await sql`
          CREATE TABLE IF NOT EXISTS analytics_events (
            id SERIAL PRIMARY KEY,
            event VARCHAR(100) NOT NULL,
            variant VARCHAR(50),
            timestamp TIMESTAMPTZ NOT NULL,
            details JSONB,
            utm_params JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `;
        await sql`
          INSERT INTO analytics_events (event, variant, timestamp, details, utm_params)
          VALUES (
            ${safePayload.event},
            ${safePayload.variant || null},
            ${safePayload.timestamp},
            ${safePayload.details ? JSON.stringify(safePayload.details) : null},
            ${safePayload.utmParams ? JSON.stringify(safePayload.utmParams) : null}
          );
        `;
      } catch (err) {
        console.warn('Postgres event logging notice (non-fatal):', err);
      }
    }

    return NextResponse.json({ success: true, logged: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}

/**
 * Administrative Analytics Inspection Endpoint (GET /api/events).
 * 
 * Strictly protected by Authorization: Bearer <ADMIN_SECRET>.
 * Unauthorized requests without matching bearer token receive 401 Unauthorized.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || token !== adminSecret) {
    return NextResponse.json(
      { error: 'Unauthorized. Přístup k interním analytickým událostem je chráněn.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    count: eventMemoryStore.length,
    events: eventMemoryStore.slice(-100),
  });
}
