import fs from 'fs'
import * as path from "path";
import minimist from 'minimist'
import csvtojson from 'csvtojson'
import through from 'through2'
import messages from '../../config/msg.json'

const {
  HELP_MSG,
  REVERSE_MSG,
  OUTPUTFILE_MSG,
  NOFILE_MSG,
  TRANSFORM_MSG,
  CONVERTFILE_MSG
} = messages
const {argv} = process
const CMD = {
  HELP: 'help',
  ACTION: 'action',
  FILE: 'file',
}
const minimistOptions = {
  string: [CMD.ACTION, CMD.FILE],
  boolean: CMD.HELP,
  alias: {h: CMD.HELP, a: CMD.ACTION, f: CMD.FILE}
}
const parsedArgs = minimist(argv.slice(2), minimistOptions);
const {help, action, file} = parsedArgs
const noArgs = () => argv.length < 3
const helpIsFirst = () => noArgs()
  ? false
  : help && [CMD.HELP, 'h'].includes(argv.slice(2, 3).pop().split('-').pop())

if (noArgs() || helpIsFirst()) {
  console.log(HELP_MSG)
} else {
  switch (action) {
    case 'outputFile':
      if (!file) {
        console.log(NOFILE_MSG)
        break
      }
      console.log(`${OUTPUTFILE_MSG} ${file}:\n\n`)
      outputFile()
      break
    case 'convertFromFile':
      if (!file) {
        console.log(NOFILE_MSG)
        break
      }
      console.log(`${OUTPUTFILE_MSG} ${file} in JSON:\n\n`)
      convertFromFile()
      break;
    case 'convertToFile':
      if (!file) {
        console.log(NOFILE_MSG)
        break
      }
      convertToFile()
      break;
    case 'transform':
      console.log(TRANSFORM_MSG)
      transform()
      break
    case 'reverse':
    default:
      console.log(REVERSE_MSG)
      reverse()
  }
}


function reverse() {
  const reverseStream = through(write, end);

  function write(buffer, encoding, next) {
    this.push(buffer.toString().split('').reverse().join('') + "\n")
    next()
  }

  function end(done) {
    done()
  }

  process.stdin.pipe(reverseStream).pipe(process.stdout);
}

function transform() {
  const transformStream = through(write, end);

  function write(buffer, encoding, next) {
    this.push(buffer.toString().toUpperCase() + "\n")
    next()
  }

  function end(done) {
    done()
  }

  process.stdin.pipe(transformStream).pipe(process.stdout);
}

function outputFile() {
  fs.createReadStream(path.resolve(file))
    .on('error', function (err) {
      if (err.code === 'ENOENT') console.log(NOFILE_MSG)
    })
    .pipe(process.stdout);
}

function convertFromFile() {
  fs.createReadStream(path.resolve(file))
    .on('error', function (err) {
      if (err.code === 'ENOENT') console.log(NOFILE_MSG)
    })
    .pipe(csvtojson())
    .pipe(process.stdout)
}

function convertToFile() {
  const csvFile = path.resolve(file);
  const jsonFile = csvFile.split('/').pop().split('.csv').shift() + '.json'
  const writeJsonStream = fs.createWriteStream(jsonFile);

  fs.createReadStream(csvFile)
    .on('error', function (err) {
      if (err.code === 'ENOENT') console.log(NOFILE_MSG)
    })
    .pipe(csvtojson())
    .pipe(writeJsonStream)
    .on('close', () => {
      console.log(`${CONVERTFILE_MSG}${jsonFile}\n`)
    })
}

