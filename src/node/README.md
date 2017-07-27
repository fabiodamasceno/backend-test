# Node Backend Api
This application is the node port from php code requested in Task 2.
  
# Notes
  - This app was written in _ES2017_ using Babel,
  - Tasks were automated through npm & yarn scripts,
  - Because of commands like pipe, this should work only in a unix based environment and
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
`yarn dev:watch` will start nodemon to compile and refresh the app on save. Also errors are [pretty printed](https://github.com/AriaMinaei/pretty-error) in dev mode. Finally output is piped to bunyan to pretty print logs too.

### Tests
Tests were written using Jest. The test files are next to source feature being tested. `yarn test` will lint code and run all tests to generate code coverage. If you want to see and browse generated statistics on your browser you can run `yarn open:coverage`.

`yarn test:watch` will run tests and bring jest interactive console. The code coverage was disabled in watch mode to speed up feedback.

By default Jest will try to find affected tests since the last commit. You can type `a` to run all tests.

### Integration tests
Integration tests uses [supertest](https://github.com/visionmedia/supertest) to start api and create a facade to make requests. Assertions are made using the [jest snapshot](https://facebook.github.io/jest/docs/snapshot-testing.html) feature.

This tools are awesome because they will ensure that changes to the code won't break any previous api contract accidentaly.

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

### About nice to have

#### Validation
Validation are made in three points of application:

1. When a request happens (via koa middleware)
2. Before insert a model (via bookshelf plugin)
3. Before update a model (via bookshelf plugin)

A [joi schema](https://github.com/hapijs/joi) in the Model will validate the events. 
A centralized schema can be created for every event, or each event can have your own schema.
e.g.
```bash
➜  node git:(master) ✗ http POST localhost:3001/venues nameS=venue_name
HTTP/1.1 400 Bad Request
Connection: keep-alive
Content-Length: 257
Content-Type: application/json; charset=utf-8
Date: Thu, 27 Jul 2017 13:11:59 GMT

{
    "details": [
        {
            "context": {
                "key": "name"
            }, 
            "message": "'name' is required", 
            "path": "name", 
            "type": "any.required"
        }, 
        {
            "context": {
                "child": "nameS", 
                "key": "nameS"
            }, 
            "message": "'nameS' is not allowed", 
            "path": "nameS", 
            "type": "object.allowUnknown"
        }
    ], 
    "info": "Invalid input"
}

```