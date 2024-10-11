const { initDatabase } = require("../controllers/dbController.js")

initDatabase()
.then(db => {
    db.close((err) => {
        if (err) {
            console.error(`Error closing the database connection: ${err.message}`)
        }
        console.log('Closed the database connection.')
    })
})
.catch(err => {
    console.error(`Database initialization failed: ${err.message}`)
})