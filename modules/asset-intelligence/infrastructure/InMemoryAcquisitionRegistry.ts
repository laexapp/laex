import type { AcquisitionRegistry } from '../domain/ports';
import type { AcquisitionRecord } from '../domain/types';

export class InMemoryAcquisitionRegistry implements AcquisitionRegistry {
  private readonly records=new Map<string,AcquisitionRecord>();
  async save(record:AcquisitionRecord){this.records.set(record.id,structuredClone(record));}
  async find(recordId:string){const record=this.records.get(recordId);return record?structuredClone(record):undefined;}
  async findByLogicalAsset(projectId:string,logicalAssetId:string){return[...this.records.values()].filter(record=>record.projectId===projectId&&record.logicalAssetId===logicalAssetId).map(record=>structuredClone(record));}
  async list(){return[...this.records.values()].map(record=>structuredClone(record));}
}
