import db from '../db'
import Joi from 'joi'

import Venue from '../venues/Venue'
import Space from '../spaces/Space'
import Product from '../products/Product'

const name = Joi.string().required()
const venue_id = Joi.number().greater(0)

const schema = Joi.object().keys({ name })

const Item = db.Model.extend({
  tableName: 'items',
  venue: function() {
    return this.belongsTo(Venue)
  },
  space: function() {
    return this.hasOne(Space)
  },
  product: function() {
    return this.hasOne(Product)
  },
  schema: {
    create: schema.keys({venue_id: venue_id.required()}),
    update: schema.keys({venue_id})
  }
}, {dependents: ['space', 'product']})

export default Item