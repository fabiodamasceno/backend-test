exports.up = (knex, Promise) => {

  let venueTable = knex.schema.createTable('venues', table => {
    table.increments('id')
    table.string('name').notNullable()
  })

  let itemsTable = knex.schema.createTable('items', table => {
    table.increments('id')
    table.integer('venue_id').unsigned().notNullable()
      .index().references('id').inTable('venues')
    table.string('name').notNullable()
  })

  let spacesTable = knex.schema.createTable('spaces', table => {
    table.increments('id')
    table.integer('item_id').unsigned().notNullable()
      .index().references('id').inTable('items')
    table.decimal('hour_price').notNullable()
  })

  let productsTable = knex.schema.createTable('products', table => {
    table.increments('id')
    table.integer('item_id').unsigned().notNullable()
      .index().references('id').inTable('items')
    table.decimal('price').notNullable()
  })    
  
  return Promise.all([venueTable, itemsTable, spacesTable, productsTable])
}



exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('spaces'),
    knex.schema.dropTable('products'),
    knex.schema.dropTable('items'),
    knex.schema.dropTable('venues'),
  ])
}
