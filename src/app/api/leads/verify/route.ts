import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { LOCKED_ETF_DETAILS } from '@/data/etfData';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

/**
 * Lead Session Verification Endpoint (POST /api/leads/verify).
 * 
 * Security rationale:
 * Rather than allowing clients to unlock protected content simply by setting arbitrary
 * keys in browser localStorage (which is trivially spoofable via DevTools),
 * the client presents its (leadId, email) credentials upon session return.
 * 
 * The server queries the authoritative database (or dev storage in development).
 * Only if the record genuinely exists does it deliver the protected LOCKED_ETF_DETAILS.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, email } = body;

    if (!leadId || !email) {
      return NextResponse.json({ success: false, error: 'Chybějící identifikační údaje.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    let verified = false;

    // Check database
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);
        const rows = await sql`SELECT id FROM leads WHERE id = ${leadId} AND email = ${cleanEmail} LIMIT 1;`;
        if (rows.length > 0) {
          verified = true;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Verify DB lookup failed:', err);
      }
    }

    // Dev file check
    if (!verified && process.env.NODE_ENV !== 'production') {
      try {
        if (fs.existsSync(LEADS_FILE)) {
          const list = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8') || '[]');
          if (list.some((l: any) => l.id === leadId && l.email === cleanEmail)) {
            verified = true;
          }
        }
      } catch {
        // ignore
      }
    }

    if (verified) {
      return NextResponse.json({
        success: true,
        unlockedData: LOCKED_ETF_DETAILS,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Neplatný nebo neexistující záznam kontaktu.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Chyba ověření.' }, { status: 500 });
  }
}

