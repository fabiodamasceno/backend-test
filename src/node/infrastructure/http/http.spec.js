import Joi from 'joi'

import validate from './validate'
import * as response from './response'

const schema = Joi.object().keys({
  name: Joi.string().required()
})

const validateReq = validate(schema)
const createCtx = (name = null) => ({
  request: {
    body: {name}
  }
})

describe('validate middleware', () => {

  it('should set ctx.body on invalid input', async () => {
    let ctx = createCtx()
    const nextMock  = jest.fn()

    await validateReq(ctx, nextMock)

    expect(ctx.status).toBe(400)
    expect(ctx.body.info).toBe('Invalid input')
    expect(ctx.body.details).toBeDefined()
    expect(nextMock).not.toBeCalled()
  })

  it('should call next when input is valid', async () => {
    let ctx = createCtx('chicocode.io')
    const nextMock = jest.fn()

    await validateReq(ctx, nextMock)

    expect(ctx.status).not.toBeDefined()
    expect(nextMock).toBeCalled()
  })
  
})

describe('response helper', () => {

  it('should set ctx on NotFound', () => {
    let ctx = createCtx()

    response.NotFound(ctx)

    expect(ctx.status).toBe(204)
    expect(ctx.body.info).toBe('NotFound')
  })

  it('should set ctx on Ok', () => {
    let ctx = createCtx()

    let body = {prop: 1, prop2: 'a'}
    response.Ok(body, ctx)

    expect(ctx.status).toBe(200)
    expect(ctx.body).toBe(body)
  })

  it('should call next if passed on Ok', async () => {
    let ctx = createCtx()

    const nextMock = jest.fn()
    await response.Ok(null, ctx, nextMock)

    expect(nextMock).toBeCalled()
  })
  
})

describe('error_handler middleware', () => {

  const log = require('../log')
  const error_handler = require('./error_handler').default

  jest.mock('../log', () => ({error: jest.fn()}))

  it('should not set context if next function has no errors', () => {
    let ctx = {}

    const nextMock = jest.fn()
    error_handler(ctx, nextMock)

    expect(ctx).toEqual({})
    expect(nextMock).toBeCalled()
  })

  it('should log error and set error context if next function has errors', () => {
    let ctx = {}

    const err = new Error('System exception')
    const nextMock = jest.fn(() => {throw err})
    error_handler(ctx, nextMock)

    expect(nextMock).toBeCalled()
    expect(ctx).toEqual({status: 500, body: err})
    expect(log.error).toBeCalled()
  })

  it('should log error and set error context if next async function has errors', async () => {
    let ctx = {}

    const err = new Error('System exception')
    const nextMock = jest.fn(async () => {throw err})
    await error_handler(ctx, nextMock)

    expect(ctx).toEqual({status: 500, body: err})
    expect(log.error).toBeCalled()
  })
  
})