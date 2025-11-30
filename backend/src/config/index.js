const pool = require('./database');
const { createTables, dropTables, resetTables } = require('./init-db');

module.exports = {
  pool,
  createTables,
  dropTables,
  resetTables
};