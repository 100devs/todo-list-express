const express = require('express') //makes it possible to use express 
const app = express() //sets a variable and assigns it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with the MongoClient and talk to our databases
const PORT = 2121 //sets the variable of PORT to 2121
require('dotenv').config() //allows us to look for variables inside of the .env file


let db,//declares a variable dcalled db, but doesn't assign a value
    dbConnectionStr = process.env.DB_STRING,//declares a varaible and assigns our database connection string to that variable
    dbName = 'todo'//declares a variable and assigns it to "todo" which is the name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creates a connection to MongoDB and passes in the connection string and opts in to the new MongoDB topology engine
    .then(client => {//wait sfor a connection, then proceeds if connection is successful by passing in all the client info
        console.log(`Connected to ${dbName} Database`)//prints to the console a template literal "connected to todo Database"
        db = client.db(dbName)//assigns a value to the previously declared db variable that contains a client factory method
    })//closes .then
    
//sets up middleware
app.set('view engine', 'ejs')//sets ejs as the default render method
app.use(express.static('public'))//sets the location for statis assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs
app.use(express.json())//parses JSOIN content from incoming requests


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, and sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the todos collection in the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//renders the EJS file and passes through the db items and the count remaining inside of an object
    //the commented out code below is just a alternate promise version of lines 25-28
    // db.collection('todos').find().toArray() 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//closes the GET method

app.post('/addTodo', (request, response) => {//starts a POST method when the /addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into the todos collection and gives it a default completed value of false
    .then(result => {//if the insert is successful, do a thing
        console.log('Todo Added') //print the action to the console
        response.redirect('/')//redirect from the /addTodo route back to the root / route
    })//cloes the .then
    .catch(error => console.error(error))//catches any errors and prints them to the console
})//closes the POST method

app.put('/markComplete', (request, response) => {//starts a PUT method when the /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//searches the db for one item matching the name of the item being passed in from the main.js file that was clicked
        $set: {//sets....
            completed: true//...completed status to true (from the default false)
          }//closes the set
    },{//starts another thing
        sort: {_id: -1},//moves the item to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })//closes the thing
    .then(result => {//starts a then if the update was successful
        console.log('Marked Complete')//prints to the console that the completion was successful
        response.json('Marked Complete')//sends the successful completion reponse back to the sender
    })//closes .then
    .catch(error => console.error(error))//catches any errors and prints them to the console
})//closes the PUT method

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//searches the db for one item matching the name of the item being passed in from the main.js file that was clicked
        $set: {//sets...
            completed: false//...completed status to false
          }//closes the set
    },{//starts another thing
        sort: {_id: -1},//moves the item to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })//closes the thing
    .then(result => {//starts a then if the update was successful
        console.log('Marked Complete')//prints to the console that the completion was successful
        response.json('Marked Complete')//sends the successful completion reponse back to the sender
    })//closes .then
    .catch(error => console.error(error))//catches any errors and prints them to the console
})//closes the PUT method

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the /deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//searches the db for one item matching the name of the item being passed in from the main.js file that was clicked
    .then(result => {//starts a then if the delete was successful
        console.log('Todo Deleted')//prints to the console that the delete was successful
        response.json('Todo Deleted')//sends the successful delete reponse back to the sender
    })//closes .then
    .catch(error => console.error(error))//catches any errors and prints them to the console
})//closes the DELETE method

app.listen(process.env.PORT || PORT, ()=>{//sets up the port to listen on and allows it to either be the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)//prints 'Server running on port..." with a template literal to contain the port number
})//closes the listen method