const secretPatterns=[/\b(?:api[_-]?key|password|secret|private[_-]?key|certificate)[=: ]+\S+/gi,/\b(?:sk-[A-Za-z0-9_-]{12,})\b/g,/\b\d{13,19}\b/g];
export function redactForProvider(value:string){return secretPatterns.reduce((text,pattern)=>text.replace(pattern,"[REDACTADO]"),value).slice(0,8000)}
export function detectPromptInjection(value:string){return /ignora (?:tus|las) reglas|revela (?:todos|todas)|system prompt|actúa como administrador|bypass|omite permisos/i.test(value)}
export function dataCategories(value:string){const categories=["user_instruction"];if(/\b\d{3}[- ]?\d{3}[- ]?\d{4}\b/.test(value))categories.push("contact_phone");if(/\b(?:calle|avenida|ensanche|casa)\b/i.test(value))categories.push("address");return categories}
