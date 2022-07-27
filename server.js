// modules
const express = require('express')
const app = express() 
const MongoClient = require('mongodb').MongoClient
const PORT = 2121 // establishes a local port
require('dotenv').config() // allows hidden environment variables


let db,
    dbConnectionStr = process.env.MONGODB_URL, // sets db and dbConnectionStr to the key in the env file 
    dbName = 'todo' // sets dbName to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // defines connection to mongodb. useUnifiedTopology ensures things are returned in a clean manner
    .then(client => { // once connected...
        console.log(`Connected to ${dbName} Database`) // print this message to console
        db = client.db(dbName) // defines the database as in line 11
    })


// MIDDLEWARE
app.set('view engine', 'ejs') // determines how we're going to use a view engine (template) to render ejs commands for our app
app.use(express.static('public')) // telling our app to use a folder named public for all static files
app.use(express.urlencoded({ extended: true })) // a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.json()) // tells the app to use express's json method which converts the object to JSON to make it readable


app.get('/',async (request, response)=>{ // GETs stuff to display on the client side using an asynchronous function
    const todoItems = await db.collection('todos').find().toArray() // creates a constant called todoItems that goes into the database, creates a collection called todos (or retrieves a collection called todos), finds everything in that collection, and turns that into an array
    // toArray() method allocates a new in-memory array with a length equal to the size of the collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // looks at documents in the collection, uses the .countDocuments method on documents with a completed value of false (ie, not completed)
    // In MongoDB, the countDocuments() method counts the number of documents that matches to the selection criteria. It returns a numeric value
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sends response to the render method, which will send back a response of the todo items we still have to complete to index.js


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    //.catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // adds item via /addTodo route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // server will go into "todos" collection, insert one "thing" named todoItem with a key of completed set to false
    .then(result => { // if everything went well...
        console.log('Todo Added') // prints to console
        response.redirect('/') // does not sent to another page, keep it in the REFRESHED index.js  
    })
    .catch(error => console.error(error)) // if we weren't able to add anything to the database, prints the error 
})

app.put('/markComplete', (request, response) => {
    // update after being sent to /markComplete from frontend
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes through the todos collection
        $set: {
            // adds value of TRUE to the completed KEY
            completed: true
          }
    },{
        sort: {_id: -1}, // once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false // doesn't create a mongodb document for the todo if the item isn't found
    })
    .then(result => { // assuming all went well
        console.log('Marked Complete') // print message
        response.json('Marked Complete') // returns message to the fetch in main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged

})

app.put('/markUnComplete', (request, response) => { // this activates upon clicking something that was marked as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes into collection, look for item from itemFromJS
        $set: {
            completed: false // sets key of completed to false
          }
    },{
        sort: {_id: -1}, 
        /* "When you use the MongoDB sort() method, you can specify the sort order—ascending (1) or descending (-1)—for the result set. I"

        "Sorting by _id is faster because of the way _id field value is generated." */
        upsert: false // doesn't create a mongodb document for the todo if the item isn't found
    })
    .then(result => {
        console.log('Marked Complete') // prints this message WHICH SHOULD READ UNCOMPLEEEEETE
        response.json('Marked Complete') // returns this message to fetch in main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged

})

app.delete('/deleteItem', (request, response) => { // going the DELETE route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // goes into collection and uses the deleteOne method on a thing that matches the request body from itemFromJs
    .then(result => { // if all went well...
        console.log('Todo Deleted') // prints this message
        response.json('Todo Deleted') // returns this message to fetch in main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged

})

app.listen(process.env.PORT || PORT, ()=>{ // tells the server to listen for connections on the PORT defined at the top of the file OR listen on the port of the app (such as used by heroku, for instance)
    console.log(`Server running on port ${PORT}`) // prints the port number the server is running on
})