import db from '../db'
import Joi from 'joi'

import Item from '../items/Item'

const price = Joi.number().required()
const item_id = Joi.number().greater(0)

const schema = Joi.object().keys({price})

const Product = db.Model.extend({
  tableName: 'products',
  item: function() {
    return this.belongsTo(Item)
  },
  schema: {
    create: schema.keys({item_id: item_id.required()}),
    update: schema.keys({item_id})
  }
})

export default Product