import type { App } from "vue";

import type { WithInstallFunction } from './type'

export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  const c = main as WithInstallFunction<T>;
  
  c.install = function (app: App) {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.displayName || comp.name, comp)
    }
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }

  return main;
};