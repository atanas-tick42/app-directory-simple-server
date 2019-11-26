import { AppFilter } from "../types/app-filter-type";
import { SQLiteAppFilter } from "./sqlite-app-filter";

export function appFilterFactory(type: string, config: any): AppFilter {
  if (type === 'SQLite') {
    return new SQLiteAppFilter(config);
  }

  throw new Error(`Unknown app filter type "${type}"`)
}