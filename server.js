const express = require('express') // require express makes it possible to use
const app = express() // require app express set a variable and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with Mongo Client and talk to our DB
const PORT = 2121 // PORT goes here setting a constant to define the location where our server will be listening.
require('dotenv').config() // allows us to look for the variables inside of the .env file


let db, //declare a variable called db but doesnot assign
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongo db and passing in our connection string and passing in an additional property
    .then(client => { // waiting for connection and proceeding if successful and passing in all client information
        console.log(`Connected to ${dbName} Database`) // log to console a template literal "connected to todo database"
        db = client.db(dbName)// assigning a value to previously declared db value that contains
    })
    
    //middleware 
app.set('view engine', 'ejs') // set ejs view engine as default render method
app.use(express.static('public')) // set express static location to public folder
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URL's where the header matches the content. supports arrays and objects
app.use(express.json()) // Parses json content


app.get('/',async (request, response)=>{// starts a GET method when the root Route is passed in sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing through the db items and count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful do something,
        console.log('Todo Added')// console log action
        response.redirect('/') // gets rid of the /addTodo route, and redirects back to the homepage
    })// closing the .then 
    .catch(error => console.error(error))// catching errors
})// ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markCoplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1},// moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starting a then if update was successful 
        console.log('Marked Complete')//logging successful completion 
        response.json('Marked Complete')// response back to sender
    })// closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the PUT

app.put('/markUnComplete', (request, response) => {// starts a PUT method when the markUncomplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matchingthe name of the item passed in from the main.js file that was clicked on 
        $set: {//set completed status to false
            completed: false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false// prevents insertion if item does not already exist
    })
    .then(result => {//starting a then if update was successful 
        console.log('Marked Complete')//logging successful completion 
        response.json('Marked Complete')// response back to sender
    })//closing .then
    .catch(error => console.error(error))// catchoing errors

})// end the PUT

app.delete('/deleteItem', (request, response) => { // starts delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name for our JS File
    .then(result => {// starts a then if delete was successful
        console.log('Todo Deleted')// logging successful completion 
        response.json('Todo Deleted')// sending a response back to the sender
    })// closing.then
    .catch(error => console.error(error))// catching errors

})

app.listen(process.env.PORT || PORT, ()=>{// setting up which port we will be listening on - either the port from the .env file or the PORT variable set 
    console.log(`Server running on port ${PORT}`)// console.log the running port. 
})// close / end listen method