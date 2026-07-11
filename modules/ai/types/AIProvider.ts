export interface AIProvider {
  name: string;

  chat(prompt: string): Promise<string>;

  generateImage?(prompt: string): Promise<string>;

  embeddings?(text: string): Promise<number[]>;
}