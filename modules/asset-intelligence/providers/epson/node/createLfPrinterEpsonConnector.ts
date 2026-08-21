import 'server-only';
import { EpsonPublicConnector } from '../EpsonPublicConnector';
import { lfPrinterEpsonPublicCatalog } from '../lf-printer-public-catalog';
import { StrictEpsonPublicConnector } from '../StrictEpsonPublicConnector';
import { NodeEpsonPublicTransport } from './NodeEpsonPublicTransport';

export function createLfPrinterEpsonPublicConnector(){return new StrictEpsonPublicConnector(new EpsonPublicConnector(lfPrinterEpsonPublicCatalog,new NodeEpsonPublicTransport(),2000));}
