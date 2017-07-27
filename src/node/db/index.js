import knexBuild from 'knex'
import knexfile from  './knexfile'

import bookshelfBuild from 'bookshelf'
import validate from './validate'
import cascade from 'bookshelf-cascade-delete'

// istanbul ignore next: environment should be always test for istanbul
const env = process.env.NODE_ENV || 'development'

export const knex = knexBuild(knexfile[env])

const bookshelf = bookshelfBuild(knex)
bookshelf.plugin(validate)
bookshelf.plugin(cascade)

export default bookshelf