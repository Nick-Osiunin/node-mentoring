import config from '../config/json.json'
import {DirWatcher, Importer} from './utils'

const {dataFolder, readDelay, type} = config
const dirWatcher = new DirWatcher(dataFolder, readDelay)
const importer = new Importer(dirWatcher.emitter, type)

dirWatcher.watch()