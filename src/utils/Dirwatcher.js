import fs from 'fs'
import * as path from 'path'
import EventEmitter from 'events'
import md5 from 'md5'

const EVENTS = {
  FILE_CHANGE: Symbol('File changes'),
  FILE_REMOVED: Symbol('File removed'),
}

class DirWatcher {
  constructor(dirPath, delay) {
    this.dirPath = dirPath
    this.delay = delay
    this.readDirLoop = null
    this.processedFileList = new Map()
    this.subsrcribe = new EventEmitter()
    this.watch()
    return this
  }

  stopWatching() {
    clearInterval(this.readDirLoop)
    return this.subsrcribe
  }

  watch() {
    const {dirPath, delay} = this
    const context = this

    if (this.readDirLoop) {
      this.stopWatching()
    }

    context.readDirLoop = setTimeout(function runLoop() {
      fs.readdir(path.resolve(dirPath), (err, files) => {
        if (err) throw err;
        context.processNewFiles(files)
      })
      context.readDirLoop = setTimeout(runLoop, delay)
    }, delay)
  }

  processNewFiles(files) {
    try {
      const currentFileList = files.map(file => {
        const fullpath = path.resolve(this.dirPath, file)
        const hash = md5(fs.readFileSync(fullpath).toString())
        return [fullpath, hash]
      })

      const removedFilesQty = this.processedFileList.size - currentFileList.length

      const newFiles = currentFileList.filter(item => {
        return this.processedFileList.get(item[0]) !== item[1]
      })

      if (removedFilesQty > 0) {
        const currentPaths = currentFileList.map(item => item[0])
        const savedPaths = [...this.processedFileList.keys()]
        const removedPaths = savedPaths.filter(filepath => !currentPaths.includes(filepath))
        this.subsrcribe.emit(EVENTS.FILE_REMOVED, removedPaths)
        removedPaths.forEach(path => this.processedFileList.delete(path))
      }

      if (newFiles.length) {
        this.subsrcribe.emit(EVENTS.FILE_CHANGE, newFiles.map(item => item[0]))
        this.processedFileList = new Map([...this.processedFileList, ...newFiles])
      }
    } catch (err) {
      throw err
    }
  }
}

export default DirWatcher
export {DirWatcher, EVENTS}