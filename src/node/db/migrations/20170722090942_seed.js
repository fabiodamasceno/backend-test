const fs = require('fs')

function getSeed(Promise) {
  return new Promise((accept, reject) => {
    fs.readFile('./db/migrations/data.sql', (err, data) => {
      if(err)
        reject(err)

      let lines = data
        .toString()
        .split('\n')
        .filter(data => data !== '')

      accept(lines)
    })
  })
}

exports.up = function(knex, Promise) {
  return getSeed(Promise)
    .then(lines => {
      let seed = lines.map(data => knex.raw(data))
      return Promise.all(seed)
    })
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from `spaces`'),
    knex.raw('delete from `products`'),
    knex.raw('delete from `items`'),
    knex.raw('delete from `venues`')
  ])
}
