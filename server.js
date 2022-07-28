const express = require('express') // intialize constant express by importing it from the node package express
const app = express() // create a constant app that's an instance of express
const MongoClient = require('mongodb').MongoClient // initialize and import a MongoDB client from node package mongodb
const PORT = 2121 // Define a port for the server to listen on when used with app.listen on line 91
require('dotenv').config() // require the dotenv for the .env can be used to store the URI for mongo


let db, // declare db
    dbConnectionStr = process.env.DB_STRING, // and dbConnection string, initialized by dotenv package which reads the DB_STRING value in .env
    dbName = 'todo' // intialize the mongo database name, to todo and store it in dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to the database using the connection string and unified topology
    .then(client => { // once the connection is made our promise is fulfilled
        console.log(`Connected to ${dbName} Database`) // log that we're connected to the database
        db = client.db(dbName) // assign the todo database in the client to db
    })
    
app.set('view engine', 'ejs') // use ejs to generate the html/client stuff
app.use(express.static('public')) // use public folder to server static content
app.use(express.urlencoded({ extended: true })) // allows us to use url parameters 
app.use(express.json()) // use express.json() for our app.  These app.use lines are all middleware


app.get('/',async (request, response)=>{ // define a route for / to get a homepage using async anonymous callback function
    const todoItems = await db.collection('todos').find().toArray() // get the todo list items from the database and turn them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // get a count of undone items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the items and count to an ejs page
    // db.collection('todos').find().toArray() // this is all the same thing, but using .then instead of async/await
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //catch any errors
}) // end route

app.post('/addTodo', (request, response) => { // define POST endpoint /addTodo to add a new item to the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // add the new item to the collection, getting the value of thing  from the request body todoItem
    .then(result => { // when the promise is fulfilled
        console.log('Todo Added') // log that it's added
        response.redirect('/') // redirect to the home page, which will trigger a refresh and display the new item
    }) // end fulfilled block
    .catch(error => console.error(error)) // if something goes wrong, log the error
}) // end of post code

app.put('/markComplete', (request, response) => { // define /marComplete as a route to modify existing todo items
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the thing getting the item from the request body in the todos question
        $set: { // sets a value
            completed: true // the completed value to true instead of the defaul to false
          } // end of sset's value object
    },{ // start another option object
        sort: {_id: -1}, // sort in reverse order
        upsert: false //don't insert, just update
    }) // end of updateOne call
    .then(result => { // when the promise is fulfilled
        console.log('Marked Complete') // log to console that's completed
        response.json('Marked Complete') // Send json in the response that it's completed
    }) //end of promise fulfilled .then
    .catch(error => console.error(error)) // in the event of an error log it to the console error stream

}) // end of put route

app.put('/markUnComplete', (request, response) => { // define a route /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updateOne again using the value of put request body itemFromJS with the key thing
        $set: { // set a value
            completed: false // specifically, the completed property to false
          } // end set
    },{ // new option object
        sort: {_id: -1}, // reverse sort by id
        upsert: false // don't insert, just update
    }) // end of updateOne method
    .then(result => { // promise is fulfilled
        console.log('Marked Complete') // mark task complete in the console, probably should be marked uncomplete
        response.json('Marked Complete') //send marked complete in json using the response
    }) // 
    .catch(error => console.error(error)) // log the error to the error stream in the console

}) // end of the /markUnComplete route for put

app.delete('/deleteItem', (request, response) => { // define delete route to /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deleteOne from the db collection todos getting the thing from the request.body.itemFromJS
    .then(result => { // when the promise is fulfilled
        console.log('Todo Deleted') // log that's it's done
        response.json('Todo Deleted') // respond with json that it's done
    }) // end of promise fulfillment 
    .catch(error => console.error(error)) // in the event of an error, log it to the error stream of the console

}) // end of route

app.listen(process.env.PORT || PORT, ()=>{ // tell the server to listen on the PORT in .env or the PORT defined on line 4 if that isn't defined
    console.log(`Server running on port ${PORT}`) // console log that the server is running on the PORT, this will be incorrect on a server when the PORT in .env isn't the same as line 4
}) // end of app.listen call