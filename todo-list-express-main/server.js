const express = require('express') // tells the server to use express methdds to execute each task
const app = express() // sets express methods in a variable to be used throughout
const MongoClient = require('mongodb').MongoClient // tells the server to make a call to the database 
const PORT = 2121 // the local port that the server will run on placed into a variable 
require('dotenv').config() // requires the .env file to be able to access the database using our specific password


let db,  // sets the db variable as empty to be used later
    dbConnectionStr = process.env.DB_STRING,  // goes into the env file and access the db string to get into our database 
    dbName = 'todo' // tells the name of the collection that we will be using in our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // telling our express app to connect to our collection in the database  
    .then(client => { // an async function that tells espress to console log and tell us that we have successfully connected to the database 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)  // sets the db variabvle to hold the name of the collection we are accessing in our db
    })
// MIDDLEWARE 
app.set('view engine', 'ejs')
app.use(express.static('public')) // tells the server to use the information from the public folder to display rendered information
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// =========================================================

app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray() // Goes to the specified db and finds the collection called todos and finds those items and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // counts the amount of documents in the todos collection and sets the completed key to a value of false 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders in ejs the information passed through each variable placing each variable as a value in an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // post or create method use to add item using the directory of add to do
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // goes into a db collection by the name of todos and creates a new object (a new document) with the item inserted from the ejs text box and a value of false because it is incomplete
        .then(result => {
            console.log('Todo Added') // sends a console.log to let us know our item as successfully been added to the list
            response.redirect('/') // reloads page to display the new item added
        })
        .catch(error => console.error(error)) // console logs any error that is thrown
})

app.put('/markComplete', (request, response) => { // uses the put or update method because we are beginning a process of updating some item on the page
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // accesses the todos collection and uses the updateOne method to access an item in the document 
        $set: {  // this mongo operator replaces a value in a field
            completed: true  // we are replacing the completed status with true from false because the item has been completed because we are in the mark complete directory
        }
    }, {
        sort: { _id: -1 }, // sorts the mongo _id in descending order 
        upsert: false // will not create a new document because it is set to false
    })
        .then(result => {
            console.log('Marked Complete') // console logs to let us know that our item has been marked complete
            response.json('Marked Complete') // sends json data as marked complete
        })
        .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // the update method is used to mark items as incomplete
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // gets the item from the main js
        $set: {
            completed: false  // chases the value of completed to false if it is not already specified that way
        }
    }, {
        sort: { _id: -1 }, // sorts the mongo _id in descending order
        upsert: false // does not add new document to the database 
    })
        .then(result => {
            console.log('Marked Incomplete') // console logs to tell us our items have been marked incomplete
            response.json('Marked Incomplete')
        })
        .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // uses the delete express method because we are beginning to remove items
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // goes into the todos collection and runs the deleteOne method on the selected item to be deleted
        .then(result => {
            console.log('Todo Deleted') // sends a console log to let us know that our item has been deleted
            response.json('Todo Deleted') // responds to tell us that our item has been deleted
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => { // tells the server to run on the port that we have set or the port assigned 
    console.log(`Server running on port ${PORT}`)
})