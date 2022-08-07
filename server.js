//load node modules
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,                 //initialize database variables
    dbConnectionStr = process.env.DB_STRING, //get database string from the .env file
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to the database using the database string
    .then(client => { //run after database connection response. Client contains the response data
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName) //use the db method on the client object while passing in the dbname variable as the argument and store the returned data in the db variable.
    })
    
app.set('view engine', 'ejs') //lets express know that we are using ejs templating language
app.use(express.static('public')) //serves up all files in the public folders when needed
app.use(express.urlencoded({ extended: true })) //use urlencoder to get information from body of the request
app.use(express.json()) //use express.json to send data as json


app.get('/',async (request, response)=>{ //listen for a get request at '/' and handle it with an async callback function
    const todoItems = await db.collection('todos').find().toArray() //get the collection from the todos database, put it in an array and store it in th todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // return th number of document in th DB that have a completed value of false and store it in the itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //send todoItems and itemsLeft to index.ejs with the names items and left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // listen for a post request at '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // get the value of todoItem from the request body and insert it into the DB with a key of thing. Add a key of completed with a value of false
    .then(result => { //Run after succesfully inserting a new item in the database
        console.log('Todo Added') 
        response.redirect('/') //refresh the page
    })
    .catch(error => console.error(error)) //runs if there was an error inserting a new item
})

app.put('/markComplete', (request, response) => { //listen for a put request at '/markComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update a document in the database with the key thing and value from the request body
        $set: {
            completed: true //set the value for complete to true
          }
    },{
        sort: {_id: -1}, //sorts in descending order
        upsert: false //prevents insertion if item doesnt exist
    })
    .then(result => { //runs if update is successful
        console.log('Marked Complete') 
        response.json('Marked Complete')//send response
    })
    .catch(error => console.error(error)) //runs if there is an error updating

})

app.put('/markUnComplete', (request, response) => { //listen for put request at '/markUncomplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update a document in the database with the key of thing and value from the request body
        $set: {
            completed: false //set the value for complete to false
          }
    },{
        sort: {_id: -1},
        upsert: false //prevents insertion if item doesn't exist
    })
    .then(result => { //runs if update is successful
        console.log('Marked Complete')
        response.json('Marked Complete') //send response
    })
    .catch(error => console.error(error)) //runs if there is an error updating

})

app.delete('/deleteItem', (request, response) => { //listens for a delete request at '/deleteItem'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete document from the database with a key of thing and value that is in the request body
    .then(result => { //run if deletion is successful
        console.log('Todo Deleted')
        response.json('Todo Deleted') //send response
    })
    .catch(error => console.error(error)) //run if there is an error deleting

})

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port to listen on. 
    console.log(`Server running on port ${PORT}`) 
})