//requires express to be used
const express = require('express')

//add constant "app" to replace the use of express
const app = express()

//requires MongoDB
const MongoClient = require('mongodb').MongoClient

//port used on localhost
const PORT = 2121

//requires dotenv
require('dotenv').config()


// SETTING GLOBAL VARIABLES
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// CONNECTING TO MONGODB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

    // CONFIRMS THROUGH THE CONSOLE THAT WE ARE CONNECTED
    .then(client => {
        console.log(`Connected to ${dbName} Database`)

        // ASSIGNING THE DB NAME TO THE VARIABLE "DB"
        db = client.db(dbName)
    })

// SETTING UP MIDDLEWARES

//ESTABLISHING WHICH VIEW ENGINE WILL BE USED FOR THE RENDERED CONTENT
app.set('view engine', 'ejs')

// PUBLIC FOLDER IS SET TO BE USED FOR STATIC FILES
app.use(express.static('public'))

// MIDDLEWARE USED TO RECOGNIZE INCOMING REQUEST OBJECT AS STRINGS OR ARRAYS
app.use(express.urlencoded({ extended: true }))

// MIDDLEWARE USED TO RECOGNIZE INCOMING REQUEST OBJECT AS JSON OBJECT
app.use(express.json())

// DISPLAY MAIN PAGE
app.get('/', async (request, response) => {

    // CREATE AN ARRAY OF THE TODO ITEMS
    const todoItems = await db.collection('todos').find().toArray()

    // COUNTING/TRACKING THE ITEMS THAT HAVE NOT BEEN COMPLETED 
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })

    // RENDER THE RESPONSE THROUGH INDEX.EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// ADD NEW TODO ITEM TO THE LIST

app.post('/addTodo', (request, response) => {

    //INSERT A NEW DOCUMENT IN THE DATABASE COLLECTION WITH THE RELEVANT PROPERTIES

    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {

            // LOG RESPONSE
            console.log('Todo Added')

            // REFRESH
            response.redirect('/')
        })

        // CATCH ANY POTENTIAL ERRORS
        .catch(error => console.error(error))
})

// UPDATE ITEMS FROM THE LIST

app.put('/markComplete', (request, response) => {

    // UPDATE ONE ITEM'S PORPERTY {thing: request.body.itemFromJS}
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {

            // CHANGE THE ITEM TO COMPLETED
            completed: true
        }
    }, {

        //SORT DESCENDING BY ID
        sort: { _id: -1 },

        //IF THE ITEM DOESN'T EXIST, DON'T CREATE A NEW ENTRY
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')

            //RESULT SENT TO THE PAGE
            response.json('Marked Complete')
        })

        // CATCH ANY POTENTIAL ERRORS
        .catch(error => console.error(error))

})


//UPDATE ITEMS FROM THE LIST
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {

            // CHANGE THE ITEM TO UNCOMPLETED
            completed: false
        }
    }, {

        //SORT DESCENDING BY ID
        sort: { _id: -1 },

        //IF THE ITEM DOESN'T EXIST, DON'T CREATE A NEW ENTRY
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')

            //RESULT SENT TO THE PAGE
            response.json('Marked Complete')
        })

        // CATCH ANY POTENTIAL ERRORS
        .catch(error => console.error(error))

})


//DELETE AN ITEM
app.delete('/deleteItem', (request, response) => {

    // DELETE ONE ITEM FROM THE LIST THAT HAS THE FOLLOWING thing: request.body.itemFromJS
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')

            //RESULT SENT TO THE PAGE
            response.json('Todo Deleted')
        })

        // CATCH ANY POTENTIAL ERRORS
        .catch(error => console.error(error))

})

// USE THE CONSTANT PORT WE CREATED OR A THIRD PARTY CREATED PORT IF WE ARE USING A PLATFORM THAT WILL CHANGE IT
app.listen(process.env.PORT || PORT, () => {

    //SHOW THAT WE ARE CONNECTED AND TO WHICH PORT
    console.log(`Server running on port ${PORT}`)
})