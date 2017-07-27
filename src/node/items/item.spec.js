import db from '../db'
import Item from './Item'

import Product from '../products/Product'
import Space from '../spaces/Space'
import Venue from '../venues/Venue'

const createItem = async ({name, venue_name = 'venue_name'}) => {
  let item = await db.transaction(async transacting => {
    let venue = await new Venue({name: venue_name}).save(null, {transacting})
    return await new Item({name})
      .save({'venue_id': venue.id,}, {transacting})
  })

  return item
}

test('Can save new Item', async () => {
  let item = await createItem({name: 'new item'})
  expect(item.id).toBeGreaterThan(0)
})

test('Cannot save new Item without name', () => {
  let item = new Item({nameS: 'new item'})
  expect(item.save()).rejects.toBeTruthy()
})

test('Cannot save new Item without venue_id', () => {
  let item = new Item({name: 'new item'})
  expect(item.save()).rejects.toBeTruthy()
})

test('Can query Items', async () => {
  let item = await createItem({name: 'new item'})
  let items = await Item.fetchAll()

  expect(items.models.map(x => x.toJSON().id))
    .toContain(item.id)
})

test('Can query items with related Product', async () => {
  const productPrice = 87.65

  let product = await db.transaction(async transacting => {
    let venue = await new Venue({name: 'venue'}).save(null, {transacting})
    let item = await new Item({name: 'item name', venue_id: venue.id}).save(null, {transacting})
    return await new Product({price: productPrice})
      .save({'item_id': item.id}, {transacting})
  })
  
  const id = product.toJSON().item_id
  let item = await Item.where({id}).fetch({withRelated: ['product']})

  expect(item.related('product').toJSON())
    .toHaveProperty('price', productPrice)
})

test('Can query items with related Space', async () => {
  const product_price_hour = 99.42

  let space = await db.transaction(async transacting => {
    let venue = await new Venue({name: 'venue'}).save(null, {transacting})
    let item = await new Item({name: 'item name', venue_id: venue.id})
      .save(null, {transacting})
    return await new Space({hour_price: product_price_hour})
      .save({'item_id': item.id}, {transacting})
  })

  let id = space.toJSON().item_id
  let item = await Item.where({id}).fetch({withRelated: ['space']})

  expect(item.related('space').toJSON())
    .toHaveProperty('hour_price', product_price_hour)
})

test('Can query items with related Venue', async () => {
  const venueName = 'z - venue name'

  let item = await db.transaction(async transacting => {
    let venue = await new Venue({name: venueName}).save(null, {transacting})
    return await new Item({name: 'item name'})
      .save({'venue_id': venue.id,}, {transacting})
  })

  let id = item.toJSON().id
  let itemVenue = await Item.where({id}).fetch({withRelated: ['venue']})

  expect(itemVenue.related('venue').toJSON())
    .toHaveProperty('name', venueName)
})