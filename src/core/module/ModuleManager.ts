import type { Module } from "./Module";

export class ModuleManager {
  private modules: Module[] = [];

  register(module: Module) {
    this.modules.push(module);
  }

  async initializeAll() {
    for (const module of this.modules) {
      await module.initialize();
    }
  }

  getModules() {
    return this.modules;
  }
}