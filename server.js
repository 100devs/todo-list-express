const express = require('express') //create express application
const app = express() //assign express app to 'app'
const MongoClient = require('mongodb').MongoClient //require mongodb 
const PORT = 2121 //set port to 2121
require('dotenv').config() //grab info from .env file


let db, //declare db variable
    dbConnectionStr = process.env.DB_STRING, //assign variable that includes the DB_STRING info from .env file
    dbName = 'todo' //name the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create a connection to the database, passes in authentication info
    .then(client => { //waits for connection
        console.log(`Connected to ${dbName} Database`) //when connection is successful, prints to console that it is connected
        db = client.db(dbName) //db variable assigned to db client
    })

app.set('view engine', 'ejs') //sets ejs as default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URL where the header matches the content
app.use(express.json()) //parses JSON content


app.get('/', async(request, response) => { //when root path is called starts a GET method
    const todoItems = await db.collection('todos').find().toArray() //assigns mongo collections from todo database to a constant
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //assigns mongo collections from todo database and counts ones that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the above  info with the view engine
        // db.collection('todos').find().toArray()
        // .then(data => {
        //     db.collection('todos').countDocuments({completed: false})
        //     .then(itemsLeft => {
        //         response.render('index.ejs', { items: data, left: itemsLeft })
        //     })
        // })
        // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts POST method when /addTodo path is passed in
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //inserts the request body into the todo collections. Gives it a completed value of false
        .then(result => { //when insert is successfull
            console.log('Todo Added') //log Todo Added
            response.redirect('/') //redirect to root page
        })
        .catch(error => console.error(error)) //catch error
})

app.put('/markComplete', (request, response) => { //starts PUT method when /markComplete path is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //Updates the todos collection with request body. 
            $set: {
                completed: true //sets completed value to true
            }
        }, {
            sort: { _id: -1 }, //moves item to bottom of list
            upsert: false //prevents insertion if item does not already exist
        })
        .then(result => { //when result is successful
            console.log('Marked Complete') //console.log it as completed
            response.json('Marked Complete') //respond with json that it is completed
        })
        .catch(error => console.error(error)) //catch error

})

app.put('/markUnComplete', (request, response) => { //starts PUT method when /markComplete path is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //Updates the todos collection with request body.
            $set: {
                completed: false //sets completed value to false
            }
        }, {
            sort: { _id: -1 }, //moves item to bottom of list
            upsert: false //prevents insertion if item does not already exist
        })
        .then(result => { //when result is successful
            console.log('Marked Complete') //console.log it as completed. Is a type it should be "Unmarked complete"
            response.json('Marked Complete') //respond with json that it is completed. Is a type it should be "Unmarked complete"
        })
        .catch(error => console.error(error)) //catch error

})

app.delete('/deleteItem', (request, response) => { //starts DELETE method when /deleteItem path is passed in
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //delete mongo collection that matches request body
        .then(result => { //when result is successful
            console.log('Todo Deleted') //logs that it is deleted
            response.json('Todo Deleted') //responds with json that it is deleted
        })
        .catch(error => console.error(error)) //catch errors

})

app.listen(process.env.PORT || PORT, () => { //sets app to listen to PORT from .env file or from const set at top of this file '2121'
    console.log(`Server running on port ${PORT}`) //logs that it is listening on PORT
})