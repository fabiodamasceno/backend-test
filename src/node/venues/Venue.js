import db from '../db'
import Joi from 'joi'

import Item from '../items/Item'

const name = Joi.string().required()
export const schema = Joi.object().keys({ name })

const Venue = db.Model.extend({
  tableName: 'venues',
  items: function() {
    return this.hasMany(Item)
  },
  schema: {
    create: schema,
    update: schema
  }
}, {dependents: ['items']})

export default Venue