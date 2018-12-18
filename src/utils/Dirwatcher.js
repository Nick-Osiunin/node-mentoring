import fs from 'fs'
import EventEmitter from 'events'

export default class DirWatcher {
  constructor(path, delay) {
    this.path = path
    this.delay = delay
    this.readDirLoop = null
    this.processedFileList = []
    this.emitter = new EventEmitter()
  }

  processNewFiles(files) {
    const diff = files.filter(item => !this.processedFileList.includes(item))
    if (!diff.length) return null

    this.processedFileList =
      this.processedFileList
        .concat(diff)
        .sort()

    const event = {
      name: 'dirwatcher:changed',
      payload: diff.map(file => `${this.path}/${file}`)
    }

    this.emitter.emit(event.name, event.payload)
  }

  watch() {
    const {path, delay} = this
    if (this.readDirLoop) {
      clearInterval(this.readDirLoop)
    }

    this.readDirLoop = setInterval(() => {
      fs.readdir(path, (err, files) => {
        if (err) throw err;
        this.processNewFiles(files);
      })
    }, delay)
  }
}
