import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import error_handler from './infrastructure/http/error_handler'

import venues from './venues'

function not_found(ctx) {
  if (ctx.body)
    return
  ctx.status = 404
  ctx.body = { error: 'Page not found' }
}

const app = new Koa()
  .use(error_handler)
  .use(bodyParser())
  .use(venues.routes())
  .use(not_found)

export default app