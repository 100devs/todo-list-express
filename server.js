const express = require('express') //initialize express library as express variable
const app = express()  //make a shortcut to express()
const MongoClient = require('mongodb').MongoClient //initialize MongoClient from the mongodb library into MongoClient variable
const PORT = 2121 // Set the localhost port 
require('dotenv').config() //Load environmental variables into server.js


let db, //initialize db variable
    dbConnectionStr = process.env.DB_STRING, // initialize connectionString from .env file variable DB_String
    dbName = 'todo' //name of Database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }) // Uses the dbConnectionStr and useUnifiedTopology to run MongoClient.connect. Then a promise is created to log a connect message
        // and set the db variable to a persistant connection so it can be reused by the application
    
app.set('view engine', 'ejs') //set the language used by express view engine to EJS
app.use(express.static('public')) //Any file that is in the static is shared with the client
app.use(express.urlencoded({ extended: true })) //converts characters into ascii
app.use(express.json()) //parses json from incoming data 


app.get('/',async (request, response)=>{ //Makes a get for the root path
    const todoItems = await db.collection('todos').find().toArray() //Grab the todo list items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Count the todos that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // returns the index.ejs and a json containing the todos and the count of not completed todos
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Create Operation used to add a todo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one document from the request 
    .then(result => {
        console.log('Todo Added') //records when a todo has been successfully added to the db collection
        response.redirect('/') // redirects the clients browser webpage to the root
    })
    .catch(error => console.error(error)) // if the todo is not added correctly to the db, log the error in the console
})

app.put('/markComplete', (request, response) => { //Update Operation used to mark a todo complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update one document in the todos collection
        $set: {
            completed: true //Set the todo from itemFromJS to true
          }
    },{
        sort: {_id: -1}, //set the sort order newest first
        upsert: false //update the todo but if the todo does not exist, create it.
    })
    .then(result => {
        console.log('Marked Complete') // record that a todo has been marked completed in the collection on the server
        response.json('Marked Complete') //return a json as a response
    })
    .catch(error => console.error(error)) //if there is an error record it in the server console

})

app.put('/markUnComplete', (request, response) => { //Update Operation to mark the the todo uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the document todo using the todo text "itemFromJS" from the html form
        $set: {
            completed: false //set completed
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //Delete Operation to remove a todo from the DB
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // find one todo based on itemFromJS (text from body) for deletion
    .then(result => {
        console.log('Todo Deleted') //Record a successful deleted todo from the server
        response.json('Todo Deleted') //Return a successful deleted todo to the client
    })
    .catch(error => console.error(error)) //if thre is an error, record the error on the server console

})

app.listen(process.env.PORT || PORT, ()=>{ //Listen to the Port number from the environment or if that does not exist, use the port number from the variable in server.js
    console.log(`Server running on port ${PORT}`) //Display in the server console that the server is running
})