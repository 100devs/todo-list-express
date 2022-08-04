//imports dependencies
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121

//Allows Us to use .env file to hide private variables
require('dotenv').config()

//Creates variables for connecting to and using the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connects to database using connection string from .env file
//Once Connected search for database with name "todo" and assign to db variable,
//If there is no database wit that name, it creates one then assigns it.  
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db("todo");
    })

//---- middleware ----
//Allows us to ejs files to render dynamic html
app.set('view engine', 'ejs')
//sets public folder as root for routing of client side files  
app.use(express.static('public'))
//Allows us to parse incoming data from PUT and POST requests
//in the format of JSON, strings, and arrays.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//sends database documents to ejs file to be dynamically rendered on root route (/).
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

//On form submission, adds text data to database, then refreshes page to update page for client
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//When item text is clicked, completed value is set to true
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //sets the list's order by order added
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//When item text is clicked, completed value is set to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //sets the list's order by order added
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//When an items trash logo is clicked, the item is removed from the database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Tells the server which port to listen on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})