import fs from 'fs'
import util from 'util'
import * as path from 'path'
import parse from 'csv-parse/lib/sync'

const readFileAsync = util.promisify(fs.readFile);

export default class Importer {
  static importSync(fileName) {
    try {
      fileName = path.resolve(fileName)
      const input = fs.readFileSync(fileName).toString()
      return parse(input, {
        columns: true,
        skip_empty_lines: true
      })
    } catch (err) {
      console.log('\nImport error!\n')
      throw err
    }
  }

  static async import(fileName) {
    try {
      fileName = path.resolve(fileName)
      const input = await readFileAsync(fileName)
      return parse(input.toString(), {
        columns: true,
        skip_empty_lines: true
      })
    } catch (err) {
      console.log('\nImport error!\n')
      throw err
    }
  }
}