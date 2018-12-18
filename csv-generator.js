const csv = require('csv')

csv.generate({
  columns: ['ascii', 'int', 'bool'],
  length: 15
}).pipe(process.stdout)