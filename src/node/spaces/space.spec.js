import db from '../db'

import Space from './Space'
import Item from '../items/Item'
import Venue from '../venues/Venue'

const createSpace = async ({hour_price, item_name = 'item_name'}) => {
  const ref_item = await db.transaction(async transacting => {
    let venue = await new Venue({name: 'venue'}).save(null, {transacting})
    return await new Item({name: item_name})
      .save({'venue_id': venue.id}, {transacting})
  })

  return await new Space({hour_price, item_id: ref_item.id}).save()
}

test('Can save new space', async () => {
  let space = await createSpace({hour_price: 49.37})
  expect(space.id).toBeGreaterThan(0)
})

test('Cannot save new Space without correct hour_price', () => {
  let space = new Space({hour_price: 'abcdef'})
  expect(space.save()).rejects.toBeTruthy()
})

test('Cannot save new Space without item_id', () => {
  let space = new Space({hour_price: 80.45})
  expect(space.save()).rejects.toBeTruthy()
})

test('Can query spaces', async () => {
  let space = await createSpace({hour_price: 49.37})

  let spaces = await Space.fetchAll()
  expect(spaces.models.map(x => x.toJSON().id))
    .toContain(space.id)
})

test('Can query spaces with related Item', async () => {
  const item_name = 'name set - abc'
  let space = await createSpace({hour_price: 49.37, item_name})
  
  let spaceItem = await Space.where({id: space.id})
    .fetch({withRelated: ['item']})
  
  expect(spaceItem.related('item').toJSON().name).toBe(item_name)
})