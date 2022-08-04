const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient  //setting a constant that allows us to use methods associated with mongo client and lets us talk to db 
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //declaring variable called db without assigning anything. Global variable
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it.(it looks in .env file)
    dbName = 'todo' //declaring variable and assigning name to database i want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongodb, passing in connectionString, and also passing in another property
    .then(client => {  //why then? because we only want to do this if connection is successful. Waiting on connection. Also passing in client info
        console.log(`Connected to ${dbName} Database`) //template literal to let us know that connection is successful to todo database
        db = client.db(dbName) //assigning value to previously declared variable that contains a db client factory method
    }) //closing our then

//middleware- helps facilitate communication    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //default location for static assets: style sheets, photos, html
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests

//getting into the methods
app.get('/',async (request, response)=>{   //starts a get method when root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()  //sets variable and awaits ALL items from todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //sets variable and awaits a count of uncompleted items to display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing through the db items and the count remaining inside of an object.
    //below is the classic promise with then statements/ does the same thing as the asynch above
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  //starts a post method when the add route is passed in (from the form in EJS)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //look in collection called todos collection in db and insert new item that is an object with two keys(thing and completed)
    //the value for thing is the text typed into the input box. check form in EJS.   completed value is false because it is a new task because it is not completed by default (we don't want a line through it)
    .then(result => { //if insert is successful do something
        console.log('Todo Added')  //console log the change
        response.redirect('/') //when we use the form to pass an action we change the route, we want to go back to the home path. Re-direct  back home
    })  //closing then
    .catch(error => console.error(error))//catcgubg errors
}) //closing post

app.put('/markComplete', (request, response) => { //updates when the marked complete route is passed through
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //go into collection called todos and look for one item matching the name of the item
        //passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed value to true
          }
    },{
        sort: {_id: -1}, //  moves item to bottom of list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => { //starting then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete')  //sending response back to sender
    }) //closing then
    .catch(error => console.error(error)) //catching errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //starting a put request with a new route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to db and find item that matches item clicked on
        $set: {
            completed: false //set completed value to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => {  //starting then if item is complete
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending response back to sender
    }) //closing then
    .catch(error => console.error(error))  //catching errors

}) //ending put

app.delete('/deleteItem', (request, response) => {  //starting delete when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //loooking in db and using the deleteOne method- looking for name that was passed from js file
    .then(result => { //if delete was successful start then
        console.log('Todo Deleted') //log results
        response.json('Todo Deleted') //send response
    })
    .catch(error => console.error(error)) //catch error

}) //close delete

app.listen(process.env.PORT || PORT, ()=>{  //specifying which port to be used gets the one out of env file or whatever port variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end listen