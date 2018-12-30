import config from '../config/json.json'
import {DirWatcher, Importer} from './utils'
import {EVENTS} from './utils/Dirwatcher'

const {dataFolder, readDelay} = config
const dirWatcher = new DirWatcher(dataFolder, readDelay)
const safeStop = gracefulShutdown.bind(this, dirWatcher)

const runImport = (process.env.IMPORT_MODE === 'sync')
  ? (file) => {
    console.log(Importer.importSync(file))
  }
  : (file) => {
    Importer
      .import(file)
      .then(item => console.log(item))
  }

dirWatcher.subsrcribe
  .on(EVENTS.FILE_CHANGE, (files) => {
    files.forEach(file => {
      runImport(file)
    })
  })
  .on(EVENTS.FILE_REMOVED, (file) => {
    console.log(`${file} removed`)
  })

process.on('SIGINT', safeStop)
process.on('SIGTERM', safeStop)

function gracefulShutdown(dirWatcher) {
  try {
    dirWatcher
      .stopWatching()
      .removeAllListeners(EVENTS.FILE_CHANGE)
      .removeAllListeners(EVENTS.FILE_REMOVED)
    console.log('\nStop watching folder...')
    process.exit(0)
  } catch (e) {
    console.log('\nProgram interrupted unexpectedly\n', e)
    process.exit(1)
  }
}
