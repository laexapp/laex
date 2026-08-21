import { randomUUID } from "node:crypto";
import type { ActorContext, CompanyId, TenantId, UserId, WarehouseId } from "../domain/types";
import type { BusinessIdentity } from "../server/BusinessIdentity";
import type { ChapterTwoStore } from "../chapter-two/types";
import { ROLE_POLICIES } from "../chapter-five/RolePolicy";

export type CompanyProvisioningInput = { tenantId?: TenantId; companyId?: CompanyId; ownerUserId?: UserId; name: string; legalName: string; slug: string; hostname: string; ownerEmail: string; ownerPassword: string; taxId?: string; address?: string; phone?: string; email?: string; currency?: string; timezone?: string; primaryColor?: string; enabledModules: string[]; branchName?: string; warehouseName?: string; warehouseId?: WarehouseId; status?: "trial" | "active" };
export class CompanyProvisioningService {
  constructor(private readonly store: ChapterTwoStore, private readonly identity: BusinessIdentity, private readonly now: () => Date = () => new Date(), private readonly id: () => string = randomUUID) {}
  async provision(input: CompanyProvisioningInput) {
    const tenantId = input.tenantId ?? `tenant-${this.id()}` as TenantId, companyId = input.companyId ?? `company-${this.id()}` as CompanyId, userId = input.ownerUserId ?? `user-${this.id()}` as UserId, branchId = `branch-${this.id()}`, warehouseId = input.warehouseId ?? `warehouse-${this.id()}` as WarehouseId;
    const capabilities = ROLE_POLICIES.Propietario as ActorContext["capabilities"];
    let ownerRoleId = "", ownerBranchId = branchId;
    await this.store.transact((state) => {
      const conflicting = state.platformDomains.find((d) => d.hostname.toLowerCase() === input.hostname.toLowerCase() && d.companyId !== companyId); if (conflicting) throw new Error("domain_already_assigned");
      if (!state.platformTenants.some((t) => t.id === tenantId)) state.platformTenants.push({ id: tenantId, name: input.name, status: input.status ?? "active", createdAt: this.now().toISOString() });
      if (!state.platformCompanies.some((company) => company.id === companyId)) state.platformCompanies.push({ id: companyId, tenantId, slug: input.slug, name: input.name, legalName: input.legalName, taxId: input.taxId, address: input.address, phone: input.phone, email: input.email, currency: input.currency ?? "DOP", timezone: input.timezone ?? "America/Santo_Domingo", primaryColor: input.primaryColor ?? "#0b7285", enabledModules: input.enabledModules, status: input.status ?? "active", createdAt: this.now().toISOString() });
      if (!state.platformDomains.some((d) => d.companyId === companyId && d.hostname === input.hostname)) state.platformDomains.push({ id: `domain-${this.id()}`, tenantId, companyId, hostname: input.hostname.toLowerCase(), kind: input.hostname.includes("localhost") ? "audit-path" : "subdomain", status: "active" });
      const existingBranch=state.branches.find(b=>b.companyId===companyId);ownerBranchId=existingBranch?.id??branchId;if(!existingBranch)state.branches.push({ id: branchId, tenantId, companyId, name: input.branchName ?? "Principal", address: input.address, status: "active" });
      if (!state.warehouses.some((w) => w.companyId === companyId)) state.warehouses.push({ id: warehouseId, tenantId, companyId, branchId, name: input.warehouseName ?? "Almacén principal", status: "active" });
      const existingRole=state.roles.find(role=>role.companyId===companyId&&role.name==="Propietario");ownerRoleId=existingRole?.id??`role-${this.id()}`;if(!existingRole)state.roles.push({id:ownerRoleId,tenantId,companyId,name:"Propietario",capabilities,system:true,status:"active"});else existingRole.capabilities=capabilities;
    });
    await this.identity.provisionAccount({ email: input.ownerEmail, password: input.ownerPassword, tenantId, companyId, userId, capabilities, name: "Propietario", roleId: ownerRoleId, branchIds: [ownerBranchId] });
    return { tenantId, companyId, userId, warehouseId };
  }
  async listCompanies() { const state = await this.store.snapshot(); return state.platformCompanies.map((company) => ({ ...company, domains: state.platformDomains.filter((d) => d.companyId === company.id), users: state.memberships.filter((m) => m.companyId === company.id).length, branches: state.branches.filter((b) => b.companyId === company.id).length, warehouses: state.warehouses.filter((w) => w.companyId === company.id).length })); }
}
