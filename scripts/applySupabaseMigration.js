import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT_REF = 'btuucgpelprepadqrcbi';

async function runMigration() {
  if (!SUPABASE_ACCESS_TOKEN) {
    console.error('SUPABASE_ACCESS_TOKEN environment variable is missing.');
    return;
  }

  const sqlPath = path.join(process.cwd(), 'supabase/migrations/20260920000000_execora_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('🚀 Executing SQL Migration on Supabase Project:', PROJECT_REF);

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Supabase Management API response status:', response.status, errText);
    } else {
      const data = await response.json();
      console.log('✅ Supabase PostgreSQL Migration executed successfully!', data);
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

runMigration();
