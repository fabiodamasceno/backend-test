import db from '../db'

import Product from './Product'
import Item from '../items/Item'
import Venue from '../venues/Venue'

const createProduct = async ({price, item_name = 'item_name'}) => {
  const ref_item = await db.transaction(async transacting => {
    let venue = await new Venue({name: 'venue'}).save(null, {transacting})
    return await new Item({name: item_name})
      .save({'venue_id': venue.id}, {transacting})
  })

  return await new Product({price, item_id: ref_item.id}).save()
}

test('Can save new Product', async () => {
  let product =  await createProduct({price: 47.89})
  expect(product.id).toBeGreaterThan(0)
})

test('Cannot save new Product without correct price', () => {
  let product = new Product({price: 'abcdef'})
  expect(product.save()).rejects.toBeTruthy()
})

test('Cannot save new Product without item_id', () => {
  let product = new Product({price: 84.64})
  expect(product.save()).rejects.toBeTruthy()
})

test('Can query Products', async () => {
  let product = await createProduct({price: 20.37})

  let products = await Product.fetchAll()

  expect(products.models.map(x => x.toJSON().id))
    .toContain(product.id)
})

test('Can query products with related Item', async () => {
  const item_name = 'name set - abc'
  let product = await createProduct({price: 20.37, item_name})
  
  let itemProduct = await Product.where({id: product.id})
    .fetch({withRelated: ['item']})
  
  expect(itemProduct.related('item').toJSON().name).toBe(item_name)
})