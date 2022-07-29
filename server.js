const express = require('express') // making it possible to use express 
const app = express() // setting a constant and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with mongoclient to talk to our db 
const PORT = 2121 // creating a constant and storing our port number/location where our server listens 
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, // storing our DB mongoDB connection string inside variable dbConnectionStr
    dbName = 'todo' // storing the database name that I want to access inside of variable dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to mongodv and passing in our connection string. Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, .then indicate this is a promise. We're passing in all the client info. 
        console.log(`Connected to ${dbName} Database`) // consolelog that we're connected to 'todo' database
        db = client.db(dbName) // passing in the db name from mongo db and assigning that to the db variable
    }) // closing our .then

// Middleware:   
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // says any of the static assets and files will be put in the public folder
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content, extended part supports arrays and objcts
app.use(express.json()) // parses json content


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