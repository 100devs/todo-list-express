const express = require('express') //import express module
const app = express() // create instance of express
const MongoClient = require('mongodb').MongoClient //import mongodb module and get mongoClient object
const PORT = 2121 // port variable 
// import dotenv and run config method from it to 
//set up enviroment variables
require('dotenv').config() 

//create 3 let variables
let db, //variable to hold client connection object from mongo
    dbConnectionStr = process.env.DB_STRING, // connection string using enviroment variable
    dbName = 'todo' // name of database

//connect to mongo using connection string, along with option for useUnifiedTopology
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // after promise resolves

        //log the dbname 
        console.log(`Connected to ${dbName} Database`)

        //set db to mongo client db 
        db = client.db(dbName)
    })
 
//express set view engine option to ejs    
app.set('view engine', 'ejs')

//express middleware use public folder for static files
app.use(express.static('public'))

//express middleware to extract objects from body that have
//been url encoded and set into body object as properties
app.use(express.urlencoded({ extended: true }))

//parse incoming requests containing JSON payloads
app.use(express.json())


//get request for '/' root route
app.get('/',async (request, response)=>{

    //query db.collection named 'todos'. finding all with empty({}). return results as array
    //using async operation
    const todoItems = await db.collection('todos').find().toArray()

    //query db.collection and return number of documents with a field of 'completed:' set to 'false'
    //using async operation
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //send response to client by redering an embeded javascript file to html 
    //passing variable items: holding todoItems, left: holding itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    //promise chain version of above async function
    // db.collection('todos').find().toArray() // query database collection 'todos' return all in an array
    // .then(data => { // when promise fulfilled pass resolved data
    //     db.collection('todos').countDocuments({completed: false}) //
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//post request to /addTodo route
app.post('/addTodo', (request, response) => {

    //collection todos. insert one object {} into collection todos
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    
    //after fulfilled promise pass result
    .then(result => {

        //log todo added
        console.log('Todo Added')

        //response to client is to redirect to root route
        response.redirect('/')
    })

    //catch any error during promise chain and console error
    .catch(error => console.error(error))
})

// any put method at /markcomplete route
app.put('/markComplete', (request, response) => {

    //update one document in collection when value thing: equals that property in body of request
    //named itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { // set the field completed: to true
            completed: true
          }
    },{
        //sort 
        sort: {_id: -1}, //sort newest entries first
        upsert: false // do not create document if none found
    })
    .then(result => { // result of update promise passed down promise chain
        console.log('Marked Complete') // log to console
        response.json('Marked Complete')// respond to request with json format 
    })
    //any errors in promise chain are logged to console
    .catch(error => console.error(error))

})

//put request to markuncomplete route
app.put('/markUnComplete', (request, response) => {
    
    //update one item using containing a field thing:
    //with a value of itemFromJS from body of request 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { // set field in document
            completed: false //change field completed to false;
          }
    },{
        //sort newest first
        sort: {_id: -1},
        upsert: false // do not insert document if none found
    })

    //after update promise fulfills pass result down promise chain
    .then(result => {
        //log to console marked complete
        console.log('Marked Complete')
        response.json('Marked Complete')//respond to client with json format text
    })

    //any errors during promise chain are logged to console
    .catch(error => console.error(error))

})

//delete method on deletitem route
app.delete('/deleteItem', (request, response) => {
    //delete one object in collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//express service listening on enviroment variable port or defined in file
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) //log to console port that server is listening on
})