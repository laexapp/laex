import 'server-only';
import type { EpsonPartnerPortalCredentials } from '../EpsonPartnerPortalConnector';
export function getEpsonPartnerPortalCredentials():EpsonPartnerPortalCredentials{return{enabled:process.env.EPSON_PARTNER_PORTAL_ENABLED==='true',accessToken:process.env.EPSON_PARTNER_PORTAL_ACCESS_TOKEN??'',authorizationReference:process.env.EPSON_PARTNER_PORTAL_AUTHORIZATION_REFERENCE??''};}
