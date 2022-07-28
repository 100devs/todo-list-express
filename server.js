//modules
const express = require('express') //make node use express
const app = express() //Create an app using express
const MongoClient = require('mongodb').MongoClient // Set app to require MongoDB
const PORT = 2121 //set's the local port at 2121, can be overwritten
require('dotenv').config()  //Where we are putting our Mongo login, requires this file to access it


let db, //establishing we are using a database
    dbConnectionStr = process.env.DB_STRING, //setting local variable to the ENV variable
    dbName = 'todo' //setting the database name, needs to match MDB or it will make a database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Using the connectionStr we set above, useUnifiedTopology functions like a body parser
    .then(client => { //respond to the client with
        console.log(`Connected to ${dbName} Database`) //Print to console that we are connected to everything we need to be
        db = client.db(dbName) //defines database as what we are connected to
    })
//Defining Middleware
app.set('view engine', 'ejs') //Telling our app to use view engine to render EJS for our files
app.use(express.static('public')) //Use a public folder for our server
app.use(express.urlencoded({ extended: true })) //Use middleware to sendback encoded, uniform code
app.use(express.json()) //Telling the app to respond in a JSON string


app.get('/',async (request, response)=>{ //fetching from database, sending a request, getting back a response
    const todoItems = await db.collection('todos').find().toArray() //Creating constant array called toDoItems from the todos databse items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //looks for any items that aren't completed in our database and returns a numeric value
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells EJS to render, using items and what's left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//Adding to the database, sending a request, expecting a response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one item to the checklist, as uncompleted
    .then(result => { //when it gets a result...
        console.log('Todo Added') //Print to the console that item has been added
        response.redirect('/') //Reload the page
    })
    .catch(error => console.error(error)) //If Error, print error
})

app.put('/markComplete', (request, response) => {//updating something in the database, sending a request, expecting a response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Go into the collection and update the item in the database that corresponds to the EJS printed variables name
        $set: { //setting a the corresponding item's status variable to...
            completed: true //to status true!
          }
    },{
        sort: {_id: -1}, //Once marked as completed, resorts array in descending order
        upsert: false  //Don't if you can't find the item
    })
    .then(result => { //After, our results is
        console.log('Marked Complete') //Prints to console we've marked it
        response.json('Marked Complete')// Sends a response to the Main.js that we have completed it
    })
    .catch(error => console.error(error)) //If Error, print error

})

app.put('/markUnComplete', (request, response) => { //Sends an update request, awaiaiting a response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Find item with corresponding name
        $set: { //then update it
            completed: false //Mark the item as not completed
          }
    },{
        sort: {_id: -1}, //Resort that array
        upsert: false //Don't if you can't find the item
    })
    .then(result => { //once that is done...
        console.log('Marked Complete') //prints to console that it is done
        response.json('Marked Complete') //Sends back to Main.js that we did it
    })
    .catch(error => console.error(error)) //If Error, print error

})

app.delete('/deleteItem', (request, response) => {//Sends to database a delete request, awaiaiting a response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Tells MongoDB to delete one item, that matches the itemfromEJS
    .then(result => { //once that is done...
        console.log('Todo Deleted') //Print to the console that it is deleted
        response.json('Todo Deleted') //Replies back to the main.js
    })
    .catch(error => console.error(error)) //If Error, print error

})

app.listen(process.env.PORT || PORT, ()=>{ //Use local PORT or use the one available
    console.log(`Server running on port ${PORT}`) //Print to console what port we using at this time
})
