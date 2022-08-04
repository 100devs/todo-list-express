const express = require('express') // 
const app = express() // allows us to use app instead of typing express every time we want to call express
const MongoClient = require('mongodb').MongoClient
const PORT = 2121 // declaring port
require('dotenv').config() // allows us to use .env file (have not created yet)


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // supports older mongo version
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // show successful connection to database
        db = client.db(dbName) // storing database information in a variable
    })

app.set('view engine', 'ejs') // render ejs for the client side
app.use(express.static('public')) // serve all files in public folder
app.use(express.urlencoded({ extended: true })) // middleware for parsing bodies from URL
app.use(express.json()) // It parses incoming JSON requests and puts the parsed data in req


app.get('/', async (request, response) => { // get root/default route
    const todoItems = await db.collection('todos').find().toArray() // pulling todo items from database and putting it into an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // counts documents where completed is set to false.
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

app.post('/addTodo', (request, response) => { // create a todo
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // adds one todo item to the database and sets 'completed' property to false by default
        .then(result => { // 
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // Finds the item that the user clicked
        $set: { // sets completed property value to true
            completed: true
        }
    }, {
        sort: { _id: -1 }, // sorts items
        upsert: false // if true and doc does not exist, create one and insert into database
    })
        .then(result => { // if update is successful
            console.log('Marked Complete') // logs marked complete
            response.json('Marked Complete') // send string response back
        })
        .catch(error => console.error(error)) // logs error

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => { // if update is successful
            console.log('Marked Uncomplete') // logs marked complete
            response.json('Marked Uncomplete') // send string response back
        })
        .catch(error => console.error(error)) // logs error

})

app.delete('/deleteItem', (request, response) => { // delete request
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // locates document with name itemFromJS
        .then(result => { // if successful
            console.log('Todo Deleted') // log deleted
            response.json('Todo Deleted') // sends back string response of 'deleted'
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => { // listens for port
    console.log(`Server running on port ${PORT}`) // logs that the server is running on specified PORT
})