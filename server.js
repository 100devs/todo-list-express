const express = require('express') // includes express module, requires the module and puts it in a constant called express
const app = express() // saves express call as a constant called app
const MongoClient = require('mongodb').MongoClient // sets the constant MongoClient with the module mongodb. Makes it possiblte to use methods associated with MongoClient  
const PORT = 2121 // sets up a constant PORT to 2121. The PORT is a location where the server will be listening
require('dotenv').config() // requires the dotenv module. Allows us to access environmental variables, the variables inside the .env file


let db, // declares a variable db
    dbConnectionStr = process.env.DB_STRING, // declares dbConnectionStr variable and assigns it the value of the variable stored in the .env file, the connection string from mongo
    dbName = 'todo' // declares a variable dbName and assigns to it the string 'todo', the name of the databse that we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creates a connection to mongodb passing in the connection string (dbConnectionStr). We also pass in the property useUnifiedTopology with the value of true. We attempt the connection.
    .then(client => { // if the promise is fulfilled - the connection is successful -  we continue with this then method, we pass in all the client information. The information that we get from the connection will be called client.
        console.log(`Connected to ${dbName} Database`) // logs to the console a template literal to show that we are connected to the database
        db = client.db(dbName) // assigns a value to the db variable. The value is the databse inside the client that we just connected to. It contains a db client factory method.
    }) // end of the then block
    
// middlewares
app.set('view engine', 'ejs') // sets the view engine to be ejs
app.use(express.static('public')) // makes expresss look for files inside the public folder. Inside the public folder there are static assets.
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content, the extended part set to true makes it so it supports arrays and objects
app.use(express.json()) // parses json from the requests


app.get('/',async (request, response)=>{ // starts a GET request (read request) for the root route and an async function with request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // declares a constant variable todoItems that awaits all the info inside the 'todos' collection. The info is turned into an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // the variable itemsLeft is declared and assigned a value. This variable waits for the documents inside the 'todos' collection to be counted. The documents counted are only those that have the key 'completed' set to false.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // as a response the ejs file is rendered and we pass an object with the variables todoItems thet will be the value of items, and itemsLeft that will be the value of left. So in ejs, when we refer to items we are using the todoItems array, that's why we can loop through it. And when we refer to 'left' we are actually using the value of the itemsLeft variable.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // end of the app.get function

app.post('/addTodo', (request, response) => { // starts POST method (create) when the addTodo route is passed, when we submit the form that has the action addTodo 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insets 1 new item into the collection 'todos'. The item (thing) inserted is the todoItem inside the request.body, this item comes from the form (the input has the name set to be todoItem). And by default we add the key completed set to false.
    .then(result => { // after that promise is fulfilled we continue with this then method
        console.log('Todo Added') // logs into the console 'Todo Added' to signal the success of the process, logs the action 
        response.redirect('/') // the response is to redirect to the root route to see the changes, get the page updated. Gets rid of the addTodo route and redirects to hompage
    }) // close of the then 
    .catch(error => console.error(error)) // if the promise is rejected the catch executes and shows the error message in the console 
}) // end of app.post function

app.put('/markComplete', (request, response) => { // starts a PUT method (update) when the markComplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go to the collection 'todos' and select the element itemFromJS that comes from the request.body object. You look for the 'thing' that has the same value as itemFromJS to update it. 
        $set: { // open of the set operator to replace a value
            completed: true // the update is that you set completed to true
          } // close of the set operator
    },{ 
        sort: {_id: -1}, // sorts the documents in descending order
        upsert: false // you don't add a duplicate, you avoid adding an item 
    }) // end of updateOne
    .then(result => { // when the update promise is resolved you continue to a then method
        console.log('Marked Complete') // logs to the console
        response.json('Marked Complete') // sends a response back to the sender of the request
    }) // end of then 
    .catch(error => console.error(error)) // if the promise is rejected the catch executes and shows the error message in the console 

})

app.put('/markUnComplete', (request, response) => { // starts a PUT method (update) when the markUnComplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // search for the itemFromJS inside the collection
        $set: { // open of the set operator to replace a value
            completed: false // the update is that you set completed to false
          } // close of the set operator
    },{
        sort: {_id: -1}, // sorts the documents in descending order
        upsert: false // you don't add a duplicate, you avoid adding an item 
    }) // end of updateOne
    .then(result => { // once/if the promise is fulfilled you continue to then
        console.log('Marked Complete') // logs to the console
        response.json('Marked Complete') // sends response back, should it say mark uncomplete?
    }) // end of the then method
    .catch(error => console.error(error)) // if the promise is rejected the catch executes and shows the error message in the console 

}) // end of PUT method

app.delete('/deleteItem', (request, response) => { // DELETE method when the deleteItem route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the collection 'todos' for the item that matches the thing with itemFomJS
    .then(result => { // if the delete was successful this is executed
        console.log('Todo Deleted') // logs to the console
        response.json('Todo Deleted') // sends response back
    }) // close of then
    .catch(error => console.error(error)) // if the promise is rejected the catch executes and shows the error message in the console 

}) // end of DELETE method

app.listen(process.env.PORT || PORT, ()=>{ // sets the port where we will be listening on
    console.log(`Server running on port ${PORT}`) // logs to the console that the server is running and the port where it can be found
}) // close of the app.listen function