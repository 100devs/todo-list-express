const express = require('express') // require express for this document
const app = express() // assign express to app variable, making it easier to reference
const MongoClient = require('mongodb').MongoClient //require mongoDb to connect with mongodb, assign to MongoClient
const PORT = 2121 //assign PORT to 2121
require('dotenv').config() //require dotenv to keep passwords in seperate document


let db,
    dbConnectionStr = process.env.DB_STRING, //connection str password for mongodb, connecting to dotenv document
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongoDB
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //let's us know we've connected to the database
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // use ejs doc
app.use(express.static('public')) // serves access to static files in public folder
app.use(express.urlencoded({ extended: true })) //middleware inbuilt in express to recognise the incoming request object as strings or arrays.
app.use(express.json()) //middleware inbuilt in express to recognise the incoming request object as a JSON object


app.get('/',async (request, response)=>{ //get request
    const todoItems = await db.collection('todos').find().toArray() //find todoItem in db and send in array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count how many items are left in todo list
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render todo list and items left as html
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //post req/res using form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add thing to todo list and mark as uncompleted
    .then(result => {
        console.log('Todo Added') //console log letting user know item has been added
        response.redirect('/') //refresh page to update page
    })
    .catch(error => console.error(error)) //catch error if request doesn't work
})

app.put('/markComplete', (request, response) => { //put to give a markcomplete option
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // when clicked, change todo list complete from false to true.
          }
    },{
        sort: {_id: -1}, //sort in order from incomplete to complete
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //console log letting user know request is complete
        response.json('Marked Complete')// returns data as json
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //mark a complete items as uncomplete
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

app.delete('/deleteItem', (request, response) => { //delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete item from todo list
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //tell server file to listen on these ports
    console.log(`Server running on port ${PORT}`)
})
