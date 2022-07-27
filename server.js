const express = require('express') //loads express module
const app = express() // Variable to make using express cleaner
const MongoClient = require('mongodb').MongoClient //Loads Mongo Module
const PORT = 2121  //Assign port value
require('dotenv').config() //Loads dotenv module


let db, //variable for database
    dbConnectionStr = process.env.DB_STRING, // string with credentials used access Mongo Database  
    dbName = 'todo'; // database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  //connects to Mongo Database Client
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)  // Connects or creates 'todo' database
        // console.log(client, db);
    })

app.set('view engine', 'ejs') //Sets ejs as the rendering engine
app.use(express.static('public')) // Automatically sends files stored in public folder
app.use(express.urlencoded({ extended: true }))// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.json())//Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.


app.get('/', async (request, response) => { // Responds to client Fetch request for default url
    const todoItems = await db.collection('todos').find().toArray() //gets todo list from database and puts it in an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })//Obtains a count of items in the database with completed marked as false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the html using EJS file index.ejs and returns to client

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //console logs any errors
})


app.post('/addTodo', (request, response) => { // Responds to POST request from form
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // Adds item from from input
        .then(result => {
            console.log('Todo Added')
            response.redirect('/') //reloads page by redirecting to default URL
        })
        .catch(error => console.error(error)) // Catches and logs errors
})

app.put('/markComplete', (request, response) => { // Updates data
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 }, //sorts it by id decensding order
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')  //response sent to client
        })
        .catch(error => console.error(error)) // catch error

})

app.put('/markUnComplete', (request, response) => { //same as markComplete
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Incomplete')
            response.json('Marked Incomplete')
        })
        .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //responds to client side delete request
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })  // finds the database item that matches itemFromJS client request and deletes it
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted') //responds with json
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => {  // Listens for client requests on port, 
    console.log(`Server running on port ${PORT}`, process.env.PORT, process.env.PORT || PORT)
})
