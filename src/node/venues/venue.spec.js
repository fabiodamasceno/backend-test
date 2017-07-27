import * as route from './index'
import Venue from './Venue'

let createVenue = async () => {
  let attrs = {name: `venue ${new Date()}`}
  return await new Venue(attrs).save()
}

test('getVenues should contain new venue', async () => {
  let venue = await createVenue()
  let ctx = {}
  await route.getVenues(ctx)

  expect(ctx.body.filter(x => x.id === venue.id))
    .not.toBeNull()
})

test('getVenue should return venue if exists', async () => {
  let venue = await createVenue()
  let ctx = {params: {id: venue.id}}
  let next = jest.fn()

  await route.getVenue(ctx, next)

  expect(ctx).toHaveProperty('body.id', venue.id)
  expect(ctx).toHaveProperty('status', 200)
  expect(next).toHaveBeenCalled()
})

test('getVenue should return null if not exists', async () => {
  let ctx = {params: {id: -1}}
  let next = jest.fn()

  await route.getVenue(ctx, next)

  expect(ctx).toHaveProperty('body', {info: 'NotFound'})
  expect(ctx).toHaveProperty('status', 204)
  expect(next).not.toHaveBeenCalled()
})

test('updateVenue should update venue name', async () => {
  const venue = await createVenue()
  const another_name = 'another_name'
  let ctx = {
    request: {body: {name: another_name}},
    body: venue
  }

  await route.updateVenue(ctx)

  const {attributes:{name}} = await Venue.where({id:venue.toJSON().id}).fetch()
  expect(name).toBe(another_name)
})

test('removeVenue should remove venue', async () => {
  const venue = await createVenue()
  const id = venue.toJSON().id

  let ctx = { body: venue }
  await route.removeVenue(ctx)

  const result = await Venue.where({id}).fetch()
  expect(result).toBeNull()
})


test('createVenue should create venue', async () => {
  const body = { name: 'new_venue' }
  let ctx = { request: {body} }

  await route.createVenue(ctx)

  const createdVenue = await Venue.where({id: ctx.body.id}).fetch()
  expect(createdVenue).not.toBeNull()
  expect(createdVenue.created_at).not.toBeNull()
})

