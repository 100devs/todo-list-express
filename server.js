//import express
const express = require('express')
//use express as a function
const app = express()
//import mongoDB
const MongoClient = require('mongodb').MongoClient
//set a port number
const PORT = 2121
//import a .env file
require('dotenv').config()

//our entire database => collections => documents
let db,
    //get database connection string
    dbConnectionStr = process.env.DB_STRING,
    //set database

    //name for the database
    dbName = 'todo'

//connect to mongo, using connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//use then as a promise
    .then(client => {
        //confirm connection was made
        console.log(`Connected to ${dbName} Database`)
        //setting db variable to entire database
        db = client.db(dbName)
    })

//app.set = setting a setting
//this needs to be done before any app.use
//hey, we're using ejs please
app.set('view engine', 'ejs')

//hey, everything in the 'public' folder is up for grabs if a user pings you
app.use(express.static('public'))

//a newer way of using bodyparser
app.use(express.urlencoded({ extended: true }))

//also a part of body parser for using json
app.use(express.json())

//this happens when a user goes to the webpage
//homepage = '/' 
app.get('/',async (request, response)=>{
    //request = what comes in (req)
    //response = what goes out (res)

    //find everything in todos collection and put it in an array
    const todoItems = await db.collection('todos').find().toArray()
    //count the number of documents (objects) inside of the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //show ejs

    //show the user an ejs file
    //give the ejs file to objects
    //items - all of our objects in the database
    //left - number of items in the database
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //this is same as above but using promise chaining syntax 
    //             do something
    //                  .then(do something else)
    //                  .catch(some kind of error)

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// creating something new in the database
app.post('/addTodo', (request, response) => {
    // go into the todos database and insert a new object
    //object = {thing: todoitem}
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    .then(result => {
        // confirm something was added with a console.log
        console.log('Todo Added')
        // tell the user to go to home directory
        response.redirect('/')
    })
    // print error if something goes wrong
    .catch(error => console.error(error))
})

// Update something in the database
app.put('/markComplete', (request, response) => {
    // find something with a matching name in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // mark it complete by setting completed to true
        $set: {
            completed: true
          }
    },{
        // sort it in descending order
        sort: {_id: -1},
        // don't create a new one if it doesn't exist
        upsert: false
    })
    .then(result => {
        // confirm marked complete
        console.log('Marked Complete')
        // tell the user that it was marked complete
        response.json('Marked Complete')
    })
    // if an error occurs, tell the server about it
    .catch(error => console.error(error))

})

// Update something
app.put('/markUnComplete', (request, response) => {
    // find something with a matching name in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // completed is now false
            completed: false
          }
    },{
        // sort in descending order again
        sort: {_id: -1},
        // don't create anything new
        upsert: false
    })
    // afterwards...
    .then(result => {
        // confirm that it was marked uncomplete
        console.log('Marked Uncomplete')
        //Send json to the user telling them the same thing
        response.json('Marked Uncomplete')
    })
    // tell me if something exploded during this
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside the to do's collection for the ONE item that has a matching name from our JS file
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the server
    }) // closing then
    .catch(error => console.error(error)) // blah blah error

}) // ending delete

app.listen(process.env.PORT || PORT, ()=>{ // actually start the server
    console.log(`Server running on port ${PORT}`) // confirm the port is running
}) // end the listen