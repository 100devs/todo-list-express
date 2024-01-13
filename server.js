const express = require('express') //importing express to this file
const app = express() //saving a particular instance of express to a variable
const MongoClient = require('mongodb').MongoClient //setting a variable to let us connect to our database
const PORT = 2121 //setting a constant to define the location where our server will be listening.
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning out database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal "connected to todo database"
        db = client.db(dbName)//assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then

//Middleware
app.set('view engine', 'ejs')//Sets EJS as the default render
app.use(express.static('public'))//Sets the default folder location for static assets. in this case, public folder
app.use(express.urlencoded({ extended: true }))//Tells Express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests

//.get is a READ part of CRUD
app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection, leaving .find() empty grabs everything
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside of an object. basically sending the database information straight to the EJS file

    //this is the way to write the code without the async function, just using .then and .catch promises. does the same thing as the code above
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//.post is a CREATE part of CRUD
app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//this makes sure that we redirect back home to the root folder after we submit the form. This is why if you backspace after submitting a form, you get that message "are you sure you want to redirect?" You have to have this here or you could possibly end up in a no-man's land url after submitting the form.
    })//closing the .then
    .catch(error => console.error(error))//catching errors
}) //ending the POST

//.put is an UPDATE part of CRUD
app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending our PUT

//same as the put above, just doing the opposite to markUncomplete
app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1},//moves the item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending our PUT

// .delete is the DELETE part of CRUD 
app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if update was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending our Delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file for the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method