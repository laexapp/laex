import type { AcquisitionStatus } from './types';

const transitions:Record<AcquisitionStatus,readonly AcquisitionStatus[]>={
  discovered:['official-source-required','rights-review','acquisition-authorized','quality-rejected','failed'],
  'official-source-required':['discovered','failed'],
  'rights-review':['acquisition-authorized','rejected','failed'],
  'acquisition-authorized':['acquired','quality-rejected','failed'],
  acquired:['ready-for-processing','quality-rejected','failed'],
  'quality-rejected':['discovered','superseded'],
  'ready-for-processing':['processing','failed'],
  processing:['review-required','failed'],
  'review-required':['approved','rejected','superseded'],
  approved:['published','superseded'],
  rejected:['discovered','superseded'],
  published:['superseded'],
  superseded:[],
  failed:['discovered','superseded'],
};

export function assertLifecycleTransition(from:AcquisitionStatus,to:AcquisitionStatus){
  if(!transitions[from].includes(to))throw new Error(`Transici?n de activo no permitida: ${from} -> ${to}`);
}

export const requiresHumanReview=(status:AcquisitionStatus)=>status==='review-required';
