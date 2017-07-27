import bunyan from 'bunyan'

// istanbul ignore next: environment should be always test for istanbul
const env = process.env.NODE_ENV || 'development'

let levelConfig = {
  test: 'debug',
  production: 'trace',
  development: 'trace'
}

const config = {name: 'deskbookers-api', stream: process.stdout, level: levelConfig[env]}
const log = bunyan.createLogger(config)

export default log