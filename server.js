const express = require('express')//imports express framework
const app = express() //creates express application instance
//import MongoClient from MongoDB package
const MongoClient = require('mongodb').MongoClient
//Sets the port number the server will run 
const PORT = 2121
//loads environment variables from .env file
require('dotenv').config()

//Declares these variables:
let db, //db will hold the database connection
    //dbConnectionStr = MongoDB connection string from .env file
    dbConnectionStr = process.env.DB_STRING, 
    //dbName = name of the database('todo')
    dbName = 'todo'
//connect MongoDB using the connection string and uses new MongoDB connection
//engine, returns a promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//when the connection succeeds, run this function below.
    .then(client => {
        //print out success message to console 
        console.log(`Connected to ${dbName} Database`)
        //sets the db variable to 'todo'database
        db = client.db(dbName)
    })//closes the .then()block
    
app.set('view engine', 'ejs')//tells express to use EJS as templating engine
app.use(express.static('public'))//serves static files(CSS/JS) from the public folder
app.use(express.urlencoded({ extended: true }))//Middleware to parse form data from POST requests
app.use(express.json())//Middleware to parse JSON data from requests

/*
defines GET route for homepage(/)
async() is the function can use await for asynchronous operations
including two parameters:
request-> incoming request object;
response-> object to send response back to client*/
app.get('/',async (request, response)=>{
    //get all the documents from 'todos' collection, find them and list them in an array
    //await-> waits for database operation to complete
    const todoItems = await db.collection('todos').find().toArray()
    //count the amount of incompleted items, stored the amount in itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render index.ejs template,
    //passes array of all todosItems and the amount of incompleted todos
    //to the template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))

    //commented out line 48-line55: 
    /* The original code was using .then() instead of async/await
    async/await is cleaner and easier to read so modern code prefer this method
    */  
}) //closes the Get route

//Define Post route at /addTodo
//Triggered when the form in the EJS file is submitted
app.post('/addTodo', (request, response) => {
    //insert a new document to todos collections
    //create objects:
    //declare thing = the todo text from form input name is todoItem
    //todoIteam condition is incompleted if completed = false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //when insert succeeds, runs this function
    .then(result => {
    //print out success message to console     
        console.log('Todo Added')
        //redirects user back to homepage, this refreshes the page to show 
        //the new todo
        response.redirect('/')
    })
    .catch(error => console.error(error))//if error occurs, print it out to console
}) //closes the route function

//Define PUT route at /markComplete
//Called from frontend JS(main.js) when user clicks a todo
app.put('/markComplete', (request, response) => {
    //Updates one document in 'todos' collection
    //first parameter declares filter to find the todo from frontend
    //second parameter declares update conditions
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //MongoDB operator to set field value
            completed: true //set completed field to be true
          }
    },{ //third parameter is options object
        sort: {_id: -1}, //update according to descending order
        upsert: false //dont create new item if no match found
    })
    .then(result => {//when update succeeds
        console.log('Marked Complete')//print out to console
        response.json('Marked Complete')//send JSON response back to frontend
    })
    .catch(error => console.error(error))//catches and print out errors

})//closes the put route

//declares PUT rounte at /markUnComplete
app.put('/markUnComplete', (request, response) => {
    //first parameter declares filter to find todos from frontend main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //seconde parameter declares update conditions
        $set: { //MongoDB operator to set field value
            completed: false //set completed filed to be false
          }
    },{ //third parameter is option object
        sort: {_id: -1},//update the newest incompleted item by descending order
        upsert: false //dont create new item if no match found
    })
    .then(result => {//if update succeeds 
        console.log('Marked Complete')// BUG: here should print out Marked Incompleted to console
        response.json('Marked Complete')//BUG: here should response Marked Incompleted to JSON
    })
    .catch(error => console.error(error))//catch and print out error if any

})//closed the put route

//define delete route at /deleteItem,
//Called from frontend when user clicks trash icon
app.delete('/deleteItem', (request, response) => {
    //Deletes ONE document from 'todos' collection
    //first parameter is to filter the item match thing defination
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {//if update succeeds
        console.log('Todo Deleted')//print out 'Todo Deleted' to console
        response.json('Todo Deleted')//response 'Todo Deleted' to frontend
    })
    .catch(error => console.error(error))//catch and print out error if any

}) //closes the delete route

//listen from env file or port 2121 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)//print out message if server starts 
})//closes the listen function