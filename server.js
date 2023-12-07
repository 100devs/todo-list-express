const express = require('express') // makes express accessible to our application
const app = express() // simplifies express and makes it accessible through a variable
const MongoClient = require('mongodb').MongoClient // makes mongoDB accessible to our application
const PORT = 2121 // contains our PORT for native machine testing
require('dotenv').config() // makes dotenv file accessible


let db, // creates variable of database
    dbConnectionStr = process.env.DB_STRING, // creates variable for database access
    dbName = 'todo' // creates variable for database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to MongoDB
    .then(client => { // client = mongo response
        console.log(`Connected to ${dbName} Database`) // console log if we successfully connected
        db = client.db(dbName) // our database will be the same as whatever our specified database name is
    })
    
app.set('view engine', 'ejs') // for our ejs file which takes in information from our database and returns HTML file
app.use(express.static('public')) // makes our public folder available to draw files from such as our CSS and JS
app.use(express.urlencoded({ extended: true })) // filters incoming URL requests
app.use(express.json()) // makes our JSON available


app.get('/',async (request, response)=>{ // our series of instructions when the client points to '/'
    const todoItems = await db.collection('todos').find().toArray() // todoItems variable will wait until server has navigated to our todo collection, find the list and push it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // returns an accurate count of the document
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders our collection to ejs which will then be returned as HTML
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // our series of instructions when the client points to '/addTodo', adding entries to db
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts our new entry into the database with the following parameters
    .then(result => { // what occurs if successful
        console.log('Todo Added') // console log successful add
        response.redirect('/') // redirects application to the root
    })
    .catch(error => console.error(error)) // if error
})

app.put('/markComplete', (request, response) => { // our series of instructions when the client points to '/markComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update rquest if our task is completed, in which case the boolean switches from false to true
        $set: {
            completed: true // sets boolean to true if task is completed
          }
    },{
        sort: {_id: -1},
        upsert: false // upsert == mongoDB syntax for update + insert, adjusts to false if not completed
    })
    .then(result => {
        console.log('Marked Complete') // console log if task is marked as complete
        response.json('Marked Complete') // responds with JSON if task is marked as complete
    })
    .catch(error => console.error(error)) // if error

})

app.put('/markUnComplete', (request, response) => { // our series of instructions when the client points to '/markUnComplete', if we unmark a task 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // an update request
        $set: {
            completed: false // set to false, uncompleted
          }
    },{
        sort: {_id: -1},
        upsert: false // mongoDB syntax for update + insert
    })
    .then(result => {
        console.log('Marked Complete') // console log if task is marked as complete
        response.json('Marked Complete') // responds with JSON if task is marked as complete
    })
    .catch(error => console.error(error)) // if error

})

app.delete('/deleteItem', (request, response) => { // our series of instructions when the client points to '/deleteItem', if we delete a task 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // request to delete pointing at specific task
    .then(result => { // if successful
        console.log('Todo Deleted') // console log completion
        response.json('Todo Deleted') // json response completion
    })
    .catch(error => console.error(error)) // if error

})

app.listen(process.env.PORT || PORT, ()=>{ // listens to whatever port our hosting server points to
    console.log(`Server running on port ${PORT}`) // console log if successful connection
})