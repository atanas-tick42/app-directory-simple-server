import { FDC3AppConfig } from "./fdc3-app-config";

export type AppReader = {
  getApps(): Promise<FDC3AppConfig[]>;
}