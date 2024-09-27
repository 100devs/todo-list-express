const express = require('express')
const app = express()
// tells the server to use express syntax which allows easier building and fun middleware
const MongoClient = require('mongodb').MongoClient
// establishes MongoClient using mongo database for connection to our database later
const PORT = 2121
// tells local host where to listen
require('dotenv').config()
// sets up the place to keep secrets


let db,
    dbConnectionStr = process.env.DB_STRING, // tells us that the connection string is stored in the place of secrets
    dbName = 'todo' // the name of our data base collection

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //promise syntax asking to connect using mongo client (line 4) using the connection string (line 13), using unified tolology design as node driver has seven toplogy classes 
    .then(client => { //what to do once promise is fulfilled
        console.log(`Connected to ${dbName} Database`) // let us know in console that we are connected to the database
        db = client.db(dbName) // reassign db variable 
    })
//the following things are middleware!
app.set('view engine', 'ejs') // middleware allowing use of ejs
app.use(express.static('public')) //telling app/express to use public folder to serve any static files
app.use(express.urlencoded({ extended: true })) // telling app/express how to understand incoming queries that are formatted as URL
app.use(express.json()) // telling app/express to format objects as JSON


app.get('/', async (request, response) => {  //promise syntax for a request from the root route
    const todoItems = await db.collection('todos').find().toArray() // a variable awating items in the database collection and creating an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // a varraible taking I assume counting the items in the database collection with completed of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //once promise is fulfilled use ejs to render a page using the previous two varriables. I believe this line is replacing what follows
    // db.collection('todos').find().toArray()
    // .then(data => {  data indicates the array that was made
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //pass objects and array holding object into the ejs template to be rendered we are now naming that array "items"
    //     })
    // })
    // .catch(error => console.error(error))
//the .catch is currently not functioning, so this may just time out if things don't go as expected
})

app.post('/addTodo', (request, response) => { // a promise syntax for creating new todos
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // within db as defined line 19, within collection todos insert (create) a document with thing from ejs with id of todoItem and with completion status of false
        .then(result => { //once promise is fulfilled
            console.log('Todo Added') // let us know it is added to the database
            response.redirect('/') // respond by refreshing the page to the root route
        })
        .catch(error => console.error(error)) // if the promise fails, let us know the error by consoling it
})

app.put('/markComplete', (request, response) => { // a promise syntax for updating todos
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // // within db as defined line 19, within collection todos update what follows
        $set: { // $set operator allows updating of spcific fields
            completed: true // updating specific field of completed to true
        }
    }, {
        sort: { _id: -1 }, // not quite sure what this is about, but it looks like this allow us to sort in a way that is m ore consistent than MongoDB's default sorting
        upsert: false // does not allow creating/adding new documents if queried document is not found
    })
        .then(result => {//once promise is fulfilled
            console.log('Marked Complete') // tell us in the console it is marked complete
            response.json('Marked Complete') // provide us a JSON object telling us marked complete and send it back to clint JS as part of fetch
        })
        .catch(error => console.error(error))// if the promise fails, let us know and why

})

app.put('/markUnComplete', (request, response) => {// a promise syntax for updating todos
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: { // $set operator allows updating of spcific fields
            completed: false // updating specific field of completed to false
        }
    }, {
        sort: { _id: -1 },
        upsert: false  //prevents creating/adding new documents if queried document is not found
    })
        .then(result => { //once promise is fulfilled
            console.log('Marked Complete') // tell us in the console it is marked complete
            response.json('Marked Complete')// provide us a JSON object telling us marked complete send it back to clint JS as part of fetch
        })
        .catch(error => console.error(error))// if the promise fails, let us know and why

})

app.delete('/deleteItem', (request, response) => { // a promise syntax for deleting an item
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // withthin db as defined line 19, within collection todos delete the item that matches field thing identified as itemFromJS
        .then(result => { //once promise is fulfilled
            console.log('Todo Deleted') // tell us in the console it is deleted
            response.json('Todo Deleted')// Provide a JSON object telling us it is deleted send it back to clint JS as part of fetch
        })
        .catch(error => console.error(error)) // if the promise fails, let us know and why

})

app.listen(process.env.PORT || PORT, () => { //to run the server use the port defined by PORT variable listed in the place of secrets (env) or PORT method provided by a hosting service like heroku
    console.log(`Server running on port ${PORT}`) // tell us in the console that it is running and define which port. Is this bad practice to say if we want to obscure the port in .env?
})