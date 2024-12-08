//import the express module
const express = require('express')
//intializes the express application
const app = express()
//import the mongoDB module
//the MongoClient class provides methods to connect to a mongoDB database
const MongoClient = require('mongodb').MongoClient
//the port the server will listen
const PORT = 2121
//loads environment variables from .env file into process.env, relies on dotenv package
require('dotenv').config()

//create a variable that holds the databse
let db,
//get the db connection string from the .env file, DB_STRING is the name of the variable holding the string
    dbConnectionStr = process.env.DB_STRING,
//hold the name of the db in the variable, will be the same as what you named it in mongoDB
    dbName = 'todo'
//Mongo client is connecting to the databse with a .connect method, passing in the db Connection string and useUnifiedTopology: Ensures the use of MongoDB's updated connection management engine. This setting reduces deprecation warnings and makes connections more stable.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//This is a promise that resolves with a client object when the connection is successfully established.
    .then(client => {
        // logs the following to the consle when connected
        console.log(`Connected to ${dbName} Database`)
        //assigns the database instance to the variable db
        db = client.db(dbName)
    })

//use ejs as the template engine
app.set('view engine', 'ejs')
//serve static files from the 'public' folder
app.use(express.static('public'))
//middleware - processes incoming request bodies for form data, allows you to parse URL-encoded data, such as data submitted via HTML forms, and makes it available in req.body
//extended: true allows for parsing more complex data, such as objects and arrays.
app.use(express.urlencoded({ extended: true }))
//middleware parses incoming JSON payloads and makes them available in req.body
app.use(express.json())

//method that listens for and handles GET requests to the root route by claling an async function
app.get('/',async (request, response)=>{
    // awaits the response from the db and assigns the array of todo items in the database to a variable
    const todoItems = await db.collection('todos').find().toArray()
    // awiats the response from the db, counts the number of items in the todos collection and assigns them to a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends the two variables to the index.ejs template and assigns their values to a key to refer to them as in the template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//method to handle POST requests to the /addTodo route, the first parameter is the route where the request was made the second parameter is a function that is run when the request is received
app.post('/addTodo', (request, response) => {
    //create a new document in the "todos" collection using the "toDoItem" value in the request.body add this value to the key "thing" and the key "completed" with a value of false.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //the method above returns a promise and then the following code is executed
    //result is the promise returned
    .then(result => {
        //logo conifirmation to the console that todo was added
        console.log('Todo Added')
        //redirect the client to the root route
        response.redirect('/')
    })
    //if something goes wron log the error to the console
    .catch(error => console.error(error))
})

//method to handle PUT requests to the /markComplete route, the first parameter is the route where the PUT request is excuted from, the second parameter is the actions to take when the PUT request is received
app.put('/markComplete', (request, response) => {
    //go to the database in the 'todos' collection and find the document where the 'thing' key is equal to the what was sent in the request.body with the value of itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the key completed to 'true' on the document that matched where 'thing' matched the request.body.itemFromJS
        $set: {
            completed: true
          }
    },{
        //Sort documents by the _id field in descending order.
        sort: {_id: -1},
        //if the 'thing' is not found in the db, do not create it
        upsert: false
    })
    // actions to take when the 'result' promise is returned
    .then(result => {
        //log this message to the console upon successful processing of the request
        console.log('Marked Complete')
        //send this response to the client, the client side javaScript is waiting for the response, it will refresh the page, client-side when it receives a response and the change will be visible in the browser
        response.json('Marked Complete')
    })
    // if anything goes wrong and the promise is not returned log the error to the console
    .catch(error => console.error(error))

})
//method to handle PUT requests to the /markUnComplete route, the first parameter is the route where the PUT request is excuted from, the second parameter is the actions to take when the PUT request is received
app.put('/markUnComplete', (request, response) => {
    //go to the database in the 'todos' collection and find the document where the 'thing' key is equal to the what was sent in the request.body with the value of itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the key completed to 'false' on the document that matched where 'thing' matched the request.body.itemFromJS
        $set: {
            completed: false
          }
    },{
        //Sort documents by the _id field in descending order.
        sort: {_id: -1},
        //if the 'thing' is not found in the db, do not create it
        upsert: false
    })
    // actions to take when the 'result' promise is returned
    .then(result => {
        //log this message to the console upon successful processing of the request
        console.log('Marked Complete')
        //send this response to the client, the client side javaScript is waiting for the response, it will refresh the page, client-side when it receives a response and the change will be visible in the browser
        response.json('Marked Complete')
    })
    // if anything goes wrong and the promise is not returned log the error to the console
    .catch(error => console.error(error))

})
// run this DELETE method from the '/deleteItem' route. The first parameter is the route the request was sent to. The sedond parameter is a callback function that will run when the request is received
app.delete('/deleteItem', (request, response) => {
    //find the document in the collection where the thing value matches the the value in request.body.itemFrom JS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //the above returns a promise which is referred to as 'result' and when the promise is returned the actions in the function are performed.
    .then(result => {
        //log this message to the console upon successful processing of the request
        console.log('Todo Deleted')
        //send this response to the client, the client side javaScript is waiting for the response, it will refresh the page, client-side when it receives a response and the change will be visible in the browser
        response.json('Todo Deleted')
    })
    //if anything goes wrong, and the promise is not returned, log the error to the console
    .catch(error => console.error(error))
})

// Starts the server and binds it to the specified PORT to listen for incoming requests
app.listen(process.env.PORT || PORT, ()=>{
    // Logs a message to the console once the server starts successfully
    console.log(`Server running on port ${PORT}`)
})