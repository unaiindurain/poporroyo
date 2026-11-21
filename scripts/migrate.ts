import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { sql } from '@/lib/db';

for (const file of ['.env.local', '.env']) {
  if (existsSync(join(process.cwd(), file))) config({ path: file });
}

// El driver HTTP de @vercel/postgres solo admite una sentencia por llamada,
// así que el .sql se trocea en sentencias individuales separadas por ';'.
function splitStatements(schema: string): string[] {
  return schema
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((stmt) => stmt.trim())
    .filter(Boolean);
}

async function main() {
  const schema = readFileSync(join(process.cwd(), 'lib/db/schema.sql'), 'utf8');
  const statements = splitStatements(schema);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`✅ Esquema de base de datos aplicado correctamente (${statements.length} sentencias).`);
}

main()
  .catch((err) => {
    console.error('❌ Error aplicando el esquema:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
