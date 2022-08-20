// Import the express library and set it to the variable express
const express = require('express')
// Set the intance of express to the variable named "app"
const app = express()
// Setting up how we are going to talk to the Mongo database
const MongoClient = require('mongodb').MongoClient
// Setting up a variable named "PORT" to define where our server will be listening
const PORT = 2121
//Setting up environment variables to not push the secrets to github which are inside the .env file
require('dotenv').config()


let db, //Declaring a variable named "db"
    dbConnectionStr = process.env.DB_STRING, //Declaring a variable and assigning the DB_String that Mongo Atlas has given to connect to the Mongo database which is in the .env file
    dbName = 'todo' //Declaring a variable and assigning it the name of the database that we will be using
// Connecting to the Mongo Database and passing our connection string and an additional property
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {   //If it connects then it will run and pass in all the client information
        console.log(`Connected to ${dbName} Database`)  //The template literal is logged to the console "Connected to todo Database"
        db = client.db(dbName)  //Assigning a value to a previously declared db variable that contains a db client factory method
    })

//middleware
//We are letting Express know that we are using ejs as our templating language
app.set('view engine', 'ejs')
//We are setting up our public folder so our static folders placed in there don't need a special custom route
app.use(express.static('public'))
//Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.urlencoded({ extended: true }))
// Tells Express to use JSON (Parses JSON content from incoming requests)
app.use(express.json())

// Responds to a get request to the '/' route
app.get('/',async (request, response)=>{    //Starts a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   //Sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders the EJS file and passes through the db items and counts the remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Responds to a post request to the '/addTodo' route
app.post('/addTodo', (request, response) => {   //Starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // Inserts a new todo item into the list and sets it as false because it's not completed
    .then(result => {   //If insert is succesful, do something
        console.log('Todo Added')   //console log action
        response.redirect('/')  //Goes back or redirects to the homepage
    })
    .catch(error => console.error(error))   //Catching errors
})

app.put('/markComplete', (request, response) => {   //Starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks in the db for one item matching the name of the item pass in from the main.js file that was clicked on
        $set: { 
            completed: true //Set completed status of the item to true
          }
    },{
        sort: {_id: -1},    //Moves item to the bottom of the list
        upsert: false   //Prevents insertion if item does not already exist
    })
    .then(result => {   //Starts a then if update was successful
        console.log('Marked Complete')  //Logging successful completion
        response.json('Marked Complete')    //Sending a response back to the sender
    })
    .catch(error => console.error(error))   //Catching errors

})

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Looks in the db for one item matching the name of the item pass in from the main.js file that was clicked on
        $set: {
            completed: false    //Set completed status of the item to false
          }
    },{
        sort: {_id: -1},    //Moves item to the bottom of the list
        upsert: false   //Prevents insertion if item does not already exist
    })
    .then(result => {   //Starts a then if update was successful
        console.log('Marked Complete')  //Logging successful completion
        response.json('Marked Complete')    //Sending a response back to the sender
    })
    .catch(error => console.error(error))   //Catching errors

})

app.delete('/deleteItem', (request, response) => {  //Starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //Looks in the db for one item matching the name of the item pass in from the main.js file that was clicked on
    .then(result => {   //Starts a then if delete was successful
        console.log('Todo Deleted') //Logging successful completion
        response.json('Todo Deleted')   //Sending a response back to the sender
    })
    .catch(error => console.error(error))   //Catching errors

})

app.listen(process.env.PORT || PORT, ()=>{  //Setting up which PORT we will be listening on. Either the PORT from the .env file or the PORT variable we set
    console.log(`Server running on port ${PORT}`)   //Log to the console the running PORT
})