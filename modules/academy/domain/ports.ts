import type{LearnerSignal,LearningPath}from"./types";
export interface AcademyRepository{listPaths():Promise<LearningPath[]>;findPath(slug:string):Promise<LearningPath|undefined>}
export interface AcademyAIProvider{recommend(paths:LearningPath[],signal:LearnerSignal):Promise<{pathId:string;reason:string;confidence:number}[]>;explain(question:string,contextIds:string[]):Promise<{answer:string;sources:string[];confidence:number}>}
export interface LearningEventPublisher{publish(event:{type:string;version:1;occurredAt:string;payload:unknown}):Promise<void>}
