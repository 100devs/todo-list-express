const express = require('express') // making it possible to use express 
const app = express() // setting a constant and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with mongoclient to talk to our db 
const PORT = 2121 // creating a constant and storing our port number/location where our server listens 
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, // storing our DB mongoDB connection string inside variable dbConnectionStr
    dbName = 'todo' // storing the database name that I want to access inside of variable dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongodv and passing in our connection string. Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, .then indicate this is a promise. We're passing in all the client info. 
        console.log(`Connected to ${dbName} Database`) // consolelog that we're connected to 'todo' database
        db = client.db(dbName) // passing in the db name from mongo db and assigning that to the db variable
    }) // closing our .then

// Middleware:   
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // says any of the static assets and files will be put in the public folder
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content, extended part supports arrays and objcts
app.use(express.json()) // parses json content


app.get('/',async (request, response)=>{ // read/GET method in CRUD, route is the homepage, start an async function with req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits the items in the todos collection, then we put them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits the COUNT of items in the todos collection with the property of completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the ejs file and passing through the db items and the count remaining inside of an object. 'items' and 'left' are how we reference these things in the EJS
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST/ create method when the /addTodo route is passed in as an action, request and response parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // go into the todos collection and insert a new item. In our DB, each object has 2 keys, thing and completed. request.body.toDoItem is us getting the toDoItem from the input in EJS in our form. The completed property is false because we havent done the task yet since it's a new task.
    .then(result => { // if insert is successful, do something 
        console.log('Todo Added') // console log that we added an item
        response.redirect('/') // reloading back to the homepage to GET the new data/results
    }) // closing the then 
    .catch(error => console.error(error)) // console log the error
}) // closing the post

app.put('/markComplete', (request, response) => { // starts a put method when /markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true // sets the completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist, if it were true then it would insert an item if it didn't already exist 
    }) // close the update one
    .then(result => { // if that is successful 
        console.log('Marked Complete') // console log 
        response.json('Marked Complete') // sending a response back to the sender
    }) //closing the then 
    .catch(error => console.error(error)) // console log the error

}) // close the update/put

app.put('/markUnComplete', (request, response) => { // starts a put method when /markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false // sets the completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list 
        upsert: false // prevents insertion if item does not already exist, if it were true then it would insert an item if it didn't already exist  
    })
    .then(result => { // if that is successful 
        console.log('Marked Complete') // console log the completion
        response.json('Marked Complete') // send response/ data back to sender
    }) //closing the then 
    .catch(error => console.error(error)) // console log the error

}) // close the update/put

app.delete('/deleteItem', (request, response) => { // starts a put method when /deleteItem route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { // if that delete is successful 
        console.log('Todo Deleted') //  console log the completion
        response.json('Todo Deleted') //send response/ data back to sender
    }) // close the delete one
    .catch(error => console.error(error)) // console log the error

}) // close the delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either gets the one from our env file if one exists or uses the port variable we declared
    console.log(`Server running on port ${PORT}`) // console log the running port 
}) // closing the listen