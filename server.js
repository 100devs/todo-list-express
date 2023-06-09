const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// Connect database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // Go into 'todos' collection, find all the documents and add them to an array
    db.collection('todos').find().toArray()

    // Now pass array from above into variable 'data'
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {

            // Send response to client side with template index.ejs and two vars: items and left.
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {

    // Add one document to database table called 'todos'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Then, print 'todo added' and redirect to homepage creating new get request
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // If errors, print errors to console
    .catch(err => console.error(err))
})

app.put('/markComplete', (request, response) => {
    // Got to db collection called 'todos' and look for think called (whatever was in request.body value)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Change the completed property from false to true
        $set: {
            completed: true
          }
    },{
        // Since we are searching by string, we'll say whichever item that matches string that comes first is what we update
        sort: {_id: -1},

        // If set to true and you try to update something that isn't there, it will create document for you (can save headache if template language is stiff and requires something to be there)
        upsert: false
    })
    // Now responsd to client side
    .then(result => {
        console.log('Marked Complete')
        // Send a json response 'Marked complete to client side'
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    // Go to colleciton called 'todos' and update one object with the key 'thing' and value passed from client side js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Change complted key to false
        $set: {
            completed: false
          }
    },{
        // If there are mulitple items that match, update first one
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // Send json reponse called 'Marked Complete'
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    // Delete one item from todos collection. Search item by name
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        
        console.log('Todo Deleted')

        // Send response json with string 'todo deleted'
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})