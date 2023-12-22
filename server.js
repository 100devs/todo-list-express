/*You have to add all necessary modules here at the top*/

//Imports Express framework to Node
const express = require('express')
//Initializes the Express application (runs express like calling a function)
const app = express()
//Imports MongoDB module for Node 
const MongoClient = require('mongodb').MongoClient
//sets the port for the server to listen on
const PORT = 2121
require('dotenv').config()


//(initialize database variable)
let db, 
    //holds retrieved  Mongodb connection string from the .env file (enviromnment variables: is for sensitive/ private info like keys and strings)
    dbConnectionStr = process.env.DB_STRING,
    //sets database name
    dbName = 'todo'

//connects to MongoDB with string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //promise handling for successful connection 
    .then(client => {
        //logs succesful connection
        console.log(`Connected to ${dbName} Database`)
        //sets db variable as the collection named 'todo'
        db = client.db(dbName)
    })

//method that sets the template engine to EJS, the template files live in the 'views' folder 
app.set('view engine', 'ejs')
//method that serves the static files in the 'public' directory (public is client-facing)
app.use(express.static('public'))
//method that parses urlencoded requests
app.use(express.urlencoded({ extended: true }))
//method that parses JSON requests
app.use(express.json())


//responds with the homepage ('/' route)
app.get('/',async (request, response)=>{
    //finds the todo collection and makes array of documents, now held by 'todoItems'
    const todoItems = await db.collection('todos').find().toArray()
    //returns number of documents that match the completed:false key:value
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends rendered view to the client and assigns local variables for the documents
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})


//creates: Post req made to the /addTodo path
app.post('/addTodo', (request, response) => {
    //in todo collection, one document is added with 2 key:value pairs. the 'thing' value comes from the body of the submitted form input with 'action' that matches the '/addTodo' path, and a name of 'todoItem', the 'completed' value is hard coded as false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //console logs completion
        console.log('Todo Added')
        //redirects to the homepage
        response.redirect('/')
    })
    //catches any error and logs to console
    .catch(error => console.error(error))
})


//updates: Put req made to the /markComplete path to update
app.put('/markComplete', (request, response) => {
    //updates document that matches the 'itemFromJs' key, which is declared in the markComplete Javascript function
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //updates the 'completed' key to have a value of true
        $set: {
            completed: true
          }
    },{
        //sorts documents in descending order
        sort: {_id: -1},
        //upsert can insert the document if it wasnt found, this is set to false so it doesn't do that
        upsert: false
    })
    .then(result => {
        //console logs completion
        console.log('Marked Complete')
        //responds that request was completed
        response.json('Marked Complete')
    })
    //catches any errors and logs
    .catch(error => console.error(error))

})

//updates: Put req made to the /markUnComplete path to update
app.put('/markUnComplete', (request, response) => {
    //updates document that matches the 'itemFromJs' key, which is declared in the markUnComplete Javascript function
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //updates the 'completed' key to have a value of false
        $set: {
            completed: false
          }
    },{
        //sorts documents in descending order
        sort: {_id: -1},
         //upsert can insert the document if it wasnt found, this is set to false so it doesn't do that
        upsert: false
    })
    .then(result => {
        //console logs completion
        console.log('Marked Complete')
         //responds that request was completed
        response.json('Marked Complete')
    })
    //catches any errors and logs
    .catch(error => console.error(error))

})

//deletes: Delete req made to the /deleteItem path
app.delete('/deleteItem', (request, response) => {
    //deletes document that matches the 'itemFromJs' key, which is declared in the deleteIem Javascript function
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console logs completion
        console.log('Todo Deleted')
        //responds that request was completed
        response.json('Todo Deleted')
    })
     //catches any errors and logs
    .catch(error => console.error(error))

})

//listens for connections on PORT declared here OR "process.env" which is the PORT of the user environment
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})