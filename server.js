const express = require('express') //includes the express module
const app = express() //calls express and ties it to the variable app, we then use app to write handlers for HTTP requests
const MongoClient = require('mongodb').MongoClient //includes MongoClient module so we can access our database
require('dotenv').config() //configures our .env file so we can hide our secret stuff like passwords, API keys, PORTS, etc


let db, //declare our database variable
    dbConnectionStr = process.env.DB_STRING, //sets our secret connection string from our .env file to a variable
    dbName = 'todo' //name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects us to our database
    .then(client => { //if we connect we get our database back 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //sets the db variable to our database 
    })
    
app.set('view engine', 'ejs') //lets us use ejs templates 
app.use(express.static('public')) //sends all of our static files in our public folder
app.use(express.urlencoded({ extended: true })) //helps us parse urls
app.use(express.json()) //helps us parse json 


app.get('/', async (request, response)=>{ //read request for the root path 
    const todoItems = await db.collection('todos').find().toArray() //finds all of the documents in the 'todos' collection, turns them into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //finds all of the documents in the 'todos' collection that haven't been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders our ejs file with the data we've gotten from our database 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create request from the addTodo path 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds a document to our 'todos' collection based on the form in our ejs file, request.body.todoItem comes from the text input 
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //refreshes to our root path which is a get (read) request
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //put (update) request using the /markComplete path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates the 
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})