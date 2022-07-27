const express = require('express')  // require express
const app = express() // create node js express app
const MongoClient = require('mongodb').MongoClient // require mongo db
const PORT = 2121 // create variable for port 2121
require('dotenv').config() // lightweight package that automatically loads env variables


let db, // declare db instance
    dbConnectionStr = process.env.DB_STRING, // set db url
    dbName = 'todo' // db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //mongo db client
    .then(client => { // used for promise
        console.log(`Connected to ${dbName} Database`) // log to console
        db = client.db(dbName)  // connect to this db
    })
    
// ========================
// Middlewares
// ========================
app.set('view engine', 'ejs') // view engine allows us to render web pages using template files and ejs uses embedded js to create html 
app.use(express.static('public')) // tells the system it can access the public folder via http
app.use(express.urlencoded({ extended: true })) // parses the objects as js encoded variables and states the object can be any variable type not just string
app.use(express.json())  // parses incoming JSON requests and puts the parsed data in req

// ========================
// Routes
// ========================
app.get('/',async (request, response)=>{ // tells the server what to do when the requested endpoint matches the endpoint stated
    const todoItems = await db.collection('todos').find().toArray() // turns the collection into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // returns the count of documents
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders a view and sends the rendered html to the client

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // tells the server what to request. here we are sending the todo to the collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // adds items to a mongodb collection
    .then(result => { // promise 
        console.log('Todo Added') // log to console
        response.redirect('/') // redirect to the main page with the new todo added
    })
    .catch(error => console.error(error)) // catch any errors
})

app.put('/markComplete', (request, response) => { // tells the server what to update or which item to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // removes todo from collection. if todo is gone it is complete
        $set: { // sets this collection
            completed: true // sets item to completed for index.ejs loop
          }
    },{
        sort: {_id: -1}, // sorts the list so you dont get repeated items
        upsert: false // does not update after the sort
    })
    .then(result => { // promise
        console.log('Marked Complete') // log to console
        response.json('Marked Complete') // response 
    })
    .catch(error => console.error(error)) // catch any errors

})

app.put('/markUnComplete', (request, response) => { // tells the server what to update or which item to uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // marks  todo not complete in collection.
        $set: { // sets this collection
            completed: false // sets item to not completed for index.ejs loop
          }
    },{
        sort: {_id: -1}, // sorts the list so you dont get repeated items
        upsert: false // does not update after the sort
    })
    .then(result => { // promise
        console.log('Marked Complete') // log to console
        response.json('Marked Complete') // response 
    })
    .catch(error => console.error(error)) // catch any errors

})

app.delete('/deleteItem', (request, response) => { // tells the server what item will be deleted
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // which item is being deleted from the collection
    .then(result => { // promise
        console.log('Todo Deleted') // log to console
        response.json('Todo Deleted') // response
    })
    .catch(error => console.error(error)) // catch any errors

})

app.listen(process.env.PORT || PORT, ()=>{  // which port the app is listening
    console.log(`Server running on port ${PORT}`) // log to console
})