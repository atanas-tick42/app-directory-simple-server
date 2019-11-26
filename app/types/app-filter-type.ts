import { FDC3AppConfig } from "./fdc3-app-config";

export type AppFilter = {
  filterApps(apps: FDC3AppConfig[], roles: string[]): Promise<FDC3AppConfig[]>;
}