//assigns a variable for the express packages that are installed allowing access to express
const express = require('express')
//Assigns a variable to express so that it is easier to use in the code when needed
const app = express()
//assigns a variable for the express packages that are installed allowing access to MongDB
const MongoClient = require('mongodb').MongoClient
//Assigns PORT as a variable so that you don't have to remember the specified number
const PORT = 2121
//requiring the dotenv.config used to store things in MongDB? to create environment variables by granting access to the .env file
//require the .env module to create environment variables
require('dotenv').config()

//Specifies the MongoDB database that will be used
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Links the node server to the MongoDB database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //** look into useUnifiedTopology required or not
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 //Used to set and configure the behavior of the server   
app.set('view engine', 'ejs')
//Setting up access to the public folder for css and client side JS
app.use(express.static('public'))
//setting up The express.urlencoded() function which is a built-in middleware function in Express. 
//It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }))
//setting up access to allow the app to convert the object into json
app.use(express.json())

//chaining using async await
// GET Method
// setting up get request in the root folder,
// with async function. declaring a todoItems variable and passing it to the array.
// declaring a variable for the uncompleted tasks
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

//Promise Chaining (.then .catch .finally)
//Post method 
// creating a new request to add new documents to the DB and assigning false status(incomplete task)
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //Notifies you that the item has been added and the redirects back to the homepage
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //handling error
    .catch(error => console.error(error))
})

//Put method
// updating the document's completed value to true
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //add's updated documents to the top of the list
        sort: {_id: -1},
        //**won't create new entry if required information is missing
        upsert: false
    })
    //notifies you that it has been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //handling error
    .catch(error => console.error(error))

})

// PUT Method
// updates the document's completed value to false
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
        console.log('Marked Complete') //should say "Marked Uncomplete"
        response.json('Marked Complete') //should say "Marked Uncomplete"
    })
    .catch(error => console.error(error))

})

// DELETE Method
// removes the documents from the DB,console logs and responds with json
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Starts Server
// if the server is running, it sets up a listen method for Heroku (process.env) or the local port from the PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})