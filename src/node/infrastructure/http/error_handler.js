import log from '../log'

const env = process.env.NODE_ENV || 'development'

export default async function(ctx, next) {
  try {
    await next()
  } catch (err) {
    log.error(err)
    
    ctx.status = 500
    ctx.body = (env === 'production') 
      ? 'An internal server error occurred'
      : err
  }
}