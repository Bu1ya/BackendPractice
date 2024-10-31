const { Pool } = require('pg')

const pool = new Pool({
    user: 'bu1yan',
    password: 'admin',
    host: 'localhost',
    database: 'app',
    port: 5432
})

module.exports = pool