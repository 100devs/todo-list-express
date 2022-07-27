//create variable that allows for the db connection and allows to use all the dependencies installed through npm
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
//we dont to assign to variable because it's not being called or used in code
require('dotenv').config()

//establishing the databases and assigning them to variables
let db,
    dbConnectionStr = process.env.DB_STRING, // creates a variable that allows you to hide your db connectionstr to your .env connection file
    dbName = 'superdevs'
//mongoclient connection established using the db connection str 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { //outlines how to follow once mongoclient connection is established
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //takes client data and calls db function with dbName passed through as argument
    })
//middleware set up in order to process crud operations
app.set('view engine', 'ejs') //sets to use the index.ejs as the views
app.use(express.static('public')) //everything in public folder for the client the side 
app.use(express.urlencoded({ extended: true })) //parses through url 
app.use(express.json()) //to use express.json parsing tool to process json data

//READ
app.get('/',async (request, response)=>{ //app.get is the READ operation in CRUD, async func is set to then await the data it receives 
    const todoItems = await db.collection('superdevs').find().toArray() //goes to db collection and pulls the completed documents, turns them into an array. awaits results before putting it into var todoItems
    const itemsLeft = await db.collection('superdevs').countDocuments({completed: false}) //goes into db collection and goes through incomplete documents and awaits results before putting it into var itemsLeft
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
app.post('/addTodo', (request, response) => { //addTodo route on the client side js. 
    db.collection('superdevs').insertOne({thing: request.body.todoItem, completed: false}) //gets whatever was typed into the input on the client side and inserts it into the db collection as a new object document
    .then(result => { //after insertion of new document, do this
        console.log('Todo Added') //confirms the db received the newly added document or object
        response.redirect('/') //sends you back to app.get route to do another read request to render the db collection with the new item inserted
    })
    .catch(error => console.error(error)) //to catch any errors that might occur and console log them
})

//UPDATE 
app.put('/markComplete', (request, response) => { //markComplete is the route on the client side js.
    db.collection('superdevs').updateOne({thing: request.body.itemFromJS},{//updates existing entry as complete
        $set: { //update itemsLeft document from incomplete to completed thus removing it from the itemsLeft array
            completed: true
          }
    },{
        sort: {_id: -1}, //sort by descending/last completed 
        upsert: false //wont insert a document if it's not there, else it just updates
    })
    .then(result => { //after itemsLeft document is updated 
        console.log('Marked Complete') 
        response.json('Marked Complete') //sends the response to client side to be rendered on the page
    })
    .catch(error => console.error(error))

})
//UPDATE
app.put('/markUnComplete', (request, response) => {//does another update like the above to show an incomplete status instead
    db.collection('superdevs').updateOne({thing: request.body.itemFromJS},{
        $set: { //sets document completion to false
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Incomplete') //console logs item was marked incomplete
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})
//DELETE
app.delete('/deleteItem', (request, response) => { // /deleteItem route from main.js function
    db.collection('superdevs').deleteOne({thing: request.body.itemFromJS}) //method takes complete or incomplete item and deletes it from db collection
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') //shows user item was deleted 
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{//sets the server to listen on selected port
    console.log(`Server running on port ${PORT}`) //verifies on the console that the server is running
})