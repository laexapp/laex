import { Pool, type PoolClient } from "pg";
import { emptyChapterTwoState, type ChapterTwoState, type ChapterTwoStore } from "../../chapter-two/types";
import type { CompanyId, TenantId } from "../../domain/types";

const arrayBuckets = Object.keys(emptyChapterTwoState()).filter((key) => Array.isArray(emptyChapterTwoState()[key as keyof ChapterTwoState])) as Array<keyof ChapterTwoState>;
const keyOf = (record: Record<string, unknown>, index: number) => String(record.id ?? record.version ?? `${record.tenantId ?? "platform"}:${record.companyId ?? "global"}:${record.userId ?? index}:${index}`);

export class PostgresChapterTwoStore implements ChapterTwoStore {
  readonly engine = "postgresql";
  constructor(private readonly pool: Pool) {}

  static fromUrl(connectionString: string) {
    if (!connectionString) throw new Error("BUSINESS_DATABASE_URL is required");
    return new PostgresChapterTwoStore(new Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, application_name: "laex-business" }));
  }

  async snapshot(): Promise<ChapterTwoState> {
    const client = await this.pool.connect();
    try { await client.query("BEGIN READ ONLY"); await client.query("SET LOCAL laex.platform_access = 'on'"); const state = await this.read(client); await client.query("COMMIT"); return state; }
    catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }

  async findCompanyBySlugOrHost(value: string) {
    const client=await this.pool.connect();
    try{await client.query("BEGIN READ ONLY");await client.query("SET LOCAL laex.platform_access = 'on'");
    const result = await client.query<{ payload: ChapterTwoState["platformCompanies"][number] }>(`SELECT company.payload
      FROM platform_records company
      LEFT JOIN business_records domain ON domain.bucket='platformDomains' AND domain.payload->>'companyId'=company.payload->>'id' AND domain.payload->>'status'='active'
      WHERE company.bucket='platformCompanies' AND company.payload->>'status'<>'cancelled'
        AND (lower(company.payload->>'slug')=$1 OR lower(company.payload->>'id')=$1 OR lower(domain.payload->>'hostname')=$1)
      LIMIT 1`, [value]);
    await client.query("COMMIT");return result.rows[0]?.payload;
    }catch(error){await client.query("ROLLBACK");throw error}finally{client.release()}
  }

  async snapshotForCompany(tenantId: TenantId, companyId: CompanyId, buckets?: Array<keyof ChapterTwoState>): Promise<ChapterTwoState> {
    const client=await this.pool.connect();
    try{await client.query("BEGIN READ ONLY");await client.query("SET LOCAL laex.platform_access = 'on'");
    const state = emptyChapterTwoState();
    const requested = buckets?.map(String) ?? arrayBuckets.map(String);
    const platform = await client.query<{ bucket: string; payload: unknown }>("SELECT bucket,payload FROM platform_records WHERE bucket = ANY($1::text[]) AND (payload->>'tenantId' IS NULL OR payload->>'tenantId'=$2) AND (payload->>'companyId' IS NULL OR payload->>'companyId'=$3) ORDER BY bucket,record_key", [requested, tenantId, companyId]);
    const business = await client.query<{ bucket: string; payload: unknown }>("SELECT bucket,payload FROM business_records WHERE tenant_id=$1 AND company_id=$2 AND bucket = ANY($3::text[]) ORDER BY bucket,record_key", [tenantId, companyId, requested]);
    for (const row of [...platform.rows, ...business.rows]) { const bucket = row.bucket as keyof ChapterTwoState; if (Array.isArray(state[bucket])) (state[bucket] as unknown[]).push(row.payload); }
    await client.query("COMMIT");return state;
    }catch(error){await client.query("ROLLBACK");throw error}finally{client.release()}
  }

  async transact<T>(operation: (draft: ChapterTwoState) => T | Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
      await client.query("SET LOCAL laex.platform_access = 'on'");
      await client.query("SELECT pg_advisory_xact_lock(hashtext('laex-business-state'))");
      const draft = await this.read(client), result = await operation(draft);
      await this.write(client, draft);
      await client.query("COMMIT");
      return result;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }

  async close() { await this.pool.end(); }

  async operationalStatus() {
    const database=await this.pool.query<{version:string}>("SELECT current_setting('server_version') version");
    const migrations=await this.pool.query<{version:string;applied_at:string}>("SELECT version,applied_at::text FROM laex_schema_migrations ORDER BY version");
    const backups=await this.pool.query("SELECT id,status,created_at,restore_test_status FROM backup_history ORDER BY created_at DESC LIMIT 10");
    return {database:{status:"healthy",engine:"postgresql",version:database.rows[0]?.version},migrations:migrations.rows.map(row=>({version:row.version,status:"applied",appliedAt:row.applied_at})),backups:backups.rows};
  }

  private async read(client: PoolClient): Promise<ChapterTwoState> {
    const state = emptyChapterTwoState();
    const platform = await client.query<{ bucket: string; payload: unknown }>("SELECT bucket,payload FROM platform_records ORDER BY bucket,record_key");
    const business = await client.query<{ bucket: string; payload: unknown }>("SELECT bucket,payload FROM business_records ORDER BY bucket,record_key");
    const normalizedTenants = await client.query<{ payload: ChapterTwoState["platformTenants"][number] }>("SELECT jsonb_build_object('id',id,'name',name,'status',status,'createdAt',created_at) payload FROM tenants");
    const normalizedCompanies = await client.query<{ payload: ChapterTwoState["platformCompanies"][number] }>("SELECT configuration payload FROM companies");
    const idempotency = await client.query<{ tenant_id: string; company_id: string; operation_key: string; response: unknown }>("SELECT tenant_id,company_id,operation_key,response FROM idempotency_keys");
    for (const row of [...platform.rows, ...business.rows]) { const bucket = row.bucket as keyof ChapterTwoState; if (Array.isArray(state[bucket])) (state[bucket] as unknown[]).push(row.payload); }
    for (const row of normalizedTenants.rows) if (!state.platformTenants.some(item=>item.id===row.payload.id)) state.platformTenants.push(row.payload);
    for (const row of normalizedCompanies.rows) if (!state.platformCompanies.some(item=>item.id===row.payload.id)) state.platformCompanies.push(row.payload);
    for (const row of idempotency.rows) state.idempotency[`${row.tenant_id}:${row.company_id}:${row.operation_key}`] = row.response;
    return state;
  }

  private async write(client: PoolClient, state: ChapterTwoState) {
    await client.query("DELETE FROM commerce_order_history");
    await client.query("DELETE FROM commerce_payments");
    await client.query("DELETE FROM commerce_payment_methods");
    await client.query("DELETE FROM commerce_reservations");
    await client.query("DELETE FROM commerce_orders");
    await client.query("DELETE FROM commerce_projections");
    await client.query("DELETE FROM business_ai_activity");
    await client.query("DELETE FROM business_fiscal_documents");
    await client.query("DELETE FROM business_fiscal_reconciliations");
    await client.query("DELETE FROM business_fiscal_sequences");
    await client.query("DELETE FROM business_fiscal_profiles");
    await client.query("DELETE FROM business_records");
    await client.query("DELETE FROM platform_records");
    await client.query("DELETE FROM idempotency_keys");
    await client.query("DELETE FROM companies");
    await client.query("DELETE FROM tenants");
    if (state.platformTenants.length) await client.query("INSERT INTO tenants(id,name,status,created_at) SELECT id,name,status,created_at::timestamptz FROM jsonb_to_recordset($1::jsonb) AS x(id text,name text,status text,created_at text)",[JSON.stringify(state.platformTenants.map(tenant=>({id:tenant.id,name:tenant.name,status:tenant.status,created_at:tenant.createdAt})))]);
    if (state.platformCompanies.length) await client.query("INSERT INTO companies(id,tenant_id,slug,name,legal_name,status,currency,timezone,configuration,created_at) SELECT id,tenant_id,slug,name,legal_name,status,currency,timezone,configuration,created_at::timestamptz FROM jsonb_to_recordset($1::jsonb) AS x(id text,tenant_id text,slug text,name text,legal_name text,status text,currency text,timezone text,configuration jsonb,created_at text)",[JSON.stringify(state.platformCompanies.map(company=>({id:company.id,tenant_id:company.tenantId,slug:company.slug,name:company.name,legal_name:company.legalName,status:company.status,currency:company.currency,timezone:company.timezone,configuration:company,created_at:company.createdAt})))]);
    const platformRecords:Array<{bucket:string;record_key:string;payload:Record<string,unknown>}>=[],businessRecords:Array<{bucket:string;record_key:string;tenant_id:string;company_id:string;payload:Record<string,unknown>}>=[];
    for (const bucket of arrayBuckets) {
      const records = state[bucket] as unknown as Array<Record<string, unknown>>;
      for (let index = 0; index < records.length; index++) {
        const record = records[index], recordKey = keyOf(record, index);
        if (record.tenantId && record.companyId) businessRecords.push({bucket:String(bucket),record_key:recordKey,tenant_id:String(record.tenantId),company_id:String(record.companyId),payload:record});
        else platformRecords.push({bucket:String(bucket),record_key:recordKey,payload:record});
      }
    }
    if(platformRecords.length)await client.query("INSERT INTO platform_records(bucket,record_key,payload) SELECT bucket,record_key,payload FROM jsonb_to_recordset($1::jsonb) AS x(bucket text,record_key text,payload jsonb)",[JSON.stringify(platformRecords)]);
    if(businessRecords.length)await client.query("INSERT INTO business_records(bucket,record_key,tenant_id,company_id,payload) SELECT bucket,record_key,tenant_id,company_id,payload FROM jsonb_to_recordset($1::jsonb) AS x(bucket text,record_key text,tenant_id text,company_id text,payload jsonb)",[JSON.stringify(businessRecords)]);
    const idempotencyRecords:Array<{tenant_id:string;company_id:string;operation_key:string;response:unknown}>=[];
    for (const [compoundKey,response] of Object.entries(state.idempotency)) {
      const [tenantId,companyId,...parts]=compoundKey.split(":");
      if (tenantId&&companyId&&parts.length) idempotencyRecords.push({tenant_id:tenantId,company_id:companyId,operation_key:parts.join(":"),response});
    }
    if(idempotencyRecords.length)await client.query("INSERT INTO idempotency_keys(tenant_id,company_id,operation_key,response) SELECT tenant_id,company_id,operation_key,response FROM jsonb_to_recordset($1::jsonb) AS x(tenant_id text,company_id text,operation_key text,response jsonb)",[JSON.stringify(idempotencyRecords)]);
    for (const profile of state.fiscalConfigurations) await client.query("INSERT INTO business_fiscal_profiles(tenant_id,company_id,rnc,legal_name,trade_name,fiscal_address,tax_regime,environment,rule_version,certificate_reference,credential_reference) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",[profile.tenantId,profile.companyId,profile.rnc,profile.legalName??null,profile.tradeName??null,profile.fiscalAddress??null,profile.taxRegime??"traditional",profile.environment,profile.ruleVersion??"DGII-reference-2026-05",profile.certificateReference,profile.credentialReference]);
    for (const sequence of state.fiscalSequences) await client.query("INSERT INTO business_fiscal_sequences(id,tenant_id,company_id,document_type,range_start,range_end,next_number,authorization_reference,environment,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[sequence.id,sequence.tenantId,sequence.companyId,sequence.type,sequence.rangeStart,sequence.rangeEnd,sequence.nextNumber,sequence.authorizedReference,sequence.environment,sequence.status]);
    for (const document of state.canonicalFiscalDocuments) await client.query("INSERT INTO business_fiscal_documents(id,tenant_id,company_id,business_document_id,document_type,e_ncf,status,original_fiscal_document_id,canonical_payload,integrity_hash,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11)",[document.id,document.tenantId,document.companyId,document.businessDocumentId,document.type,document.eNcf,document.status,document.originalFiscalDocumentId,JSON.stringify(document),document.integrityHash,document.createdAt]);
    for (const reconciliation of state.fiscalReconciliations) await client.query("INSERT INTO business_fiscal_reconciliations(id,tenant_id,company_id,period_from,period_to,status,differences,created_at) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8)",[reconciliation.id,reconciliation.tenantId,reconciliation.companyId,reconciliation.periodFrom,reconciliation.periodTo,reconciliation.status,JSON.stringify(reconciliation.differences),reconciliation.createdAt]);
    for(const activity of state.aiActivity)await client.query("INSERT INTO business_ai_activity(id,tenant_id,company_id,user_id,session_id,agent,provider,model,intent,tools,result,data_categories,input_units,output_units,estimated_cost_usd_micros,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12::jsonb,$13,$14,$15,$16)",[activity.id,activity.tenantId,activity.companyId,activity.userId,activity.sessionId??null,activity.agent,activity.provider,activity.model,activity.intent,JSON.stringify(activity.tools),activity.result,JSON.stringify(activity.dataCategories),activity.inputUnits,activity.outputUnits,activity.estimatedCostUsdMicros,activity.createdAt]);
    for(const projection of state.commerceProjections)await client.query("INSERT INTO commerce_projections(id,tenant_id,company_id,product_id,slug,payload,publication_status,version,updated_at) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9)",[projection.id,projection.tenantId,projection.companyId,projection.productId,projection.slug,JSON.stringify(projection),projection.publicationStatus,projection.version,projection.synchronizedAt]);
    for(const order of state.commerceOrders)await client.query("INSERT INTO commerce_orders(id,public_id,tenant_id,company_id,channel,status,payment_status,idempotency_key,payload,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11)",[order.id,order.publicId,order.tenantId,order.companyId,order.channel,order.status,order.paymentStatus,order.idempotencyKey,JSON.stringify(order),order.createdAt,order.updatedAt]);
    for(const reservation of state.commerceReservations)await client.query("INSERT INTO commerce_reservations(id,tenant_id,company_id,product_id,order_id,quantity,status,expires_at,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[reservation.id,reservation.tenantId,reservation.companyId,reservation.productId,reservation.orderId,reservation.quantity,reservation.status,reservation.expiresAt,reservation.createdAt]);
    for(const method of state.commercePaymentMethods)await client.query("INSERT INTO commerce_payment_methods(id,tenant_id,company_id,name,kind,currency,enabled,requires_manual_verification,payload,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11)",[method.id,method.tenantId,method.companyId,method.name,method.kind,method.currency,method.enabled,method.requiresManualVerification,JSON.stringify(method),method.createdAt,method.updatedAt]);
    for(const payment of state.commercePayments)await client.query("INSERT INTO commerce_payments(id,tenant_id,company_id,order_id,method_id,amount_minor,currency,status,provider_id,provider_event_id,idempotency_key,payload,submitted_at,verified_at,reconciled_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15)",[payment.id,payment.tenantId,payment.companyId,payment.orderId,payment.methodId,payment.amountMinor,payment.currency,payment.status,payment.providerId,payment.providerEventId??null,payment.idempotencyKey,JSON.stringify(payment),payment.submittedAt,payment.verifiedAt??null,payment.reconciledAt??null]);
    for(const event of state.commerceOrderHistory)await client.query("INSERT INTO commerce_order_history(id,tenant_id,company_id,order_id,status,payload,occurred_at) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7)",[event.id,event.tenantId,event.companyId,event.orderId,event.status,JSON.stringify(event),event.at]);
  }
}
