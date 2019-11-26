import { AppReader } from "../types/app-reader-type";
import { FileAppReader } from "./file-app-reader";
import { HttpAppReader } from "./http-app-reader";

export function appReaderFactory(type: string, config: any): AppReader {
  if (type === 'file') {
    return new FileAppReader(config);
  } else if(type === 'url') {
    return new HttpAppReader(config);
  }

  throw new Error(`Unknown app reader type "${type}"`)
}