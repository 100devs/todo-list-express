require('dotenv').config() // you will need the dotenv
const express = require('express')// we will need express
const app = express()// wherever I say app means express
const MongoClient = require('mongodb').MongoClient // we will need mongo too
const PORT = 2121 // this is where I want this app to run locally



let db,
    dbConnectionStr = process.env.DB_STRING, // get the dbconnectionStr from the .env folder
    dbName = 'To-do'// name of the collection we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // using the parameters in .env, connect to my mongo DB
    .then(client => {
        console.log(`Connected to ${dbName} Database`)// let me know you are connected
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')// we will be using an ejs template
app.use(express.static('public'))// we will leave static files here so we dont need to hardcode a route for them
app.use(express.urlencoded({ extended: true }))// this replaces bodyparser
app.use(express.json())// replaces bodyparser


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()//go get the collection to do and convert it to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// get the docs that have the property completed false (the ones left to do)
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//translate the repsonse to the ejs doc y whatever was in to do items, leave it on item, and the ones on itemsLeft where it says left.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // get the info from /todo form and post it
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// find the collection todo, insert into the property thing whatever is in the input to-do item
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')// once completed, console log and refresh so the info can be sent back to ejs to do its thing on the client side.
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {// get the function from the js client side
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// find this collection, update one element, insert whatever the body from itemFromJs contains into the property thing.
        $set: {// then set the property completed of this element to true
            completed: true
          }
    },{
        sort: {_id: -1},// reverse the order
        upsert: false// dont create a new document if it doesn't exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')// send this response
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {// get the info sent from the js client side function markuncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// find this collection, update one element, insert whatever the body from itemFromJs contains into the property thing.
        $set: {
            completed: false // then set the property completed of this element to false
          }
    },{
        sort: {_id: -1}, // reverse the order
        upsert: false // dont create a new document if it doesn't exist
    })
    .then(result => {
        console.log('Marked Uncomplete')// show me this message in the console,if successful.
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))// show me the error if not successful.

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// get the text from itemFromJs
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // this app will be displayed in the port of the platform's choice OR the port marked by me (2121)
    console.log(`Server running on port ${PORT}`)
})