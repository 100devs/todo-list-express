const express = require('express') //Makes it possible to use express in this file
const app = express() //Create an instance of express by calling it and storing in the constant app for ease of use later w/ the methods
const MongoClient = require('mongodb').MongoClient //Makes it possible to use methods associated with MongoClient & talk to our DB mongodb
const PORT = 2121 //Setting a constant that stores the PORT where our server will be listening
require('dotenv').config() //Allows us to look for variables inside of the .env file


let db, //declare a value called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable that is assigned to our database connection string which is in the .env file
    dbName = 'todo' //declaring a variable and setting the name of our db to todo (mongodb) > cluster > databases > collections > documents

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to Mongodb, and passing in our connection  string. Also passing in an additional property
    .then(client => { //Waiting for our connection to the db and if its successful, passing in our client info
        console.log(`Connected to ${dbName} Database`) //Logging to the console the name of the db if successful
        db = client.db(dbName) //Assigning a value to the previously declared db variable that contains a db client factory method
    }) //Closing .then

//middleware
app.set('view engine', 'ejs') //sets ejs as the default rendering method
app.use(express.static('public')) //where to look for static files like css which are in the public folder
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) //Helps to parse the json from incoming requests (replaces bodyparser)

//Grab data and send it to render in index.js
app.get('/',async (request, response)=>{ //starts a GET method when the root '/' route is passed in, sets up req, res params
    const todoItems = await db.collection('todos').find().toArray() //set a constant that gets all the items in the todos collection & puts them in array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a constant and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Rendering the EJS file and passing thru the db items and the count remaining, inside of an object
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