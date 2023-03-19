const express = require('express')//making it possibe to use express in this file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes is possible to use methods associated with MOngoDB and MongoClient talks to MongoDB. MongoClient is a class
const PORT = 2121 //setting a constant to define the location where our server will be listening.
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //declaring a variable called db but not assigning a value. it is a global variable
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a varible and assigning the name of the database we will be using
    console.log(dbConnectionStr)//logging to the console
    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB and passing in our connection string
//we are also passing in additional property
    .then(client => { //waiting for the connection and proceeding if successful and passing 
        //in all the client information.
        
        console.log(`Connected to ${dbName} Database`)//log to the console: "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method.
    })//closing our .then
 //middleware- helps facilitate communication-open communication channels for our request   
app.set('view engine', 'ejs') //sets EJS as the default render method
app.use(express.static('public')) //sets the location for static assets (style.css, HTML, and main.js)
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content.
//Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //  '/' is root. starts a GET method when the root route is passed in, sets up req and res parameters.
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to 
    //later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering EJS file and passing through 
    //the DB items and the count remaining inside of an object


    //***this next code does the same thing as the code above, just a diff way to write it */
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item
    // into todos collection, grabs the item from the box in the form(todoItem), gives it a completed value of false by default
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log action 
        response.redirect('/')//gets rid of the /addTodo route and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//catching errors 
})//ending the POST 

app.put('/markComplete', (request, response) => {//starts an PUT method when themarkComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the DB for one item
        // matching a name of the item passed in from the main.js file that was clicked on
        $set: {//starting a new object-
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if UPDATE was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending PUT

app.put('/markUnComplete', (request, response) => {//starts an PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the DB for one item
        // matching a name of the item passed in from the main.js file that was clicked on
        $set: {//starting a new object-
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if UPDATE was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })
    .catch(error => console.error(error))//catching errors

})//ending PUT

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in the todos collection for one item that has a 
    // matching name from our JS file.
    .then(result => {//starts a then if DELETE was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//close .then
    .catch(error => console.error(error))//catching errors

})//ending DELETE

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be 
    //listening on- either the port from the .env the port variable we set
    console.log(`Server running on port ${PORT}`)//log the running port
})//end the LISTEN