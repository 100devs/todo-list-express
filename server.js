const express = require('express') //Allows access to express module
const app = express() //Allows us to call the express methods in an easy to read/write variable
const MongoClient = require('mongodb').MongoClient //Allows access to the db methods
const PORT = 2121 //The local port
require('dotenv').config() //Loads environment variables such as DB_STRING or other info we want to keep secure into process.env


let db, //Creates a variable to hold the db
    dbConnectionStr = process.env.DB_STRING, //Stores the db connection string in a variable stored in the .env file
    dbName = 'todo' //Assigns the name 'todo' to the variable dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connects to the db and responds with a console log
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //Allows the use of ejs template to render the page
app.use(express.static('public')) //Middleware to store the static css and js files via HTTP
app.use(express.urlencoded({ extended: true })) //Middleware used to recognize the incoming request object as strings or arrays
app.use(express.json()) //Middleware which puts the parsed data from the incoming JSON request into req.body


app.get('/',async (request, response)=>{ //Directs to the root route '/'
    const todoItems = await db.collection('todos').find().toArray() //Goes to the todos collection, finds all the docs and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Counts all the documents and gives them the property completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Responds by rendering the ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Create request onto the 'addTodo' route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Adds a document to the todo collection in the db with the properties thing and completed
    .then(result => {
        console.log('Todo Added') //Results with 'Todo Added' printed to the console
        response.redirect('/') //Refreshes the page by redirecting to the root route
    })
    .catch(error => console.error(error)) //If the request is unsuccessful, print the error to the console
})

app.put('/markComplete', (request, response) => { //Makes request to update the 'markComplete' route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Goes to the todo collection and updates one thing
        $set: {
            completed: true //Sets the completed property to true
          }
    },{
        sort: {_id: -1}, //Sort the list in descending order from first to last
        upsert: false //Ensures that a new document is not inserted into the collection
    })
    .then(result => {
        console.log('Marked Complete') //Prints 'Marked Complete' to the console
        response.json('Marked Complete') //The server responds with 'Mark Complete'
    })
    .catch(error => console.error(error)) //If the request is unsuccessful, print the error to the console

})

app.put('/markUnComplete', (request, response) => { //Makes request to update the 'markUncomplete' route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Goes to the todo collection and updates one thing
        $set: {
            completed: false //Sets the completed property to false
          }
    },{
        sort: {_id: -1}, //Sort the list in descending order from first to last
        upsert: false //Ensures that a new document is not inserted into the collection
    })
    .then(result => {
        console.log('Marked Complete') //Prints 'Marked Complete' to the console
        response.json('Marked Complete') //The server responds with 'Mark Complete'
    })
    .catch(error => console.error(error)) //If the request is unsuccessful, print the error to the console

})

app.delete('/deleteItem', (request, response) => { //Makes a delete request to the 'deleteItem' route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) ////Goes to the todo collection and deletes one thing
    .then(result => {
        console.log('Todo Deleted') //Prints 'Todo Deleted' to the console
        response.json('Todo Deleted') //The server responds with 'Todo Deleted'
    })
    .catch(error => console.error(error))//If the request is unsuccessful, print the error to the console

})

app.listen(process.env.PORT || PORT, ()=>{ //Tells the server to listen on the environment's port or the port that we assigned locally
    console.log(`Server running on port ${PORT}`) //Prints to the console what port the server is running on
})