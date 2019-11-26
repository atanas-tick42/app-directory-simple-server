import { AppReader } from "../../types/app-reader-type";
import { FDC3AppConfig } from "../../types/fdc3-app-config";

class HttpAppReader implements AppReader {
  constructor(config: any) {

  }

  getApps(): Promise<FDC3AppConfig[]> {
    return new Promise((res, rej) => {
      res();
    })
  }
}

export {
  HttpAppReader
}