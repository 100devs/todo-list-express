//MODULES
//requires express to be imported into node
const express = require('express')
//creates an express application
const app = express()
// Requires the mongodb library/software be imported
const MongoClient = require('mongodb').MongoClient
//creates a PORT variable so that you can easily set any port number
const PORT = 2121
//creates and env file to hide important keys such as DB Strings (should be included in your gitignore file)
require('dotenv').config()

//takes connection string variable from DB String inside the env files
let db, // declare variable for database
    dbConnectionStr = process.env.DB_STRING, // declare unique-connection-key to db
    dbName = 'todo' // declare name of db into a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//using the connect method, connects to the dbConnectionStr variable.
    .then(client => {// responding to client side saying... if succesfully connected
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//defines db names. Previously undefined.
    })

//MIDDLEWARE
app.set('view engine', 'ejs')// determines how we're going to use a view(template) engine to render ejs (embedded Javascrtipt) commands for our app
app.use(express.static('public'))// tells  our app to use a folder name "public" fro all our static files (ex. css files  and images)
app.use(express.urlencoded({ extended: true }))// cleans up how things are displayed and how our server communicates with our client (similar to unifiedTopology used above.)
app.use(express.json())// tells the app use Express's JSON method to take the object and turn in into a JSON string.

//ROUTES
app.get('/', async (request, response) => { //gets stuff to display to users on the client users (in this cases, indexejs) using an asych function.
    const todoItems = await db.collection('todos').find().toArray() //Creates a constant called "todoItems" that goes into our database, creates a collection called "todos", find anything in that database, and turn it into an array of objects.
    const itemsLeft = await db //creates a constants in our todos coillection.
        .collection('todos')// looks at the documents in the collection
        .countDocuments({ completed: false }) // the countDocuments method counts the number of documents that have a completed status equal to "false"
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// you're counting how many to-do lists items have not yet been completed



    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //adding element to our datababase via route /addTodo
    db.collection('todos')// server will go into our collection called "Todos"
        .insertOne({ thing: request.body.todoItem, completed: false }) // insert one "thing" named todoItem with a status of completed set to "false" (i.e., )
        .then(result => {
            // if everything works, then console log "Todo Added"
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    //UPDATE. when we click something on the frontend..
    db.collection('todos') // Going to go to into our "todos" collections
        .updateOne({ thing: request.body.itemFromJS }, {
            $set: {
                completed: true // Add ststus of "completed" equal to "true" to item in our collection
            }
        }, {
            sort: { _id: -1 }, // Once a thing has been marked as completed, this sorts the array by descending order by id.

            upsert: false // upsert will update the db if the note is found and insert a new note if not found
        })
        .then(result => { // Assuming went okay we console log and will send a response as json.
            console.log('Marked Complete')
            response.json('Marked Complete') // response.json is what is going back to our fetch in main.js
        })
        .catch(error => console.error(error)) // if something broke it will console log error parameter

})

app.put('/markUnComplete', (request, response) => { // This route unclicks a thing rthat you've marked as complete - will takr away complte status
    db.collection('todos') // go into todo collection
        .updateOne({ thing: request.body.itemFromJS }, // Look foir item from itemFrom/js
            {
                $set: {
                    completed: false // Undoes what we did  with mark complete. It chages "completed" status to false.
                }
            }, {
            sort: { _id: -1 }, // Once a thing has been marked as completed, this sorts the array by descending order by id.
            upsert: false // upsert will update the db if the note is found and insert a new note if not found
        })
        .then(result => { // Continue if everything goes okay
            console.log('Marked Complete')
            response.json('Marked Complete') // response.json is what is going back to our fetch in main.js
        })
        .catch(error => console.error(error)) //if theres and error it will send the error message to the console

})

app.delete('/deleteItem', (request, response) => { // DELETE
    db.collection('todos') // goes into your collection
        .deleteOne({ thing: request.body.itemFromJS })// goes into your collection uses the dleteOne method  and finds a thing that matches the name of the thing you clicked on.
        .then(result => { // Continue if everything goes okay
            console.log('Todo Deleted')
            response.json('Todo Deleted') // response.json is what is going back to our fetch in main.js
        })
        .catch(error => console.error(error)) //if theres and error it will send the error message to the console

})

app.listen(process.env.PORT || PORT, () => { // Tells our server to listen for connection on the PORT  we defined as a constant earlier or process.env.PORT will tell the server to listen on port of the app (e.g., the PORT used by Heroku)
    console.log(`Server running on port ${PORT}`)
});