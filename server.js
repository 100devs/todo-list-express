//variable to connect to the express module, express must be installed in terminal
const express = require('express')
//variable to allow better writability for express methods
const app = express()
//variable to connect to the mongo database module, express must be installed in terminal
const MongoClient = require('mongodb').MongoClient
//port to allow us to route (hear and send) http requests
const PORT = 2121
//dotenv allows us to host app remotely and uses hosts' port environment
require('dotenv').config()

//initialize database and store in variable names 'todo'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//connects to mongodb and console.log message confirming success
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    
//MIDDLEWARE
//connects to EJS to manage our views template that data will be parsed into
app.set('view engine', 'ejs')
//makes static pahes like css and index.html publicly accessablie to express http requests
app.use(express.static('public'))
//allows us to parse strings and arrays from URLs form elements for HTTP requests
app.use(express.urlencoded({ extended: true }))
//parses incoming JSON requests for post ad put requests where objects are sent via HTTP 
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//post (create) request handles server-side response to original client-side request on /addTodo root route to create a new todo item
//body text from client request is stored in database as JSON object with a default completed status of false
//console logs success confirmation message
//page is refreshed to the home / root route
//catch error and log to console if unsuccessful
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//put (update) request handles server-side response to original client-side request on /markComplete root route to update an existing todo item
//client-selected todo item to be updated is searched for in database, if it exists in database, completed status updated to true (triggers css styling to be applied for grey text with strikethrough)
//item is sorted to the bottom of the index.html list
//upsert is false, so we do not crete any new database element if the requested element does not exist
//console logs and sends json success confirmation message
//catch error and log to console if unsuccessful
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//put (update) request handles server-side response to original client-side request on /markUbconplete root route to update an existing 'completed' todo item
//client-selected todo item to be updated is searched for in database, if it exists in database, completed status updated to false (triggers original plain css styling to be applied to HTML text element)
//item is sorted to the bottom of the index.html list
//upsert is false, so we do not crete any new database element if the requested element does not exist
//console logs and sends json success confirmation message
//catch error and log to console if unsuccessful
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


//delete request handles server-side response to original client-side request on /deleteItem root route to delete an existing todo item
//client-selected todo item to be deleted is searched for in database, if it exists in database, it will be deleted from database
//console logs and sends json success confirmation message
//catch error and log to console if unsuccessful
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//tells our server to listern for incoming http request to start running our server. Works both localls and for an external hosting site's environment
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})