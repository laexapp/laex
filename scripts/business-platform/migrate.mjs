import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { formatSafeMigrationDiagnostic, selectMigrationConnection, validateMigrationConnection } from "./migration-connection.mjs";

const directOnly=process.argv.includes("--direct-only");
const selected=selectMigrationConnection(process.env,{directOnly});
const {connectionString,diagnostic}=validateMigrationConnection(selected.source,selected.connectionString);
console.log(formatSafeMigrationDiagnostic(diagnostic));
const pool=new pg.Pool({connectionString,max:1,application_name:"laex-migrator"});
const directory=path.join(process.cwd(),"modules","business-engine","infrastructure","postgres","migrations");
try{
  const files=(await readdir(directory)).filter(file=>/^\d+.*\.sql$/.test(file)).sort();
  for(const file of files){
    const sql=await readFile(path.join(directory,file),"utf8"),version=file.replace(/\.sql$/,"");
    const checksum=createHash("sha256").update(sql).digest("hex"),client=await pool.connect(),started=Date.now();
    try{
      await client.query("BEGIN");
      await client.query("CREATE TABLE IF NOT EXISTS laex_schema_migrations(version text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT clock_timestamp(),execution_ms integer NOT NULL)");
      const existing=await client.query("SELECT checksum FROM laex_schema_migrations WHERE version=$1",[version]);
      if(existing.rowCount){if(existing.rows[0].checksum!==checksum)throw new Error(`migration_checksum_mismatch:${version}`);await client.query("ROLLBACK");console.log(`unchanged ${version}`);continue;}
      await client.query(sql);
      await client.query("INSERT INTO laex_schema_migrations(version,checksum,execution_ms) VALUES($1,$2,$3)",[version,checksum,Date.now()-started]);
      await client.query("COMMIT");console.log(`applied ${version}`);
    }catch(error){await client.query("ROLLBACK");throw error}finally{client.release()}
  }
}finally{await pool.end()}
