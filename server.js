
const express = require('express') //loads express framework/library
const app = express() // creates express application
const MongoClient = require('mongodb').MongoClient //imports connection Mongo DB database
const PORT = 2121 //hard codes port to localserver:2121
require('dotenv').config() //imports the .env file, which protects senstitive information


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' //sets up connection to db database, the connection string from .env, assigns name of variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects database string to MondoDB database; opts in to new connection management engine
    .then(client => { // executes if connected
        console.log(`Connected to ${dbName} Database`) // logs a message upon successful connection
        db = client.db(dbName) // takes object and assigns it to the variable db
    })
    
app.set('view engine', 'ejs') // can render HTML use embedded javascript
app.use(express.static('public')) //express will look for static files in the public directory
app.use(express.urlencoded({ extended: true })) // parses info from http requests, usually form data
app.use(express.json()) // tells express to use json


app.get('/',async (request, response)=>{ //tells server to listen to get request and respond with ... 
    const todoItems = await db.collection('todos').find().toArray() // find something in todos and change into an array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //hardcoding the items that haven't been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the items and the items left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //server listens for post request and responds with ... 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one item into todo list
    .then(result => {
        console.log('Todo Added') //adds todo
        response.redirect('/') //refreshes page
    })
    .catch(error => console.error(error)) //catches errors
})

app.put('/markComplete', (request, response) => { //listens for put request on /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // request item
        $set: {
            completed: true // check if completed
          }
    },{
        sort: {_id: -1}, //sort in descending order by ID
        upsert: false // create one if it doesn't exist, hardcoding to keep from adding random things
    })
    .then(result => {
        console.log('Marked Complete') // console.log marked complete
        response.json('Marked Complete') // server response marked complete
    })
    .catch(error => console.error(error)) // catch error

})

app.put('/markUnComplete', (request, response) => { //listens for put request on /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //request item
        $set: {
            completed: false //check if not completed
          }
    },{
        sort: {_id: -1}, //sort in descending order bt ID
        upsert: false // create one if it doesn't exist, hardcoding to keep from adding random things
    })
    .then(result => {
        console.log('Marked Complete') //console.log when action is complete
        response.json('Marked Complete') // server response marked complete
    })
    .catch(error => console.error(error)) //catch error

})

app.delete('/deleteItem', (request, response) => { //check for delete request on /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete document from todos database
    .then(result => { 
        console.log('Todo Deleted') // console.log if completed
        response.json('Todo Deleted') // send json response
    })
    .catch(error => console.error(error)) // catch error

})

app.listen(process.env.PORT || PORT, ()=>{ //use either the database's port OR the hardcoded PORT
    console.log(`Server running on port ${PORT}`) //console.log the port variable
})