const express = require('express') //Require the Express package
const app = express() //Create a variable to reference Express
const MongoClient = require('mongodb').MongoClient //Require the MongoDB Node.js module, specifically the Mongo Client portion
const PORT = 2121 //Set a port variable for the client to connect to
require('dotenv').config() //Require a .env file to contain the environment variables


let db, //declare an unitialized variable
    dbConnectionStr = process.env.DB_STRING, //pull the DB secret from the .env to allow connections
    dbName = 'todo' //the collection are we connecting to on within MongoDB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to the MongoDB using the connection string
    .then(client => { //wait for the client to connect asynchronously
        console.log(`Connected to ${dbName} Database`) //let us know if we've connected successfully
        db = client.db(dbName) //use our client connection to look at the todo database and associate that with a variable
    })
    
app.set('view engine', 'ejs') //Tell express to us EJS for rendering
app.use(express.static('public')) //What folder to look in
app.use(express.urlencoded({ extended: true })) //Handle URL's easily
app.use(express.json()) //Set up things to handle JSON easily


app.get('/',async (request, response)=>{ //When a GET request is received at the URL root, do the following
    const todoItems = await db.collection('todos').find().toArray() //Asynchronously get all todos and return them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Count the documents in the collection that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Render the returned data to the index.ejs template, associating the response keys with certain variables in the EJS template
    // db.collection('todos').find().toArray() //a .then version of the async await above
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //When a POST request is received at the URL/addTodo URL, do the following:
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Add a document to the todos collection with the following key/value pairs
    .then(result => { //Once the promise resolves, then:
        console.log('Todo Added') //Notify that an object was added
        response.redirect('/') //Reload the page to show the change
    })
    .catch(error => console.error(error)) //If the promise does not resolve, log an error message
})

app.put('/markComplete', (request, response) => { //When a put (update) request is made to the URL/markComplete, do the following:
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Update the item that matches the value in the form field named itemFromJS
        $set: { //Change:
            completed: true //the completed status to true
          }
    },{
        sort: {_id: -1}, //sort the items
        upsert: false //do not insert and update, just update
    })
    .then(result => { //once the update is complete, do the following:
        console.log('Marked Complete') //Log that the update is made
        response.json('Marked Complete') //Return a response to the user that the complete update was made
    })
    .catch(error => console.error(error)) //If there is an error, log it

})

app.put('/markUnComplete', (request, response) => { //When a put (update) request is made to the URL/markUnComplete, do the following:
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Update the item that matches the value in the form field named itemFromJS
        $set: { //Set:
            completed: false //...the completed property to false
          }
    },{
        sort: {_id: -1}, //sort the items
        upsert: false //do not insert and update, just update
    })
    .then(result => {
        console.log('Marked Complete') //Log that the update is made
        response.json('Marked Complete') //Return a response to the user that the complete update was made
    })
    .catch(error => console.error(error)) //If there is an error, log it

})

app.delete('/deleteItem', (request, response) => { //When a delete request is made to URL/deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Delete an item where the description matches the value in itemFromJS
    .then(result => {
        console.log('Todo Deleted') //Log that the delete is made
        response.json('Todo Deleted') //Return a response to the user that the delete was made
    })
    .catch(error => console.error(error)) //If there is an error, log it

})

app.listen(process.env.PORT || PORT, ()=>{ //Listen for requests on the servers defined port. If that isn't defined, listen on the port in our PORT variable
    console.log(`Server running on port ${PORT}`) //Tell us the port on which the server is listening.
})