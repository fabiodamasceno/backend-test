export const NotFound = ctx => {
  ctx.status = 204
  ctx.body = {
    info: 'NotFound'
  }  
}

export const Ok = async (body, ctx, next) => {
  ctx.status = 200
  ctx.body = body
  if(next)
    await next()
}