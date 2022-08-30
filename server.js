const express = require('express') // express is used 
const app = express() // first two lines required to create an express application
const MongoClient = require('mongodb').MongoClient // mongoDB is used
const PORT = 2121 // 2121 is the specified port the server will be using
require('dotenv').config() // zero-dependency module that loads environment variables from a .env file to process.env


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // this line states that we will be using ejs to generate our HTML
app.use(express.static('public')) // any files you put into the public folder will be served up from this line
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{ // exactly like a click event // a git request to the database
    const todoItems = await db.collection('todos').find().toArray() // go to the database // find all the documents in the collect // and turn it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // go to the database // find all the items that's not completed // turn it into an array
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the HTML // responds with the HTML file // items is the toDoItems array // left is the itemsLeft array
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // a git request to the database specifically a post request // '/addTodo' has to be the exact as the form on ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert a new document into the database // a new todoItem // set as not completed 
    .then(result => { // after the request this is the result
        console.log('Todo Added') // logs 'Todo Added' to the console
        response.redirect('/') // redirects back to the main route and triggers a refresh 
    })
    .catch(error => console.error(error)) // an error if request doesn't go through
})

app.put('/markComplete', (request, response) => { // a git request to the database to mark the item complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates the document in the database
        $set: {
            completed: true // changed completed state to true
          }
    },{
        sort: {_id: -1}, 
        upsert: false
    })
    .then(result => { // after the request this is the result
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // an error if request doesn't go through

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false // changed completed state to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { // after the request this is the result
        console.log('Marked Complete') // logs 'Marked Complete' in the console
        response.json('Marked Complete') // marked complete on the json
    })
    .catch(error => console.error(error)) // an error if request doesn't go through

})

app.delete('/deleteItem', (request, response) => { // git request to delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // removes a document from the body
    .then(result => { // after the request this is the result
        console.log('Todo Deleted') // logs 'Todo Deleted' to the console
        response.json('Todo Deleted') // deleted json
    })
    .catch(error => console.error(error)) // an error if request doesn't go through

})

app.listen(process.env.PORT || PORT, ()=>{ // either use the local port or the port the server uses
    console.log(`Server running on port ${PORT}`) // console logs which port is running on 
})