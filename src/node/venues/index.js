import Router from 'koa-router'

import {Ok, NotFound} from '../infrastructure/http/response'
import validate from '../infrastructure/http/validate'

import Venue, {schema} from './Venue'

export async function getVenue(ctx, next) {
  const {id} = ctx.params
  const withRelated = ['items', 'items.space', 'items.product']
  const venue = await Venue.where({id}).fetch({withRelated})
  
  return (venue == null) 
    ? NotFound(ctx)
    : Ok(venue, ctx, next)
}

export async function getVenues(ctx) {
  let venues = await Venue.fetchAll({withRelated: ['items']})
  let res = venues.toJSON().map(venue => {
    venue.items = venue.items.map(i => i.name)
    return venue
  })

  Ok(res, ctx)
}

export async function updateVenue(ctx) {
  let venue = ctx.body
  const {name} = ctx.request.body
  return Ok(await venue.save({name}), ctx)
}

export async function createVenue(ctx) {
  let venue = new Venue(ctx.request.body)
  venue = await venue.save()
  return Ok(venue, ctx)
}

export async function removeVenue(ctx) {
  let venue = ctx.body
  await venue.destroy()
  return Ok({info: 'success'}, ctx)
}
 
export default new Router({ prefix: '/venue:s?' })
  .get('/', getVenues)
  .get('/:id', getVenue)
  .post('/', validate(schema), createVenue)
  .patch('/:id', validate(schema), getVenue, updateVenue)
  .delete('/:id', getVenue, removeVenue)