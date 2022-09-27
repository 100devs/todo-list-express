const express = require('express') //Makes it possible to use express in this file
const app = express() //Create an instance of express by calling it and storing in the constant app for ease of use later w/ the methods
const MongoClient = require('mongodb').MongoClient //Makes it possible to use methods associated with MongoClient & talk to our DB mongodb
const PORT = 2121 //Setting a constant that stores the PORT where our server will be listening
require('dotenv').config() //Allows us to look for variables inside of the .env file


let db, //declare a value called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable that is assigned to our database connection string which is in the .env file
    dbName = 'todo' //declaring a variable and setting the name of our db to todo (mongodb) > cluster > databases > collections > documents

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to Mongodb, and passing in our connection  string. Also passing in an additional property
    .then(client => { //Waiting for our connection to the db and if its successful, passing in our client info
        console.log(`Connected to ${dbName} Database`) //Logging to the console the name of the db if successful
        db = client.db(dbName) //Assigning a value to the previously declared db variable that contains a db client factory method
    }) //Closing .then

//middleware
app.set('view engine', 'ejs') //sets ejs as the default rendering method
app.use(express.static('public')) //where to look for static files like css which are in the public folder
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) //Helps to parse the json from incoming requests (replaces bodyparser)

//Grab data and send it to render in index.js
app.get('/',async (request, response)=>{ //starts a GET method when the root '/' route is passed in, sets up req, res params
    const todoItems = await db.collection('todos').find().toArray() //set a constant that gets all the items in the todos collection & puts them in array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a constant and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Rendering the EJS file and passing thru the db items and the count remaining, inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close app.get

app.post('/addTodo', (request, response) => { //Starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if it works then do something
        console.log('Todo Added') //Log what happened
        response.redirect('/') //Redirect back to the homepage, gets rid of /addTodo route ( a route that doesn't exist )
    }) //close .then
    .catch(error => console.error(error)) //catch any errors
}) //close app.post

app.put('/markComplete', (request, response) => { //starts a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked
        $set: {
            completed: true //Set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

}) //ending put function

app.put('/markUnComplete', (request, response) => { //starts a put method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked
        $set: {
            completed: false //set status to false for not completed
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

})

app.delete('/deleteItem', (request, response) => { //starts a delete method when the /deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in the db in the todos collection and deleteOne method deletes one item matching the name of the item passed in from the JS file that was clicked
    .then(result => { // if delete was successful start a then 
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

}) //end delete

app.listen(process.env.PORT || PORT, ()=>{ //specify the location (PORT) on which the server will be listening on - either from the .env file if there is one in there or from the port variable we set
    console.log(`Server running on port ${PORT}`) //console log the running port
})