export type LearningLevel="Inicial"|"Intermedio"|"Avanzado";export type LearningStatus="Disponible"|"Próximamente";
export interface LearningReference{type:"market"|"news"|"community"|"media"|"project";label:string;href:string}
export interface Lesson{id:string;title:string;duration:number;summary:string;objectives:string[];references:LearningReference[]}
export interface LearningPath{id:string;slug:string;title:string;description:string;level:LearningLevel;status:LearningStatus;accent:"cyan"|"violet"|"green"|"orange";lessons:Lesson[];skills:string[];ai:{reason:string;confidence:number}}
export interface LearnerSignal{completedLessonIds:string[];interests:string[];level:LearningLevel}
