//Initialize server by requiring dependencies
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3001
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connect to mongo DB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')                   //Use ejs for rendering
app.use(express.static('public'))               //Give express access to public
app.use(express.urlencoded({ extended: true })) //Enable express to parse form data
app.use(express.json())                         //Enable express json parser

app.get('/',async (request, response)=>{                                              // On get request on home page
    const todoItems = await db.collection('todos').find().toArray()                   // get all todos from db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // todos left that havent been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })               //render the html passing in todoItems and itemsLeft
    console.log(todoItems)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {                                         //On put request to /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Get request info from the body and add to the db
    .then(result => {                                                                 //then
        console.log('Todo Added')                                                     //log
        response.redirect('/')                                                        //Go back to home page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {                        // On put request to /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // update the document referenced by the request
        $set: {                                                          // Mark the task as completed
            completed: true
          }
    },{
        sort: {_id: 1},                                                 // filter through the collection in descending order
        upsert: false                                                    // If no completed task found, do not create a new task that is completed
    })
    .then(result => {                                                    // On success log and respond
        console.log('Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {                     // On put request to /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the task referenced by the request
        $set: {
            completed: false                                            // Mark the task as incomplete
          }
    },{
        sort: {_id: 1},                                                 // filter through the collection in descending order
        upsert: false                                                    // If no completed task found, do not create a new task that is completed
    })
    .then(result => {
        console.log('Complete')
        response.json('Marked Complete')                                 // On success respond and log
    })
    .catch(error => console.error(error))

})
app.delete('/deleteItem', (request, response) => {                        // On delete request to /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})    // delete one object that matches the request body
    .then(result => {                                                     // on success log and respond
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{                                // Listen for requests on the designated PORT
    console.log(`Server running on port ${PORT}`)
})
