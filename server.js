const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//connecting to mongoDB
let db,
// env file allows us to keep our credentials hidden
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//connecting to mongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//using express
app.set('view engine', 'ejs')
//holding js and css files in public folder for express to use
app.use(express.static('public'))
//how we get text out of the client side requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    //go to todos collection and turn the documents into an array
    const todoItems = await db.collection('todos').find().toArray()
    //count the uncompleted items in our collections
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the above information onto the page
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

app.post('/addTodo', (request, response) => {
    //insert one document into the DB with a thing value from the request and default completed of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // console log if it has been a success
        console.log('Todo Added')
        // respond with a new get request to refresh the page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    // update item in database which thing value matches request from main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // set the value of completed to true
            completed: true
          }
    },{
        // sort by most recently added
        sort: {_id: -1},
        // when set to true, if the document does not already exist, it will be created
        upsert: false
    })
    .then(result => {
        // log that it has been completed
        console.log('Marked Complete')
        // respond that it has been completed
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    // update item in database which matches the main.js request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
        // marks item as uncomplete
            completed: false
          }
    },{
        // sorts it by most recently added
        sort: {_id: -1},
        // when set to true, if the document does not already exist, it will be created
        upsert: false
    })
    .then(result => {
        // respond when it has been successful 
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    // go to our DB and delete an item which has a thing value that matches our request from main.js
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // sends response to say it has been deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

//decides whether to use the port chosen in this file or by the hosting platform e.g. Cyclic/Heroku. Console logs when the server is running
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})