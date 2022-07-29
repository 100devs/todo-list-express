const express = require('express') //makes express required to create/listen for web connection
const app = express() //variable to make it easier to write code
const MongoClient = require('mongodb').MongoClient //shortens required code to connect to mongo
const PORT = 2121 //establishes a default port connection
require('dotenv').config() // set the environment of the db

let db, // db variable
    dbConnectionStr = process.env.DB_STRING, // add variable to keep the private db env settings private
    dbName = 'todo' // variable setting db name to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // express connection to our db using the connectionStr variable
    .then(client => { // once connection is established this stuff happens
        console.log(`Connected to ${dbName} Database`) // console log stttes that named db is connected
        db = client.db(dbName) // set db variable to client db name/'todo'
    })
    
app.set('view engine', 'ejs') // allows us to use ejs to change html dynamicaly
app.use(express.static('public')) // makes every request to the public folder work
app.use(express.urlencoded({ extended: true })) //no clue, even after google
app.use(express.json()) // allows express to recognize results as json


app.get('/',async (request, response)=>{ // express GET method to load root page
    const todoItems = await db.collection('todos').find().toArray() // variable to hold array for to do list
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // variable to hold uncompleted item for list
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders todo items and items left to EJS
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // express post function for addToDo request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert new item into db with a false completed flag
    .then(result => { // what happens after request
        console.log('Todo Added') //console log that todo has been added
        response.redirect('/') //refreshes page
    })
    .catch(error => console.error(error)) // console log any error info
})

app.put('/markComplete', (request, response) => { // express PUT request to mark complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update one item in db
        $set: { // setter to set a value to id
            completed: true // flag completed as true
          }
    },{
        sort: {_id: -1}, // subtract 1 from private id num
        upsert: false // sets upsert(update/insert) to false
    })
    .then(result => { // what happens next
        console.log('Marked Complete') // log as marked complete
        response.json('Marked Complete') // updates json as complete
    })
    .catch(error => console.error(error)) // console log any error info

})

app.put('/markUnComplete', (request, response) => { // express PUT request to mark uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update one item in db
        $set: { // setter to set a value to id
            completed: false // flag completed as false
          }
    },{
        sort: {_id: -1}, // subtract 1 from private id num
        upsert: false // sets upsert(update/insert) to false
    })
    .then(result => { // what happens next
        console.log('Marked Complete')// log should state marked uncomplete
        response.json('Marked Complete') // update json as uncomplete
    })
    .catch(error => console.error(error)) // console log any error info

})

app.delete('/deleteItem', (request, response) => { // express delete function to delete
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete one item from db
    .then(result => { // what happens next
        console.log('Todo Deleted') // log todo deleted
        response.json('Todo Deleted') // update json as todo deleted
    })
    .catch(error => console.error(error)) // console log any error info

})

app.listen(process.env.PORT || PORT, ()=>{ // express listen function for connectivity on the given environments port or default port
    console.log(`Server running on port ${PORT}`) // log that server is running on designated port
})
