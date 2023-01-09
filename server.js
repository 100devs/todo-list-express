const express = require('express') // Allows you to load and use express
const app = express() // Puts express function into app variable to use with other
const MongoClient = require('mongodb').MongoClient // Allows you to load and use Mongodb
const PORT = 2121 // Defines the local host port that we will use. 
require('dotenv').config() // Allows us to load and be able to use .env-- a place to put "secret" keys/ passwords


let db,    // innitialize db without a value. 
    dbConnectionStr = process.env.DB_STRING, // Grabs our DB connection string from our .env
    dbName = 'todo'  // anything with dbName will reference the value 'todo' which is the name of our collection.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // This connects our DB. 
    .then(client => { // Client now holds the return of the connection to our DB. 
        console.log(`Connected to ${dbName} Database`) // Console.log that once we are connected to DB
        db = client.db(dbName) // We assign db to be the Connection but specifically the 'todo' collection. 
    })
    
    
app.set('view engine', 'ejs') // allows us to use ejs. 
app.use(express.static('public')) // allows us to use public folders/ to add all our initial static files served.
app.use(express.urlencoded({ extended: true })) // parses url encoded payloads-- like body parser
app.use(express.json()) // It parses incoming JSON requests and puts the parsed data in req.body.


app.get('/',async (request, response)=>{ // READ
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()// Puts all collection documents into an array. 
    .then(data => { // This array is then put into the data parameter. 
        db.collection('todos').countDocuments({completed: false, deleteClientSide: false}) 
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error)) // throws error if promise returns as .
})

app.post('/addTodo', (request, response) => { //CREATE
    // The route comes from the Action="/addTodo" on on the Form. Method= "POST"
    // Then the actual input name that has name="todoItem" this is sent in the req.body inserted below.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false, deleteClientSide: false}) 
    // The value is added to the DB with the name thing.
    .then(result => {
        console.log('Todo Added')
        // We console log.
        response.redirect('/')
        // We respond the browser to refresh to the root path.
    })
    .catch(error => console.error(error)) // throws error if promise rejected. 
})

app.put('/markComplete', (request, response) => { //UPDATE 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //route comes from main.js response
        // Go to DB--> 'todos' collection---> updateOne with what was sent from /markUnComplete and update the thing property with it. 
        $set: {
            completed: true // Set completed to true
          }
    },{
        sort: {_id: -1}, // if there is more than one of the same named item- delete the first indexed. 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // send to client console.log Marked Complete
        response.json('Marked Complete') // send to client json marcked complete
    })
    .catch(error => console.error(error)) // throws error if promise rejected.

})

app.put('/markUnComplete', (request, response) => { // UPDATE
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //route comes from main.js response
        // Go to DB--> 'todos' collection---> updateOne with what was sent from /markUnComplete and update the thing property with it. 
        $set: {
            completed: false // Set completed to false (unclick.)
          }
    },{
        sort: {_id: -1},// if there is more than one of the same named item- delete the first indexed.
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')// send to client console.log Marked Complete
        response.json('Marked Complete') // send to client json marcked complete
    })
    .catch(error => console.error(error)) // throws error if promise rejected.

})

app.put('/markDeleted', (request, response) => { // UPDATE // This "deletes" client side- but not really.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //route comes from main.js response
        // Go to DB--> 'todos' collection---> updateOne with what was sent from /markUnComplete and update the thing property with it. 
        $set: {
            deleteClientSide: true // here we set the deleteClientSide Property to true.
          }
    },{
        sort: {_id: -1},// if there is more than one of the same named item- delete the first indexed.
        upsert: false
    })
    .then(result => {
        console.log('Marked Deleted') // send to client console.log Marked Deleted
        response.json('Marked Deleted') // send to client json marked deleted
    })
    .catch(error => console.error(error)) // throws error if promise rejected.

})

app.delete('/deleteItem', (request, response) => { // DELETE 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //route comes from main.js respons
    // Go to DB--> 'todos' collection---> Delete with what was sent from /deleteItem and delete the document with the thing property. 
    .then(result => {
        console.log('Todo Deleted')// send to client console.log 
        response.json('Todo Deleted') // send to client json 
    })
    .catch(error => console.error(error)) // throws error if promise rejected.

})

app.listen(process.env.PORT || PORT, ()=>{ // Create a port from either the .env or the PORT defined above
    console.log(`Server running on port ${PORT}`)// console log that it's working 
})