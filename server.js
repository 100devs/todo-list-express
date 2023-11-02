// import `express` module and assign it to the constant variable `express`
const express = require('express')
// assign the above `express` application to the constant variable `express`
const app = express()
// assign the MongoClient class that's attached to the `connect` method exported by the `mongodb` module to the constant variable `MongoClient`
const MongoClient = require('mongodb').MongoClient
//set the port
const PORT = 2121
// call the `config` method on the imported `dotenv` module, loading the environment variables from the `.env` file into `process.env`
require('dotenv').config()

// declare 3 mutable variables: 
// `db` to store the Db class instance; 
// `dbConnectionStr` to store the connection string read from the `DB_STRING` environment variable, 
//  `dbName` to store the name of the database we want to use.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// call the static `connect` method on the `MongoClient` class, passing the `dbConnectionStr` and an options object with the `useUnifiedTopology` property set to `true` to use the new Server Discover and Monitoring engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // since no callback is provided, the `connect` method returns a Promise that will resolve to a `MongoClient` instance, so use the .then method to execute our callback with the said `MongoClient`.
    .then(client => {
        // log the according dbName from the above to console
        console.log(`Connected to ${dbName} Database`)
        // assign the desired `Db` instance - returned by the `db` method on the `MongoClient` instance - to the `db` variable.
        db = client.db(dbName)
    })

// call the `set` method of our express application, settings the default engine extension
app.set('view engine', 'ejs')
// ser the `serve-static` middleware to our express application
app.use(express.static('public'))
// add the `urlencoded` middleware to our express application,set the `extended` property to `true` within the options object to allow for nested objects via the `qs` module.
app.use(express.urlencoded({ extended: true }))
//  ddd the `body-parser` `json` middleware to our express application
app.use(express.json())


// add a custom request handler to the `GET` method of the `/` path
app.get('/', async (request, response) => {
    // call `find`method with no filter object on database "todos" to retrieve all the documents,then call `toArray` to turn this query into a Promise that will resolve with an array of document objects.
    const todoItems = await db.collection('todos').find().toArray()

    // call `countDocuments` with a filter on database "todos" to only include documents that have a `completed` property set to `false`
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    // tell the express application to render the `index.ejs` view with the options of the `todoItems` and `itemsLeft` variables
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

// add a custom request handler to the `POST` method of the `/addTodo` path
app.post('/addTodo', (request, response) => {
    // access the `todos` collection from the connected database, calling `insertOne` with an object containing the properties `thing` and `completed` set to the values of the `request.body.todoItem` - parsed by the `urlencoded` middleware - and `false` respectively.
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        // when the insertion is successful, use a promise to redirect the user to the `/` path.
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        // if the insertion fails, log the error to the console
        .catch(error => console.error(error))
})

// add a custom request handler to the `POST` method of the `/markComplete` path
app.put('/markComplete', (request, response) => {

    // call `updateOne` on database "todos" with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property - parsed by the `json` middleware
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        // updateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `true`.

        $set: {
            completed: true
        }
    }, {
        // sort the document _id's descending to get the latest document first because the `_id` is a `ObjectId` and these contain the second they were created encoded within them.
        sort: { _id: -1 },
        // disable the upsert, if the document does not exist, do not create it
        upsert: false
    })
        // when the update is successful, redirect the user to the `/` path.
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        // if the above fails, log the error to the console.
        .catch(error => console.error(error))

})

// add a custom request handler to the `PUT` method of the `/markUnComplete` path
app.put('/markUnComplete', (request, response) => {
    // update database
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        // updateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `false`
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        // handle error
        .catch(error => console.error(error))

})

// add a custom request handler to the `DELETE` method of the `/deleteTodo` path
app.delete('/deleteItem', (request, response) => {
    // call `deleteOne` on db "todos" with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property which parsed by the `json` middleware to delete the first document that matches the filter
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        // handle errors
        .catch(error => console.error(error))

})

// start the server on either port provided in env variable or default port according to PORT variable
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})