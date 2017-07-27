import bunyan from 'bunyan'
import log from './log'

describe('Log infra', () => {

  it('can log to ring buffer', () => {
    
    const ringbuffer = new bunyan.RingBuffer({ limit: 10 })
    log.addStream({
      level: 'trace',
      type: 'raw',
      stream: ringbuffer
    })

    let someEvent = 'value of event'
    log.trace({someEvent})

    expect(ringbuffer.records).toHaveLength(1)
    expect(ringbuffer.records[0].someEvent).toBe(someEvent)
  })

})