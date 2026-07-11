export interface Module {
  id: string;
  name: string;
  version: string;

  initialize(): Promise<void>;

  destroy?(): Promise<void>;
}