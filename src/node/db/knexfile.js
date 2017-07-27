const baseSetting = {
  client: 'sqlite3',
  connection: {filename: ''},
  pool: 1,
  migrations: {
    tableName: 'migrations',
    directory: `${__dirname}/../db/migrations`
  },
  useNullAsDefault: true
}

const baseSettingsWith = filename => Object
  .assign({}, baseSetting, {connection: {filename}})

module.exports = {
  test: baseSettingsWith('./db.test.sqlite3'),
  development: baseSettingsWith('./db.development.sqlite3'),
  production: baseSettingsWith('./db.production.sqlite3'),
}
