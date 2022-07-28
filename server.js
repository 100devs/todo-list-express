/*
    Importing dependencies:
        - express: express JS
        - app: create an express app
        - MongoClient: default MongoDB package in Node
        - Port: defining the port as 2121 when running
        - dotenv: configuring the use of a local .env file for constants and hidden values
            - stores the port number
            - stores the Mongo DB connection string
*/
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

/*
db is creating the database
db ConnectionStr is the actual string that connects to the MongoDB database
db Name is the actual name of the database connection
*/
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
/*
.connect is a function that connects to the database
useUnifiedTopology determines type of deployment, useUnifiedTopology states we're using all types of depolyment

*/
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
/*
    -app.set selects which view engine to use and in this case ejs
    -app.use(express.static('public')) allows all static public files to be rendered without individual routes to them
    -app.use(express.urlencoded({ extended: true })) allows us to use the encoded url and parse it and stringify it. It is used with body parser
    -app.use(express.json()) allows us to parse JSON to the server from the forms in the application
*/
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/*
    Listens for requests for the '/' route
    Uses asyncrounous function, passing in the request from the client, and sets up a variable for the response back
    todoItems is awaiting data back from the database specified, looking for the 'todos' collection, and retreiving all records (find()), and storing them as an array
    itemsLeft is awaiting data back from the 'todos' collection as well, and stores number of records found and filters for the value for 'completed' as false
    finally, we send back the index.ejs file, passing that file in the data of items = all todo items, and left = the todo items that are not complete
*/
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
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
/*
When the user makes a form request and sends it to the server, the server responds with a post method
Once the form request is sent, the data is sent to the database by adding one object with the key value set manually from the server side and the value set from the name attribute value from the input
After sending that data, we redirect to a specific page, in this example we redirect to the "index page"
In case the connection fails or the form does not submit correctly, send an error to the server indicating something went wrong
*/
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})
/*
    -To update a todo list as complete, the todo item is selected in the db and updateOne is used to update that item. 
    -The $set method is used to update the completed key as true
    -Next the sort is used to place the completed to do item below the still pending todo items. Upsert adds that content if it doesnt exist in db already.
    -When completed the .then() logs and sends Marked Complete to the console and the user
    -.catch() In case the connection fails or the form does not submit correctly, send an error to the server indicating something went wrong
*/
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})
/*
    -To update a todo list as incomplete, the todo item is selected in the db and updateOne is used to update that item. 
    -The $set method is used to update the completed key as false
    -Next the sort is used to place the completed to do item below the still pending todo items. Upsert adds that content if it doesnt exist in db already.
    -When completed the .then() logs and sends Marked incomplete to the console and the user
    -.catch() In case the connection fails or the form does not submit correctly, send an error to the server indicating something went wrong
*/
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked InComplete')
            response.json('Marked InComplete')
        })
        .catch(error => console.error(error))

})

/*
You can choose to remove items from the database. If there is any errors in deleted, it will catch the error in deleting the item.
*/

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

/* 
    starts the express app server on the port defined in the .env file, or if not found, the port specified in the PORT variable.
    logs to the server console the port number
*/
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})