import type { Module } from "./Module";

export class ModuleManager {
  private modules: Module[] = [];

  register(registeredModule: Module) {
    this.modules.push(registeredModule);
  }

  async initializeAll() {
    for (const registeredModule of this.modules) {
      await registeredModule.initialize();
    }
  }

  getModules() {
    return this.modules;
  }
}