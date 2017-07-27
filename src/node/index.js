import app from './app'
import log from './infrastructure/log'

let port = process.env.PORT || 3001
app.listen(port, () => {
  log.info(`Running application on port ${port}`)
})
