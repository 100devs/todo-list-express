//load the express module - making node easier to work with-  and store it in the variable "express"
const express = require('express')
//use app to store the value of the express function for more readable and simple code later
const app = express()
//load the mongodb module's client class and store it in MongoClient to be able to access your database
const MongoClient = require('mongodb').MongoClient
//make a variable for the port you want to use so if you want to change it, you only have to change it here in the variable
const PORT = 2121
//load the dotenv module to be able to use the environment variable folder and the config function loads the appropriate stored variables from your env file wherever provess.env is located
require('dotenv').config()

//create a variable db to use later to define your database
let db,
    //store your connection string from your private env file into dbConnectionStr to use later
    dbConnectionStr = process.env.DB_STRING,
    //store what we want to name as our database in dbName
    dbName = 'todo'

//From our modules, we use the method to connect to our database, passing in the required dbConnectionStr that is storing our private unique db route and sends that we want to use the connection management system "unified topology"
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //once we get a connection from our mongoDatabase, we use the client that was returned to pass into the proper formatting for our db variable
    .then(client => {
        //console log when we have connected to the database
        console.log(`Connected to ${dbName} Database`)
        //we store the specific database name on the returned client that is now connected to our short variable "db"
        db = client.db(dbName)
    })

//*middleware*using express (stored in app), we tell node to use ejs as the template system for our html    
app.set('view engine', 'ejs')
//*middleware*use express to handle serving all our static files we will store in the public folder
app.use(express.static('public'))
//*middleware* that will help handle strings or arrays that come in as part of requests
app.use(express.urlencoded({ extended: true }))
//*middleware* that will help handle json that comes in as part of requests
app.use(express.json())

//using express, handle get requests that come to route '/' using async
app.get('/',async (request, response)=>{
    // store promise of the db collection called todos and since we are not passing anything into the find function, it will return all of the documents in the collection. Finally, we want all of these documents put in an array
    const todoItems = await db.collection('todos').find().toArray()
    // store the count of documents in the todos collection from our database with the completed property as false in the variable "itemsLeft"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // once the response from the db is sent, render an html file using our index.ejs template, and pass the todoItems as the name items and items left as the name left
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

//using express, handle a post request that comes through route "/addTodo"
app.post('/addTodo', (request, response) => {
    //go to our db, in the collection called todos and add a document using insertOne. The property of "thing" will be what the request body has set as the todoItem, and the "completed" property will be set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //this function will be called with the response from the db being passed in
    .then(result => {
        //console log that the todo has been added
        console.log('Todo Added')
        //when all of our actions are done, we send the response back but tell the browser to redirect to '/' or in other words, refresh because we made changes
        response.redirect('/')
    })
    //if we get an error from our request to the db, handle and show the error in the console
    .catch(error => console.error(error))
})

//using express, handle a put request that comes through route '/markComplete'
app.put('/markComplete', (request, response) => {
    //go to our db, in the collection called todos and update the document using updateOne. The document we want to update has property of "thing" whose value the request body has set as the itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //$set is mongodb's update operator
        $set: {
        //for our selected document, we are going to update the property of completed to true
            completed: true
          }
    },{
        //sorts our documents in descending order of id
        sort: {_id: -1},
        // this tells the database not to add a document if there was no document matching our request
        upsert: false
    })
    //once the database sends the response, call the then function passing in the response
    .then(result => {
        //console log Marked Complete
        console.log('Marked Complete')
        //give the response as json of Marked Complete
        response.json('Marked Complete')
    })
    //if there was any error with the db request, console log the error
    .catch(error => console.error(error))

})

//using express, handle a put request that comes through route '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    //go to our db, in the collection called todos and update the document using updateOne. The document we want to update has property of "thing" whose value the request body has set as the itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //$set is mongodb's update operator
        $set: {
            //for our selected document, we are going to update the property of completed to false
            completed: false
          }
    },{
        //sorts our documents in descending order of id
        sort: {_id: -1},
        // this tells the database not to add a document if there was no document matching our request
        upsert: false
    })
    //once the database sends the response, call the then function passing in the response
    .then(result => {
        //console log Marked UnComplete
        console.log('Marked UnComplete')
        //give the response as json of Marked UnComplete
        response.json('Marked UnComplete')
    })
    //if there was any error with the db request, console log the error
    .catch(error => console.error(error))

})

//using express, handle a delete request that comes through route '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    //go to our db, in the collection called todos and delete the document using deleteOne. The document we want to delete has property of "thing" whose value the request body has set as the itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //once the database sends the response if it was deleted, call the then function passing in the response
    .then(result => {
        //console log Todo Deleted
        console.log('Todo Deleted')
        //give the response as json of Todo Deleted
        response.json('Todo Deleted')
    })
    //if there was any error with the db request, console log the error
    .catch(error => console.error(error))

})

//using express, have our server listen on the required port. Either the port given from the hosting platform or what is stored in the PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    //when app is listening, console log that the server is running on the specified port
    console.log(`Server running on port ${PORT}`)
})