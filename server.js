const express = require('express') // making it possible to use express in this file. 
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where my server will be listening. 
require('dotenv').config() //allows us to look for variables inside of the .env file. 


let db, // declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring another variable that is assigned to our database connection string to it. 
    dbName = 'todo' //declaring a variable, setting the name of the database that will be used. 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string. Also, passing in an additional property: { useUnifiedTopology: true }) <-- not sure what this does...
    .then(client => { //waiting for the connection and proceeding if successfil, and passing in all the client information. 
        console.log(`Connected to ${dbName} Database`) //a template literal that is logged, 'connected to todo database'. 
        db = client.db(dbName) //assigning a value to a previously declared db variable that contains a db client factory method. 
    }) //closing our .then method


//middleware - helps open the communication channels for our requests. 
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects. 
app.use(express.json()) //parses JSON content from incoming requests. (replacing body-parser)


//***the  async await approach ***

app.get('/', async (request, response) => { //Starts a GET method when the root route ('/') is passed in, sets up req and res parameters. 
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection. 
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //sets a variable and awaits a count of uncompleted items to later display in EJS. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //2 things happening: Rendering the EJS file and passing through the DB items and the count remaining inside of an object


    //***the promise with then approach ***
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close out the read/get request

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item into todos collection, gives it a completed value of false by default.  
        .then(result => { //if insert is successful, do something
            console.log('Todo Added') //console.log actions
            response.redirect('/') // Gets rid of the /addTo route and redirects back to the home page (root route)
        }) //closes the then method
        .catch(error => console.error(error)) //logs the error
}) //ending the post request

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in. 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the DB for one item matchign the name of the item passed in from the main.js file that was clikced on. 
        $set: { //Open the Set 
            completed: true //set completed status to true
        } //close the Set
    }, {
        sort: { _id: -1 }, // moves the item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') //logging success
            response.json('Marked Complete') //sending a response back to the sender
        }) //close the then
        .catch(error => console.error(error)) //catching errors

}) //ending the put request

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in. 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the DB for one item matchign the name of the item passed in from the main.js file that was clikced on. 
        $set: {//Open the Set 
            completed: false   //set completed status to false
        }//close the Set
    }, {
        sort: { _id: -1 }, // moves the item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') //logging success
            response.json('Marked Complete') //sending a response back to the sender
        }) //close the then
        .catch(error => console.error(error)) //catching errors

}) //ends the put request. 

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed. 
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //look inside the todo collection for the ONE item that has a matching name from our JS file. 
        .then(result => { //starts a then if update was successful
            console.log('Todo Deleted') //logging success
            response.json('Todo Deleted') //sending a response back to the sender
        }) //close the then
        .catch(error => console.error(error)) //catching errors

}) //ends the delete request. 

app.listen(process.env.PORT || PORT, () => { //setting up which port we will be listening on - either from the env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port.
}) //end the listen method. 