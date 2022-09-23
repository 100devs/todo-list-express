const express = require('express') //assigns the imported `express` module to the constant var `express`
const app = express() //assigns the express application to the constant var `app`
const MongoClient = require('mongodb').MongoClient //assigns the MongoClient class that's attached to the `connect` method exported by the `mongodb` module to the constant variable `MongoClient`
const PORT = 2121 //assigns the default port number `2121` to the constant variable `PORT`
require('dotenv').config() //calls the `config` method on the imported `dotenv` module, loading the environment variables from the `.env` file into `process.env`


//declares three vars: `db` to store the Db class instance, `connectionString` to store the connection string read from the `DB_STRING` environment variable, and `dbName` to store the name of the database we want to use
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//calls the static `connect` method on the `MongoClient` class, passing the `dbConnectionStr` and an options object with the `useUnifiedTopology` property set to `true` to use the new Server Discover and Monitoring engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //as no callback is provided, the `connect` method returns a Promise that will resolve to a `MongoClient` instance, so use the .then method to execute our callback with the said `MongoClient`
    .then(client => {
        //console logs the connection string, notifying the user that we are connected to the database
        console.log(`Connected to ${dbName} Database`)
        //assigns the desired `Db` instance - returned by the `db` method on the `MongoClient` instance - to the `db` variable
        db = client.db(dbName)
    })
    //missing .catch(err) block

//middleware below
app.set('view engine', 'ejs') //calls the `set` method of our express application, settings the default engine extension, allowing us to omit said extension when specifying view names
app.use(express.static('public')) //adds the `serve-static` middleware to our express application, serving any files requested from the root found in the `public` directory
app.use(express.urlencoded({ extended: true })) //adds the `body-parser` `urlencoded` middleware to our express application, parsing the content of any requests with a `Content-Type` of `application/x-www-form-urlencoded` to a JavaScript object assigned to the request `body` property - additionally setting the `extended` property to `true` within the options object to allow for nested objects via the `qs` module
app.use(express.json()) //adds the `body-parser` `json` middleware to our express application, parsing the content of any requests with a `Content-Type` of `application/json` to a JavaScript object assigned to the request `body` property



app.get('/',async (request, response)=>{ //adds a custom request handler to the `GET` method of the `/` path
    const todoItems = await db.collection('todos').find().toArray() //accesses the `todos` collection from the connected database, calling `find` with no filter object to retrieve all the documents, and finally call `toArray` to turn this query into a Promise that will resolve with an array of document objects
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //accesses the `todos` collection from the connected database, calling `countDocuments` with a filter to only include documents that have a `completed` property set to `false`
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells express to render the `index.ejs` view with the options of the `todoItems` and `itemsLeft` variables, which EJS will use as variables in the view

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //adds a custom request handler to the `POST` method of the `/addTodo` path
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //accesses the `todos` collection from the connected database, calling `insertOne` with an object containing the properties `thing` and `completed` set to the values of the `request.body.todoItem` - parsed by the `urlencoded` middleware - and `false` respectively
    .then(result => { //after the insertion is successful, redirect the user to the `/` path
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //if the insertion fails, log the error to the console
})


app.put('/markComplete', (request, response) => { //adds a custom request handler to the `POST` method of the `/markComplete` path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //accesses the `todos` collection from the connected database, calling `updateOne` with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property - parsed by the `json` middleware
        $set: { //updateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `true`
            completed: true
          }
    },{ //TLDR The `sort` option used in the options object of `updateOne` only works when used in a `fineOneAndXYZ` method, as in `findOneAndUpdate`/`findOneAndModify`/`fineOneAndUpdate` - so just changing the method makes the sorting work, - most obvious when there are three items and you attempt to mark/unmark the center one, sort one way the top element changes, sort other and the bottom element changes
        sort: {_id: -1}, //attempts to sort the document _id's descending to get the latest document first - this works because the `_id` is a `ObjectId` and these contain the second they were created encoded within them
        upsert: false //disables the upsert - if the document does not exist, do not create it
    })
    .then(result => { //after the update is successful, redirect the user to the `/` path
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //if the update fails, log the error to the console
})

app.put('/markUnComplete', (request, response) => { //adds a custom request handler to the `PUT` method of the `/markUnComplete` path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //updateFilter containing the `$set` Update Operator, telling MongoDB to setting the `completed` property to `false`
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


app.delete('/deleteItem', (request, response) => { //adds a custom request handler to the `DELETE` method of the `/deleteTodo` path
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //accesses the `todos` collection from the connected database, calling `deleteOne` with a filter object containing the property `thing` set to the value of the `request.body.itemFromJS` property - parsed by the `json` middleware - to delete the first document that matches the filter
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{ //starts the server listening on either the PORT provided via environment variable or the default port stored in the PORT variable
    console.log(`Server running on port ${PORT}`)
})