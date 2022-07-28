//set declarations
const express = require('express')//requires express
const app = express() //let's server know that express si the app we are using
const MongoClient = require('mongodb').MongoClient //requires mongodb
const PORT = 2121 //port we're using
require('dotenv').config()//allows server to grab variables from our .env file 

//set varaibles
//below sets variables to our db, dbConnectionStr that's in our .env file and dbName, creates the db for us if it's not already created in mongo!
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//copnnect to db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// connection method to MongoDB
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })//response to the client side, console log we're connect 

//Middlewares
app.set('view engine', 'ejs')//Determines how we're going to use a view (template) enginer to render ejs commands for our app
app.use(express.static('public'))//tells our app to use a folder called public for all our static files (eg. images and CSS)
app.use(express.urlencoded({ extended: true }))//new way to say body parser call to middleware that cleans up how things are displayed and how our server communicates with our client (similar to useUnified)
app.use(express.json())//tells express to return the data as json

//Routes
app.get('/',async (request, response)=>{
    //app starts from the "root" with an async function 
    const todoItems = await db.collection('todos').find().toArray() //waits for a promise (fulfied or rejected) if fulfilled, finds the db, and responds with an array
    const itemsLeft = await db//create a const in our todos collection
    .collection('todos')//looks at documents in the todos  collection
    .countDocuments({completed: false});//countDocuments method counts the # of docs that have not yet been completed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// renders the # of docs in our collection and the # of items left to do. 

    // db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })//if OK renders the data  and items left
        })
    })
    .catch(error => console.error(error))//if NOT console logs the error
})

app.post('/addTodo', (request, response) => {
    //adds item to our database via route
    db.collection('todos')//server goes to our db called todos
    .insertOne({thing: request.body.todoItem, completed: false})// inserts one item named todoItem, marked as not completed aka false
    .then(result => {
        console.log('Todo Added')//if OK console logs "Todo Added"
        response.redirect('/')// takes us back to the root (back home)
    })
    .catch(error => console.error(error))//if NOT OK sends an error back to the client 
})

//UPDATE
app.put('/markComplete', (request, response) => {
    db.collection('todos')//going back to our todos collection
    
    .updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // added a status of completed (which means true) to item in our collection 
          }
    },{
        sort: {_id: -1},//sorts the array by descending order by id.
        upsert: false //upsert will update the db if the note is found and insert a new note if not found, but since completed is set to TRUE it will prevent this behavior from happening 
    })
    .then(result => {
        console.log('Marked Complete')//if OK console logs "marked complete"
        response.json('Marked Complete')//going back to our fetch in main.js 
    })
    .catch(error => console.error(error))//console logs an error

})

app.put('/markUnComplete', (request, response) => {// this unclicks an item you marked as complete --- will take away compete status 
    db.collection('todos')//go into todos collection 
    .updateOne(
        {thing: request.body.itemFromJS},// look for item from itemFrom JS
        {
        $set: {
            completed: false// undos what we did with the markComplete. It changes "completed" status to "false"
    },{
        sort: {_id: -1}, //no idea bro
        upsert: false//upsert will update the db if the note is complete and insert a new note if not, but since completed is set to false it will allow this behavior 
    })
    .then(result => {
        console.log('Marked Complete')//if OK console log "Marked Complete"
        response.json('Marked Complete')// returns response of "marked complete" to the fetch in main.js
    })
    .catch(error => console.error(error))//if NOT ok, error is logged to console

})

//Delete
app.delete('/deleteItem', (request, response) => {
    db.collection('todos')//goes into todos collection
    .deleteOne({thing: request.body.itemFromJS})//uses deleteOne method and finds a thing that matches the sname of what you clicked 
    .then(result => {
        console.log('Todo Deleted')//if OK console log "Marked Complete"
        response.json('Todo Deleted')// returns response of "todo deleted"" to the fetch in main.js
    })
    .catch(error => console.error(error))//if NOT ok, error is logged to console

})

app.listen(process.env.PORT || PORT, ()=>{
    //tells server to listen on the port set by process.env/hosting port like heroku or  we assigned earlier
    console.log(`Server running on port ${PORT}`)//console logs that the server is logging on blank port
})

//made branch and commented server.js