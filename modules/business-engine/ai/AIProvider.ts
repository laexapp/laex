import type { ActorContext } from "../domain/types";
import type { AssistantToolName, ConversationTurn, InterpretedRequest } from "../assistant/ConversationalProvider";

export type AIProviderInput = { actor: ActorContext; agent: "LIA"|"ALAN"|"ETHAN"; message: string; history: ConversationTurn[]; availableTools: AssistantToolName[] };
export type AIProviderOutput = InterpretedRequest & { usage: { inputUnits: number; outputUnits: number; estimatedCostUsdMicros: number }; dataCategories: string[] };
export interface AIProvider { readonly id: string; readonly mode: "deterministic"|"cloud"|"local-model"; readonly model: string; interpret(input: AIProviderInput): Promise<AIProviderOutput>; }

export class AIProviderUnavailableError extends Error { constructor(){super("El asistente inteligente está temporalmente no disponible. Las funciones normales de LAEX continúan operativas.");this.name="AIProviderUnavailableError"} }
