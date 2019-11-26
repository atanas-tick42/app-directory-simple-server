import {ApplicationConfig as GlueAppConfig} from 'tick42-glue-desktop-schemas';
import { FDC3AppConfig } from './types/fdc3-app-config';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const isDev = !!process.argv.find(arg => arg === '--dev');
const assetsDir = isDev ? path.join(__dirname, '../assets') :path.join(path.dirname(process.execPath), '/assets')

const configToManifest = (config: GlueAppConfig): FDC3AppConfig => {
  return {
    appId: config.name,
    name: config.name,
    version: "1",
    title: config.title,
    manifestType: "Glue42",
    manifest: JSON.stringify(config)
  }
}

export {
  configToManifest,
  readDir,
  readFile,
  assetsDir,
  isDev
}