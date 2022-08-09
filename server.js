const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for vairiables inside the .env file


let db, //declaring a variable called db
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning it the value of our database connection string
    dbName = 'todo' //declaring a variable and assigning the name of the database we'll be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDb and passing in the connection string
    .then(client => { //waiting for the connection and proceeding if it works
        console.log(`Connected to ${dbName} Database`) //logging to the console the string with the database name
        db = client.db(dbName)  //setting the vairable db to be equal to the database equal to the variable dbName
    })
    
//middleware
app.set('view engine', 'ejs') //set how we are going to render the page
app.use(express.static('public'))  //location of the css/js files.
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content.  Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests


app.get('/',async (request, response)=>{  //starts a GET method when ther root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets variable and awaits all items in the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// sets variable and awaits a count of the uncompleted items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Render EJS file and pass through the db items and the count of remaining items inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) //logs any errors cought in the console
}) //close route

app.post('/addTodo', (request, response) => { //starts a POST method when ther root route is passed in, sets up req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection gives it a completed value of false by default
    .then(result => { //if insert is successful, do this:
        console.log('Todo Added') // log in the console ...
        response.redirect('/') //Redirect the back to the "/" route
    }) //close then
    .catch(error => console.error(error)) //logs any errors cought in the console
}) //close route

app.put('/markComplete', (request, response) => { //starts a PUT method when ther root route is passed in, sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates an item in the collection that has a name matching the item passed in with the value of request.body.itemsFromJS
        $set: { //open a set
            completed: true //sets the value of completed to be true 
          } //closes the set
    },{ 
        sort: {_id: -1},//move the to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs that status in the console
        response.json('Marked Complete') //sends a response back to the sender
    })//close then
    .catch(error => console.error(error)) //catch errors

})  //end put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when ther root route is passed in, sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates an item in the collection that has a name matching the item passed in with the value of request.body.itemsFromJS
        $set: { //open a set
            completed: true //sets the value of completed to be true 
          } //closes the set
    },{ 
        sort: {_id: -1},//move the to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs that status in the console
        response.json('Marked Complete') //sends a response back to the sender
    })//close then
    .catch(error => console.error(error)) //catch errors

})  //end put

app.delete('/deleteItem', (request, response) => {//starts a delete method when ther root route is passed in, sets up req and res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sneder
    }) //close .then
    .catch(error => console.error(error)) //catch errors

})//close delete

app.listen(process.env.PORT || PORT, ()=>{ //tells the app which port we will be listening on: either from the .env file or from the variable PORT
    console.log(`Server running on port ${PORT}`) //log which port the server is running on
}) //close app.listen