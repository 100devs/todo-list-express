const express = require('express') // require (include) the express module in this application and assign its value to a variable named 'express'

const app = express() // assign the result of calling the express function to a variable called 'app'

const MongoClient = require('mongodb').MongoClient // require (include) the mongodb module (which will allow us to connect to a database). From the mongodb module, retrieve the MongoClient class and assign it to a variable named 'MongoClient'

const PORT = 2121 //set the port that our server will run on to 2121

require('dotenv').config() //Require (include) the dotenv module, then run the config command, which will pull in values from a .env file (a file where api keys, encryption keys, and other 'secret values' should be kept)


let db, // Create a variable named 'db'

  dbConnectionStr = process.env.DB_STRING, // Assign the value of DB_STRING (an environment variable in the .env file) to a variable named 'dbConnectionStr'. This string is what will be used to connect to the database

  dbName = 'todo' // create a variable named 'dbName' (short for database name) and assign to it the string 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to the database. Call the connect method of the MongoClient and pass in dbConnectionsStr as an argument and { useUnifiedTopology: true } as an option. Setting useUnifiedTopology to true tells the database that we want to use MongoDB's new 'Server Discover and Monitoring engine.' Essentially it just allows our server to be handled in accordance with the current MongoDB structure.

  .then(client => { // The MongoDB connect method returns a promise, so once connected to the database, return a reference to said database (a 'client' object containing the database object) and store all of the returned information inside of a variable called 'client'.

    console.log(`Connected to ${dbName} Database`) //log "Connected to <database name> Database" to the console, once the connection is successful.

    db = client.db(dbName) // Once connected, assigns the db variable the value of the database that we want to use. This creates an interface through which we can interact with said database.
  })

app.set('view engine', 'ejs') //set our view engine(something that allows for the rendering of web pages using template files) to use ejs.

app.use(express.static('public')) // add/use the 'express.static' middleware for serving static files (js,css,images). Tells the application that static files are located in a folder called 'public'

app.use(express.urlencoded({ extended: true })) //use the built in middleware 'express.urlencoded' which allows you to parse requests that have URL-encoded payloads, like forms, and pass in the option of 'extended' with a value of 'true'- which means that the request body can contain values of any type, rather than just strings or arrays, as when set to 'false' 

app.use(express.json()) //use the express.json middleware to parse requests with JSON payloads.


app.get('/', async (request, response) => { // send a 'get' request to the root route of a URL and set the request handler to be ansynchronous. 


  const todoItems = await db.collection('todos').find().toArray() //Create a constant variable called 'todoItems.' *Wait* (pause further execution) while every item in the 'todos' collection is retrieved and converted into an array. Once this task is *eventually* completed, assign the value of the array to the todoItems variable.

  const itemsLeft = await db.collection('todos').
    countDocuments({ completed: false }) // Create a constant variable called 'itemsLeft. Call The 'countDocuments' method on the 'todos' collection, using the selection criteria {completed: false}. *Eventually* this will return a promise representing a count of how many items in the 'todos' collection have a completed property of 'false.' Assign that count to the itemsLeft variable. 

  response.render('index.ejs', { items: todoItems, left: itemsLeft })  // respond by rendering the index.ejs file. In that file, pass the value of todoItems into a variable called 'items', and the value of itemsLeft into a variable called 'left'


  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {// send a post request to the 'addTodo' route

  db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })//insert one document into the 'todos' collection. Give this document a 'thing' property with a value equal to the 'todoItem' property of the request body, and a completed property with a value of false. 

    .then(result => {// insertOne returns a promise, once resolved, store the promise data in a variable called 'result'

      console.log('Todo Added')//log 'Todo Added' to the console.
      response.redirect('/')//redirect to the root route.
    })
    .catch(error => console.error(error))// if there was an error, log it to the console.
})

app.put('/markComplete', (request, response) => {//send a put request to the 'markComplete' route.

  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {//call the updateOne method on the document in the todos collection who's 'thing' property matches the value of the 'itemFromJs' property attached to the request body.

    $set: {//use the set operator to...
      completed: true//replace the value of the 'completed' property on this document with a value of true
    }
  }, {
    sort: { _id: -1 },//sort the items in the collection according to their ids, and in descending order
    upsert: false //do not insert a new document into the collection if no matching document is found 
  })
    .then(result => {//updateOne returns a promise object, store it in a variable called 'result'

      console.log('Marked Complete') //if fulfilled, log 'marked complete' to the console

      response.json('Marked Complete')  // Send a response to the client in the form a a JSON string that reads "Marked Complete"  
    })
    .catch(error => console.error(error))//if rejected, log the error to the console

})

app.put('/markUnComplete', (request, response) => {// send a put request to the 'markUnComplete' route.

  db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
    //call the updateOne method on the document in the todos collection who's 'thing' property matches the value of the 'itemFromJS' property that is attached to the request body.
    $set: {// use the $set operator to...
      completed: false//change the value of the 'completed' property on this item to false
    }
  }, {
    sort: { _id: -1 }, //sort the items in the collection according to their ids, and in descending order
    upsert: false//if no matching document is found, do not insert one into the collection
  })
    .then(result => {  //the updateOne method returns a promise object, store it in a variable called 'result'
      console.log('Marked Complete') //if fulfilled, log 'marked complete' to the console

      response.json('Marked Complete')  //send a response: 'Marked Complete' in JSON format 
    })
    .catch(error => console.error(error)) //if rejected, log the resulting error to the console.

})

app.delete('/deleteItem', (request, response) => {// send a delete request to to the 'deleteItem' route.

  db.collection('todos').deleteOne({ thing: request.body.itemFromJS })//call the deleteOne method on the document in the todos collection who's 'thing' property is equivalent to the the value of the 'itemFromJs' property attached to the request body.

    .then(result => {
      console.log('Todo Deleted') // once fulfilled, log 'ToDo Deleted' to the console.

      response.json('Todo Deleted') // send a response: 'Todo Deleted' in JSON format.
    })
    .catch(error => console.error(error)) // if rejected, log the resulting error to the console.

})

app.listen(process.env.PORT || PORT, () => {  // call the listen method of app and set our server to listen on either the port we specified in our .env file, or port 2121 as specified in this file.
  console.log(`Server running on port ${PORT}`) //Once successfully connected, log 'Server running on port <port we are listening on> to the console.
})