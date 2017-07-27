# Node Backend Api
This application is the node port from php code requested in Task 2.
  
# Notes
  - This app was written in _ES2017_ using Babel,
  - Tasks were automated through npm & yarn scripts,
  - Because of commands like pipe, this should work only in a unix based environment,
  - There are no "Models" folder, [see here why](https://github.com/wearehive/project-guidelines#structure-and-naming).

# Application

### Setup
```sh
yarn
yarn migrate
yarn start
```
The command `yarn` will resolve and fetch dependencies. 
The command `yarn migrate` will create the database and apply migrations on a SQLite file (database is generated with seed data).
`yarn start` will start application (port will be the one specified at the environment variable `PORT` or 3001).

### Development
`yarn dev:watch` will starts nodemon to compile and refresh the app on save. Also errors are [pretty printed](https://github.com/AriaMinaei/pretty-error) in dev mode. Finally output is piped to bunyan to pretty print logs too.

### Tests
Tests were written using Jest. The test files are closed to source feature being tested. `yarn test` will run all tests and generate code coverage. If you want to see and browse generated statistics on your browser you can run `yarn open:coverage`.
`yarn test:watch` will run tests and bring jest interactive console. The code coverage was disabled in watch mode to speed up feedback.

#### package.json tasks

| script | role |
| ------ | ------ |
| clean | cleans genereated content |
| lint | lints code using eslint |
| compile | compiles code using babel |
| migrate | migrates database  |
| migrate:rollback | rollbacks database |
| test | run all tests, code coverage is generated |
| test:watch | run all tests, jest interactive mode |
| open:coverage | open code covera report in default browser |
| test:integration | run all integration tests |
| dev | runs the application dev tools |
| dev:watch | runs the application with dev tools and watch for changes |
| start | runs the application  |
