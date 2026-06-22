const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);
async function run() {
  try {
    await sql`ALTER TABLE match_timer_state ADD COLUMN IF NOT EXISTS injury_time_ms BIGINT DEFAULT 0;`;
    console.log("Success: injury_time_ms added.");
  } catch (e) {
    console.error("DB error:", e);
  }
}
run();
