//Importing express as a node module into the server.js file.
const express = require('express')
//Instantiating an express app object instance.
const app = express()
//Importing mongodb into the project, specifically the MongoClient class.
const MongoClient = require('mongodb').MongoClient
//Setting up the base port for our server. Will connect to the environment port or this if that doesn't exist.
const PORT = 2121
//importing dotenv and configuring it to be able to use environment variables in the project.
require('dotenv').config()

//declaring db, declaring and assigning dbConnectionStr to the private connection string we are storing on our env file, and declaring and assigning to dbName the name of our main MongoDB collection.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Connecting to MongoDB using the connection string we got from our environment file. The object is the optional options object in which we can configure specific options to use in the connection. When we set useUnifiedTopology to true, we are saying to use MongoDB driver's new connection management engine. Allows for better performance and compatibility with newer MongoDB versions.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//since the connection returns a promise which passes in the a client object, representing the connection to the database which comes with methods such as db, which we assign the db call passing in our dbname, todo, to the db variable. This will connect us specifically to the todo database.
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Set() allows us to assign a name to a value, any name value pair we want. Certain names, such as view engine, can be used to configure specific behaviors. In this case we are setting our view engine to ejs, embedded javascript, the templating engine we will use to serve dynamic html files in this project.
app.set('view engine', 'ejs')
//All these use() calls are mounting middleware functions before our routes.
//static middleware comes with express itself and will handle any requests made for resources within the public directory. It will automagically serve any files within this directory when asked, without having us, the developer, to specify a specific route for it.
app.use(express.static('public'))

//Both of these middleware functions handle the request object being sent and are part of the body-parser middleware built into express now.

//urlencoded will parse the url-encoded data existing as key value pairs in the request body, replacing the request body with an object where the key-value pairs exist as properties.
app.use(express.urlencoded({ extended: true }))
//json middleware intercepts the request body and parses it as json input replacing the request body with a JavaScript object. So once the request makes it to our routes, we can work with the body as a JavaScript object.
app.use(express.json())

//Defining a route for a get request made to the root directory, specifies an arrow function, specifically an async one that allows us to write asynchronous code that looks synchronous
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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