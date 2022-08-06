const express = require('express')
//Declare a variable that requires express
const app = express()
//Declare a variable that calls express - easier/cleaner access to express methods
const MongoClient = require('mongodb').MongoClient
//Declare a variable that requires MongoDB NodeJS package
const PORT = 2121
//Declare the port that we'll be using to connect to the server
require('dotenv').config()
//Require dotenv module (hide environment variables)

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Declare database variables - allow us to connect to database


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //Connecting to database using database variables
    //Waiting for response from connecting to MongoDB, then console.logging that we are connected to the DB
    //reassigning "db" variable to the database that we called above
    
app.set('view engine', 'ejs')
//Allows ejs, create views folder
app.use(express.static('public'))
//Allows use of public folder
app.use(express.urlencoded({ extended: true }))
//Makes handling URLs easier
app.use(express.json())
//Makes sure that responses are in json


app.get('/',async (request, response)=>{
    //"READ" from root directory, call async function
    const todoItems = await db.collection('todos').find().toArray()
    //Fetching db.collection, turns everything into an array to be able to be rendered
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Go through collection, count documents that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //Renders response in index.ejs template

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})



app.post('/addTodo', (request, response) => {
    //"CREATE" - reads /addTodo path
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //take todos, insertone document into the collection
    //request.body matches the name specified in the  form element
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //Confirm that entry is added. 'Refreshing' by reloading root
    .catch(error => console.error(error))
    //Error handling
})

app.put('/markComplete', (request, response) => {
    //"UPDATE", following /markComplete path (From main.js) - for completed 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //take todos from collection and update json
        $set: {
            completed: true
          }
          //MongoDB change completed to true in the individual document
    },{
        sort: {_id: -1},
        upsert: false
    })
    //Not inserting a new record, updating a current one
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //Logging completion of update
    .catch(error => console.error(error))
    //Error handling

})

app.put('/markUnComplete', (request, response) => {
      //"UPDATE", following /markUnComplete path (from main.js) - for UNcompleted 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //take todos collection, update json 
        $set: {
            completed: false
          }
          //MongoDB change completed to false in the individual document
    },{
        sort: {_id: -1},
        upsert: false
    })
     //Not inserting a new record, updating a current one
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
      //Logging completion of update
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Take todos collection and delete the json object that matches the request specifications
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //confirm completion
    .catch(error => console.error(error))
 //Error handling
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
//Listen on specified port, or use what Heroku wants to use