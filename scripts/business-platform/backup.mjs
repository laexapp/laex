import { createHash,randomUUID } from "node:crypto";
import { mkdir,writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const connectionString=process.env.BUSINESS_DATABASE_DIRECT_URL??process.env.BUSINESS_DATABASE_URL;
if(!connectionString)throw new Error("BUSINESS_DATABASE_DIRECT_URL or BUSINESS_DATABASE_URL is required");
const kind=process.argv.includes("--scheduled")?"scheduled":"manual";
const retentionDays=Math.max(1,Number(process.env.BUSINESS_BACKUP_RETENTION_DAYS??30));
const pool=new pg.Pool({connectionString,max:1,application_name:"laex-backup"}),client=await pool.connect();
try{
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  await client.query("SET LOCAL laex.platform_access='on'");
  const data={format:"laex-postgres-logical-v1",createdAt:new Date().toISOString(),platform:(await client.query("SELECT bucket,record_key,payload FROM platform_records ORDER BY bucket,record_key")).rows,business:(await client.query("SELECT bucket,record_key,tenant_id,company_id,payload FROM business_records ORDER BY tenant_id,company_id,bucket,record_key")).rows,idempotency:(await client.query("SELECT tenant_id,company_id,operation_key,response FROM idempotency_keys ORDER BY tenant_id,company_id,operation_key")).rows};
  await client.query("COMMIT");
  const body=JSON.stringify(data),checksum=createHash("sha256").update(body).digest("hex"),directory=path.join(process.cwd(),".data","postgres-backups");
  await mkdir(directory,{recursive:true});
  const file=path.join(directory,`${data.createdAt.replace(/[:.]/g,"-")}-${randomUUID()}.json`);
  await writeFile(file,body,{encoding:"utf8",mode:0o600});
  await client.query("INSERT INTO backup_history(id,kind,status,created_at,completed_at,location,size_bytes,checksum,retention_until) VALUES($1,$2,'completed',$3,clock_timestamp(),$4,$5,$6,$3::timestamptz+make_interval(days=>$7))",[randomUUID(),kind,data.createdAt,file,Buffer.byteLength(body),checksum,retentionDays]);
  console.log(JSON.stringify({status:"completed",kind,file:path.basename(file),checksum,records:data.platform.length+data.business.length+data.idempotency.length}));
}catch(error){try{await client.query("ROLLBACK")}catch{}throw error}finally{client.release();await pool.end()}
