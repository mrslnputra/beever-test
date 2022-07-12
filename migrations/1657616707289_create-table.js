/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('Quotes', {
    id: 'id',
    quote: { type: 'text', notNull: true },
    favorites: { type: 'boolean', notNull: true },
  })
};

exports.down = pgm => {};
