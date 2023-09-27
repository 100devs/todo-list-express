/*
mporting Required Modules:

    const express = require('express'): This line imports the Express.js framework, which is used to create web applications in Node.js.

    const app = express(): It creates an instance of the Express application.

    const MongoClient = require('mongodb').MongoClient: This line imports the MongoDB client, which is used to connect to and interact with MongoDB databases.

    const PORT = 2121: This sets the port number for the Express application to listen on.

    require('dotenv').config(): This line loads environment variables from a .env file, if available. Environment variables are often used to store sensitive or configuration-related information.

*/
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    /*
            Variable Declarations:

        let db: This variable will be used to store a reference to the MongoDB database once the connection is established.

        dbConnectionStr = process.env.DB_STRING: This line retrieves the MongoDB connection string from the environment variables. The connection string typically contains information like the database server's address, port, and authentication credentials. This string is usually stored in the .env file.

        dbName = 'todo': This variable stores the name of the MongoDB database you want to connect to, which in this case is 'todo'.

    Connecting to the Database:

        MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }): This line initiates a connection to the MongoDB server using the MongoClient from the MongoDB Node.js driver. It takes two arguments:
            dbConnectionStr: The MongoDB connection string, which specifies how and where to connect to the database.
            { useUnifiedTopology: true }: This option is used to enable a more modern and unified topology engine for MongoDB.

        .then(client => { ... }): This is a promise-based approach for handling the result of the connection attempt. When the connection is successfully established, the code inside the callback function is executed. In this case:

            console.log(Connected to ${dbName} Database): This line simply logs a message indicating that the connection to the specified database was successful.

            db = client.db(dbName): This line sets the db variable to the MongoDB database object, which allows you to interact with the 'todo' database in subsequent parts of your code.

After this code snippet executes successfully, you'll have an active connection to the 'todo' database, and you can perform operations like inserting, updating, and querying data from that database using the db variable.
    */




app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())







app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
     .then(data => {
         db.collection('todos').countDocuments({completed: false})
         .then(itemsLeft => {
             response.render('index.ejs', { items: data, left: itemsLeft })
         })
     })
     .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})