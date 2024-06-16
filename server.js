const express = require('express') //making it possible to use express framework in this file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server listen
require('dotenv').config()  //used to load environment variables from a .env file into process.env


let db, //declare a variable called db but not assigning any value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigns our db connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string , also passing in additional properties
    .then(client => { //waiting for the connection and proceeding if successful, and passing all the client information    
        console.log(`Connected to ${dbName} Database`) // logging the "Connected to todo Database" if connection is successful
        db = client.db(dbName) //assigning a value to previously declared db variable that contains db client factory method
    }) //closing our .then

//middleware
app.set('view engine', 'ejs') //setting ejs as default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON content


app.get('/', async (request, response) => { //starts a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable, awaits ALL items from the todos collection which is also converted into an Array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing the db items and the remaining count inside of an object
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
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

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
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})