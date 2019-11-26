import { AppReader } from "../../types/app-reader-type";
import { FDC3AppConfig } from "../../types/fdc3-app-config";
import { readDir, readFile, configToManifest, assetsDir } from "../../utils";
import * as path from 'path';
import * as json from 'comment-json';

class FileAppReader implements AppReader {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  getApps(): Promise<FDC3AppConfig[]> {
    return readDir(path.join(assetsDir, this.config.folder))
      .then((files: any) => {
        return files.map((fileName: string) => {
          return readFile(path.join(assetsDir, this.config.folder, fileName), 'utf8').then(json.parse).catch(err => {
          })
        })
      })
      .then((promises: Promise<any>[]) => Promise.all(promises))
      .then((configs: any) => {
          let appConfigs = configs.reduce((acc: any, cfg: any) => acc.concat(Array.isArray(cfg) ? cfg.map(configToManifest): configToManifest(cfg)), []);
          return appConfigs
      })
      .catch((err) => {
        console.log('could not read dir', path.join(assetsDir, this.config.folder));
        console.log(err);
      })
  }
}

export {
  FileAppReader
}