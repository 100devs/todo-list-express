//Includes express module
const express = require('express')
//intialize express app
const app = express()
//Initialize mongodb client - this will allow us to connect to database
const MongoClient = require('mongodb').MongoClient
//define port
const PORT = 2121
//configure dotenv module for environment variables
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Allows us to connect to the database by passing in the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //Store database in a variable
        db = client.db(dbName)
    })

//Sets view engine to ejs, this allows us to use ejs as our templating engine for rendering HTML
app.set('view engine', 'ejs')
//Defines public as a static folder - sets the place where app will retrieve all static files
app.use(express.static('public'))
//parse the incoming request with urlencoded values like the querystring - does the same thing that body parser does when processing the JSON data and converting it to JS object within the body property
app.use(express.urlencoded({ extended: true }))
//Parses JSON
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

//create todo task document in database
app.post('/addTodo', (request, response) => {
    //inserts new todo document within the todos collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //redirect to home
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//update todo task by marking it complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets completed property to true
            completed: true
          }
    },{
        //sorts in order
        sort: {_id: -1},
        //doesnt create a new document if one doesnt exist
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//marks todo document as incomplete
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
//deltes todo document from database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//configures the application to be listening on specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})