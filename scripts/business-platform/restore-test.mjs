import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";

const [file]=process.argv.slice(2),connectionString=process.env.BUSINESS_DATABASE_DIRECT_URL??process.env.BUSINESS_DATABASE_URL;
if(!file)throw new Error("backup_file_required");
if(!connectionString)throw new Error("BUSINESS_DATABASE_DIRECT_URL or BUSINESS_DATABASE_URL is required");
const body=await readFile(file,"utf8"),checksum=createHash("sha256").update(body).digest("hex"),data=JSON.parse(body);
if(data.format!=="laex-postgres-logical-v1")throw new Error("unsupported_backup_format");
const pool=new pg.Pool({connectionString,max:1,application_name:"laex-restore-test"}),client=await pool.connect(),schema=`restore_${Date.now()}`;
try{
  await client.query("BEGIN");
  await client.query(`CREATE SCHEMA ${schema}`);
  await client.query(`CREATE TABLE ${schema}.platform_records (LIKE public.platform_records INCLUDING ALL)`);
  await client.query(`CREATE TABLE ${schema}.business_records (LIKE public.business_records INCLUDING ALL)`);
  await client.query(`CREATE TABLE ${schema}.idempotency_keys (LIKE public.idempotency_keys INCLUDING ALL)`);
  for(const row of data.platform)await client.query(`INSERT INTO ${schema}.platform_records(bucket,record_key,payload) VALUES($1,$2,$3)`,[row.bucket,row.record_key,row.payload]);
  for(const row of data.business)await client.query(`INSERT INTO ${schema}.business_records(bucket,record_key,tenant_id,company_id,payload) VALUES($1,$2,$3,$4,$5)`,[row.bucket,row.record_key,row.tenant_id,row.company_id,row.payload]);
  for(const row of data.idempotency)await client.query(`INSERT INTO ${schema}.idempotency_keys(tenant_id,company_id,operation_key,response) VALUES($1,$2,$3,$4)`,[row.tenant_id,row.company_id,row.operation_key,row.response]);
  const counts=await client.query(`SELECT (SELECT count(*) FROM ${schema}.platform_records)+(SELECT count(*) FROM ${schema}.business_records)+(SELECT count(*) FROM ${schema}.idempotency_keys) AS count`);
  if(Number(counts.rows[0].count)!==data.platform.length+data.business.length+data.idempotency.length)throw new Error("restore_count_mismatch");
  await client.query(`DROP SCHEMA ${schema} CASCADE`);
  await client.query("UPDATE backup_history SET restore_test_status='passed' WHERE checksum=$1",[checksum]);
  await client.query("COMMIT");
  console.log(JSON.stringify({status:"passed",checksum,records:Number(counts.rows[0].count)}));
}catch(error){await client.query("ROLLBACK");throw error}finally{client.release();await pool.end()}
