const express = require('express')
// requires the express package
const app = express()
// creates the express function named app
const MongoClient = require('mongodb').MongoClient
// installing the files, and defining the mongoclient
const PORT = 2121
// storing a number to PORT
require('dotenv').config()
// this enables the dotenv file, i.e. secret file


let db, //define the dataBase variable for Mongo
    dbConnectionStr = process.env.DB_STRING, // defining the connection to your MongoDB account
    dbName = 'todo' // database name inside mongo 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // initializing the mongoClient using the connection string we have
    .then(client => {  // Uses a promise, uses then method to connect to the client
        console.log(`Connected to ${dbName} Database`) // console to confirm the connection
        db = client.db(dbName) // redefine db to to connect to the client db(todo == dbName)
    })
    
app.set('view engine', 'ejs') //allows express to use ejs templates 
app.use(express.static('public')) // allows easier routing to the public folder
app.use(express.urlencoded({ extended: true })) // a middleware that allows express JSON data to enter the server 
//It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.json()) // middleware to read json data 


app.get('/',async (request, response)=>{  //reading the mongoClient and printing out the mongoClient database todos
    //uses async function to send everything at the same?
    const todoItems = await db.collection('todos').find().toArray() //defines and finds the todoItems as the mongo client collection 'todos' and places them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //defined itemsLeft where you store the result, and telling it to await for the documents that aren't completed yet.

    response.render('index.ejs', { items: todoItems, left: itemsLeft })// this just renders the index.ejs file with the two properties of items and left

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //express function that creates something new using the url of 'addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//using the mongo function/method 'insertOne' to place a new object with the properties of thing and completed
    // so from the index.ejs file, there is a form at the bottom with the action '/addTodo', thats where we get the request.body.todoItem
    .then(result => { //promise that console logs that we succesfully added an item
        console.log('Todo Added') 
        response.redirect('/') //then redirects to the homepage, which will update our todo list
    })
    //async vs .then??
        // async is used when there are more variables??
        // there is no catch 
        // leon - makes the code look more synchronous 
        // https://stackoverflow.com/questions/54495711/async-await-vs-then-which-is-the-best-for-performance
    .catch(error => console.error(error)) // consoles error 
})

app.put('/markComplete', (request, response) => { // express function that updates a todo
    //Marking a task to be completed 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //using a mongodb method/function updateOne it updates property thing, where request.body.itemFromJs is from the main.js
        //
        $set: { //it tells the item/task property to be completed
            //set-sets something 
            completed: true
          }
    },{//options 
        sort: {_id: -1},// made to not overwrite the current ID of the object
        upsert: false
        // doesnt create a new document 
    })
    .then(result => {
        console.log('Marked Complete') // tells us it's done
        response.json('Marked Complete') // json that tells the server/user that is interacting with the todo app
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //express function that marks an uncomplete task
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// mongo function that updates one, specfically request.body.itemFromJS, which is from main.js
        $set: { //sets the property,'completed', in todo object as false
            completed: false
          }
    },{ // location in the options portion of the updateOne settings
        sort: {_id: -1}, // makes sure that the id is not anything else, possibly - MaVi

        // made to not overwrite the current ID of the object
        //$sort takes a document that specifies the field(s) to sort by and the respective sort order. <sort order> can have one of the following values:
// Value
	
// Description
// 1
	
// Sort ascending.
// -1
	
// Sort descending.
        upsert: false //doesnt create a new document
    })
    .then(result => {
        console.log('Marked unComplete') // console logs that it is marked uncomplete
        response.json('Marked unComplete')
        //send a json message that it is marked uncomplete
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    //express method that delete a document
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //uses a mangodb method that deletes just one requested item, thing
    .then(result => {
        console.log('Todo Deleted') //console logs
        response.json('Todo Deleted') // sends json todo deleted 
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //tells the server to turn on listen to the specific defined PORT, and console logs to make sure that it is turned on
    console.log(`Server running on port ${PORT}`)
})