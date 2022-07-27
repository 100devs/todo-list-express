const express = require('express') // enables use of express
const app = express() // declaring variable app as express
const MongoClient = require('mongodb').MongoClient // enables use of mongodb
const PORT = 2121 // port number
require('dotenv').config() // enables use of dotenv file to store sensitive data


let db,
    dbConnectionStr = process.env.DB_STRING, // string to connect to mongodb
    dbName = 'todo' // name of database to connect to (todo)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to mongodb 
    .then(client => { // if connection is successful
        console.log(`Connected to ${dbName} Database`) // logs connection to database 
        db = client.db(dbName) // sets db to database name (todo)
    })
    
app.set('view engine', 'ejs') // sets view engine to ejs
app.use(express.static('public')) // sets public folder as static folder for express
app.use(express.urlencoded({ extended: true })) // enables use of urlencoded data in express requests (extended: true) (allows for nested objects) 
app.use(express.json()) // enables use of json data in express requests


app.get('/',async (request, response)=>{ // gets request from root route (/) and responds with ejs file 
    const todoItems = await db.collection('todos').find().toArray() // finds all todo items in database and converts to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // finds all todo items in database that are not completed and counts them. Sets itemsLeft to count of todo items that are not completed. 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders index.ejs file and passes in todo items and number of items left to be completed.
    // db.collection('todos').find().toArray() // If not for line above, would not be able to use async/await
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) // if error, console.error will log error
})

app.post('/addTodo', (request, response) => { // gets request from addTodo route and responds with ejs file
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts todo item into database with completed set to false (false = not completed)
    .then(result => { // if successful
        console.log('Todo Added') // logs todo added
        response.redirect('/')  // redirects to root route (refreshes page) (new todo item added)
    })
    .catch(error => console.error(error)) // if error, console.error will log error
})

app.put('/markComplete', (request, response) => { // gets request from markComplete route and responds with ejs file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates todo item in database with completed set to true (true = completed)
        $set: { 
            completed: true // sets completed to true
          }
    },{
        sort: {_id: -1}, // sorts by id in descending order (most recent todo item first)
        upsert: false // if no todo item found, do not insert  (false = do not insert)
    })
    .then(result => {
        console.log('Marked Complete') // logs marked complete (todo item marked completed)
        response.json('Marked Complete') // responds with json message (marked complete)
    })
    .catch(error => console.error(error)) // if error, console.error will log error

})

app.put('/markUnComplete', (request, response) => { // gets request from markUnComplete route and responds with ejs file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates todo item in database with completed set to false (false = not completed)
        $set: {
            completed: false // sets completed to false (not completed)
          }
    },{
        sort: {_id: -1}, // sorts by id in descending order (most recent todo item first)
        upsert: false // if no todo item found, do not insert  (false = do not insert)
    })
    .then(result => {
        console.log('Marked Complete') // logs marked complete (todo item marked completed)
        response.json('Marked Complete') // responds with json message (marked complete)
    })
    .catch(error => console.error(error)) // if error, console.error will log error

})

app.delete('/deleteItem', (request, response) => { // gets request from deleteItem route and responds with ejs file (deletes todo item)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes todo item from database (todo item deleted)
    .then(result => { 
        console.log('Todo Deleted') // logs todo deleted (todo item deleted)
        response.json('Todo Deleted')   // responds with json message (todo item deleted)
    })
    .catch(error => console.error(error)) 

})

app.listen(process.env.PORT || PORT, ()=>{ // listens on port number (process.env.PORT || PORT)
    console.log(`Server running on port ${PORT}`) // logs server running on port number
})