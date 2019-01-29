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
  CONVERTFILE_MSG,
  CONVERTFILE_INTRO_MSG,
} = messages
const ARGS_SUPPORTED = {
  HELP: 'help',
  ACTION: 'action',
  FILE: 'file',
}
const ACTIONS = {
  REVERSE: 'reverse',
  TRANSFORM: 'transform',
  OUTPUTFILE: 'outputFile',
  CONVERTFROMFILE: 'convertFromFile',
  CONVERTTOFILE: 'convertToFile',
}
const minimistOptions = {
  string: [ARGS_SUPPORTED.ACTION, ARGS_SUPPORTED.FILE],
  boolean: ARGS_SUPPORTED.HELP,
  alias: {h: ARGS_SUPPORTED.HELP, a: ARGS_SUPPORTED.ACTION, f: ARGS_SUPPORTED.FILE}
}

const {argv} = process
const parsedArgs = minimist(argv.slice(2), minimistOptions);
const {help, action, file} = parsedArgs
const actionsInfo = {
  [ACTIONS.REVERSE]: {
    introMsg: REVERSE_MSG,
    modifier: str => str.split('').reverse().join(''),
  },
  [ACTIONS.TRANSFORM]: {
    introMsg: TRANSFORM_MSG,
    modifier: str => str.toUpperCase(),
  },
  [ACTIONS.OUTPUTFILE]: {
    introMsg: `${OUTPUTFILE_MSG} ${file}:\n`,
    handleStream: stream => stream.pipe(process.stdout),
    fileRequired: true,
  },
  [ACTIONS.CONVERTFROMFILE]: {
    introMsg: `${OUTPUTFILE_MSG} ${file} in JSON:\n`,
    handleStream: stream => jsonFromCsv(stream).pipe(process.stdout),
    fileRequired: true,
  },
  [ACTIONS.CONVERTTOFILE]: {
    introMsg: `${CONVERTFILE_INTRO_MSG} ${file}:`,
    handleStream: stream => jsonFromCsv(stream).pipe(getWriteStream(file)),
    fileRequired: true,
  },
}

const CTRLC_MSG = `\n\nAction: "${action}" successfully performed.\n`
const fileRelatedActions = Object.entries(actionsInfo)
  .filter(item => item[1].fileRequired)
  .map(item => item[0])

const directInputActions = Object.entries(actionsInfo)
  .filter(item => !item[1].fileRequired)
  .map(item => item[0])

const noArgs = () => argv.length < 3
const helpIsFirst = () => noArgs()
  ? false
  : help && [ARGS_SUPPORTED.HELP, 'h'].includes(argv.slice(2, 3).pop().split('-').pop())
const unknownAction = () => !Object.values(ACTIONS).includes(action)
const convertedFileName = file => file.split('/').pop().split('.csv').shift() + '.json'

process.on('SIGINT', function () {
  console.log(CTRLC_MSG)
  process.exit(0)
})

// Print commands list
if (noArgs() || unknownAction() || helpIsFirst()) {
  console.log(HELP_MSG)
  process.exit(0)
}

// User direct input actions
if (directInputActions.includes(action)) {
  console.log(actionsInfo[action].introMsg)
  transformUserInput(action)
}

// File related actions
if (fileRelatedActions.includes(action)) {
  console.log(actionsInfo[action].introMsg)
  const readStream = getStreamOrDie(file)
  actionsInfo[action]
    .handleStream(readStream)
    .on('close', () => {
      console.log(`${CONVERTFILE_MSG}${convertedFileName(file)}\n`)
    })
}

function transformUserInput(action) {
  const finalStream = through(write);
  const modifyBuffer = (buffer) =>
    actionsInfo[action]
      .modifier(buffer.toString()) + "\n"

  process.stdin
    .pipe(finalStream)
    .pipe(process.stdout);

  function write(buffer, encoding, next) {
    this.push(modifyBuffer(buffer))
    next()
  }
}

function getStreamOrDie(filename) {
  if (!filename) {
    fileAccessError()
  }
  return fs.createReadStream(path.resolve(filename))
    .on('error', function (err) {
      if (err.code === 'ENOENT') {
        fileAccessError()
      }
    })
}

function fileAccessError() {
  console.log(NOFILE_MSG)
  process.exit(0);
}

function jsonFromCsv(stream) {
  return stream.pipe(csvtojson())
}

function getWriteStream(file) {
  return fs.createWriteStream(convertedFileName(file));
}
