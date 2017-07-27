import db, {knex} from '../db'
import Venue from '../venues/Venue'
import Item from '../items/Item'
import Product from '../products/Product'
import Space from '../spaces/Space'

import supertest from 'supertest'

import app from '../app'

async function createVenue() {
  let venue = await db.transaction(async transacting => {
    let v = await new Venue({name: 'venue'}).save(null, {transacting})

    let product_item = await new Item({name: 'product item'})
      .save({venue_id: v.id}, {transacting})

    let space_item = await new Item({name: 'space item'})
      .save({venue_id: v.id}, {transacting})

    await new Space({hour_price: 25.98})
      .save({'item_id': space_item.id}, {transacting})

    await new Product({price: 75.12})
      .save({'item_id': product_item.id}, {transacting})

    return v
  })
  return venue.toJSON()
}

describe('venues api',() => {

  const request = supertest.agent(app.listen())

  beforeEach(() => {
    return Promise.all([
      knex.raw('delete from `spaces`'),
      knex.raw('delete from `products`'),
      knex.raw('delete from `items`'),
      knex.raw('delete from `venues`')
    ])
  })

  it('GET /not_found', async () => {
    let res = await request.get('/not_found')
    expect(res.status).toBe(404)
    expect(res.body).toMatchSnapshot()
  })

  it('GET /venues', async () => {
    await createVenue()
    let res = await request.get('/venues')
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('GET /venues/:id', async () => {
    let venue = await createVenue()
    let res = await request.get(`/venues/${venue.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('POST /venues', async () => {
    let res = await request.post('/venues').send({name: 'venue name'})
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('PATCH /venues/:id', async () => {
    let venue = await createVenue()
    let name = `${venue.name}_updated`
    let res = await request.patch(`/venues/${venue.id}`).send({name})
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('DELETE /venues/:id', async () => {
    let venue = await createVenue()
    let res = await request.delete(`/venues/${venue.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

})