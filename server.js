//MODULES
const express = require('express') //creates variables that imports dependencies installed through npm, including db connection
const app = express() //creates express application
const MongoClient = require('mongodb').MongoClient //connects to mongoDB
const PORT = 2121 //specifies port number (currently a local port)
//don't need to assign dotenv to variable because it will not be called throughout the code
require('dotenv').config() //import and enable env file (for private keys and configurable variables)

//creates databases and assigning them to variables
let db, 
    dbConnectionStr = process.env.DB_STRING, //bring in db connection string that is hidden in .env file
    dbName = 'todo' //setting database name to "todo"

//mongoclient connection established using the db connection str
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { //defines how we conect to our Mongo DB. useUnifiedTopology helps ensure that things are returned in a clean manner.
        console.log(`Connected to ${dbName} Database`)//produce a message in the console if the client connected propely "hey, we made it! We connected to the database named "todo""
        db = client.db(dbName) //defines the database as "todo". Works with line 10 and 12; takes client data and calls db function with dbName passed through as argument
    })

//MIDDLEWARE
app.set('view engine', 'ejs') //determining how we're going to use a view (template) engine to render ejs (embedded javascript) commands for our app
app.use(express.static('public')) //tells our app to use a folder named "public" for all of our static files(e.g. images and css files)
app.use(express.urlencoded({ extended: true })) //choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true)
app.use(express.json()) //tells the app to use Express's json method to take the object and turn it into a json string

//READ
app.get('/',async (request, response)=>{ //app.get is the READ operation in CRUD, async function is set to then await the data it receives
    const todoItems = await db.collection('todos').find().toArray() //go through the "todos" collection in the database and find the stored documents, then pull them and convert them to an array. awaits results before storing the array into todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //goes into the db collection and counts all the stored documents. awaits results before storing the documents count into the itmesLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the index.ejs file with data from todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//CREATE
app.post('/addTodo', (request, response) => { //addTodo route on client side js
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //selects user input on the client, insert it into the db collection as a new object document
    .then(result => { //after inserting the new document into the database, do this:
        console.log('Todo Added') //logs success message 
        response.redirect('/') //reloads the page by re-routing back to app.get('/') to do another read request to render the db collection, now with the new document added and getting rendered onto the page 
    })
    .catch(error => console.error(error)) //log error to the console, if any
})

//UPDATE
app.put('/markComplete', (request, response) => { //markComplete route on client side js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates existing entry as complete
        $set: { //update itemsLeft document from incomplete to completed, thus removing it from the itemsLeft array
            completed: true //set the property "completed" equal to "true" to item/document in the collection
          }
    },{
        sort: {_id: -1},  //once an item/document has been marked as "completed", this sorts the array by descending order by id
        upsert: false //doesn't create a document for the todo item if the item isn't found
    })
    .then(result => {
        console.log('Marked Complete') //logs the item that was marked complete
        response.json('Marked Complete') //returns response of "Marked Complete" to the fetch request in main.js
    })
    .catch(error => console.error(error)) //logs error, if any

})

//UPDATE
app.put('/markUnComplete', (request, response) => {  //does another update like the one above to show incomplete status on a task
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: { //update item from itemCompleted array to uncomplete
            completed: false //set the property "completed" equal to "false" to item/document in the collection
          }
    },{
        sort: {_id: -1}, //once an item/document has been marked as "uncompleted" aka incompelte, this sorts the array 
        upsert: false //doesn't create a document for the todo item if the item isn't found
    })
    .then(result => {
        console.log('Marked Complete') //logs the item that was marked complete
        response.json('Marked Complete') //returns response of "Marked Complete" to the fetch request in main.js
    })
    .catch(error => console.error(error)) //logs error, if any

})

//DELETE
app.delete('/deleteItem', (request, response) => { //deleteItem route from main.js function
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //method takes complete or incomplete item and deletes it from db collection
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') //shows user item was deleted
    })
    .catch(error => console.error(error)) //logs error, if any

})

app.listen(process.env.PORT || PORT, ()=>{ //sets the server to listen on selected port
    console.log(`Server running on port ${PORT}`) //logs message to the console that server is running
})