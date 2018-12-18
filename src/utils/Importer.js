import fs from 'fs'
import util from 'util'
import parse from 'csv-parse/lib/sync'

const readFileAsync = util.promisify(fs.readFile);

export default class Importer {
  constructor(emitter, type) {
    emitter.on('dirwatcher:changed', this.onChange.bind(this))
    this.type = type
  }

  onChange(files) {
    files.forEach(file => {

      switch (this.type) {
        case 'sync':
          console.log(this.importSync(file))
          break
        case 'async':
          const asyncRes = this.import(file)
          console.log(asyncRes)
          asyncRes.then(item => console.log(item))
      }
    })
  }

  importSync(path) {
    const input = fs.readFileSync(path).toString()
    const data = parse(input, {
      columns: true,
      skip_empty_lines: true
    })
    return data
  }

  async import(path) {
    try {
      const input = await readFileAsync(path)
      return parse(input.toString(), {
        columns: true,
        skip_empty_lines: true
      })
    } catch (err) {
      throw err
    }
  }
}