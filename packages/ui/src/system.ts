import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
import path from 'path'
import os from 'os'
import {
  IConfigService,
  HiveService,
  SoilService,
  IGitService,
  ITanajuraService,
  ConfigServerService,
  LocalDB,
  StingerService,
  IFilesService,
  ConfigService,
  GitService,
  TanajuraService,
  FilesService,
  IHttpClient,
  httpClient,
  KubectlService,
  IKubectlService,
  IJSONStorage,
} from '@formicarium/common'
import { ElectronJsonStorage } from '~/services/json-storage.electron';

export interface ISystem {
  configService: IConfigService
  hiveService: HiveService
  soilService: SoilService
  gitService: IGitService
  tanajuraService: ITanajuraService
  configServerService: ConfigServerService
  localDB: LocalDB,
  stingerService: StingerService
  httpClient: IHttpClient
  filesService: IFilesService
  kubectl: IKubectlService
  jsonStorage: IJSONStorage,
}

export const getSystem = async (): Promise<ISystem> => {
  const configService = new ConfigService()
  const { devspace: { hiveApiUrl, configServerUrl }, soilUrl } = await configService.readConfig()
  const hiveService = new HiveService(hiveApiUrl, httpClient)
  const soilService = new SoilService(soilUrl, httpClient)
  const gitService = new GitService()
  const tanajuraService = new TanajuraService(httpClient)
  const configServerService = new ConfigServerService(configServerUrl, httpClient)
  const dbPath = path.resolve(os.homedir(), '.fmc/db.json')
  const db = await low(new FileAsync(dbPath))
  const localDB = new LocalDB(db)
  const stingerService = new StingerService(httpClient, localDB)
  const filesService = new FilesService()
  const kubectl = new KubectlService()
  const jsonStorage = new ElectronJsonStorage()
  return {
    configService,
    soilService,
    hiveService,
    gitService,
    tanajuraService,
    configServerService,
    localDB,
    stingerService,
    httpClient,
    filesService,
    kubectl,
    jsonStorage,
  }
}
