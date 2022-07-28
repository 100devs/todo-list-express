const express = require('express')  //making it possible to use express in this file
const app = express()  //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient  // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121  //setting a constant to define the location where our server will be listening
require('dotenv').config()  // allows us to look for variables on the .env file


let db,  // declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,  //declaring a varialble and assigning our database connection string to it
    dbName = 'todo'  //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //creating a connection to MongoDB, and passing in our connection string.  Also passing in an additional property
    .then(client => {  // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)  // log to the console status update that we connected to the database
        db = client.db(dbName)  // assigning a value to the previously declared db variable that contains a db client factory method
    })  //closing our then

//middleware
app.set('view engine', 'ejs')  //sets ejs as main render method
app.use(express.static('public'))  //sets the location for static assets
app.use(express.urlencoded({ extended: true }))  //tells Express to encode and decode URLs where the header matches the content.  Extended property adds support for arrays and objects
app.use(express.json())  // parses JSON content


app.get('/',async (request, response)=>{  //starts a GET method to the root route, and establishes request and response parameters
    const todoItems = await db.collection('todos').find().toArray()  //sets a variable and awaits all items from the Todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //sets a variable and awaits the count of documents that have NOT been completed to be displayed later in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing the database items and the count of items remaining to be completed
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  //starts a POST method when the add route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //inserts a new item into the todos collection (assigns a completed value of false as default)
    .then(result => {  //if insert is successful, do something
        console.log('Todo Added')  //logs to console that the add was done successfully
        response.redirect('/')  //redirects back to the main page and clears the /addTodo route
    })  //closes then method
    .catch(error => console.error(error))  //catches errors
}) //closes post method

app.put('/markComplete', (request, response) => {  //starts a PUT method when the /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //looks into the database for the item that was clicked on from the page and passed thru by main.js
        $set: {
            completed: true  //sets completed status to true
          }
    },{
        sort: {_id: -1},  //moves item to the bottom of the list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => {  //starting a then if the update was successful
        console.log('Marked Complete')  // logs to console marking a successful completion of the item
        response.json('Marked Complete')  // tells the requestor that the request has been completed
    })  //closing then method
    .catch(error => console.error(error))  //catching errors

})  //ending put

app.put('/markUnComplete', (request, response) => {  //starts a PUT method when the /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //looks into the database for the item that was clicked on from the page and passed thru by main.js
        $set: {
            completed: false  //sets completed status to false
          }
    },{
        sort: {_id: -1},  //moves item to the bottom of the list
        upsert: false    //prevents insertion if item does not already exist
    })
    .then(result => {   //starting a then if the update was successful
        console.log('Marked Uncomplete')  // logs to console marking a successful completion of the item
        response.json('Marked Uncomplete')  // tells the requestor that the request has been completed
    })  //ending then method
    .catch(error => console.error(error))  //catching errors

})  //ending put

app.delete('/deleteItem', (request, response) => {  //starts a delete method when the /deleteItem route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})   // looks into the database for the one item that was passed thru from our js file
    .then(result => {  // if successful, start then method
        console.log('Todo Deleted')   // console log result
        response.json('Todo Deleted')  // send response back to the requestor
    })  //close then
    .catch(error => console.error(error))  //catch error

})  //end delete

app.listen(process.env.PORT || PORT, ()=>{   //setting up which port to be listening for - either in .env file or a PORT variable we set
    console.log(`Server running on port ${PORT}`)  //log to the server which port being ran
})  //end the listen method