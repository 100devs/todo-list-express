//Import the express module (after npm install)
const express = require('express')
//Declare variable to create the express application to use in routing below
const app = express()
//Import the mongo client (after npm install)
const MongoClient = require('mongodb').MongoClient
//Declare a local port
const PORT = 2121
//Imports and configures .env
require('dotenv').config()

//variable for the database
let db,
    //variable to hold the database string in the .env file
    dbConnectionStr = process.env.DB_STRING,
    //name of the specific database collection
    dbName = 'todo'

//Connects to MongoDb with the db string (basically the PW);
//Set useUnifiedTopology to true everytime
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //response from MongoDb
    .then(client => {
        //Confirms connection to collection
        console.log(`Connected to ${dbName} Database`)
        //Assign db variable the collection in the database
        db = client.db(dbName)
    })

 //Middleware   
 //Sets the template model as ejs   
app.set('view engine', 'ejs')
//Gives express access to the public folder
app.use(express.static('public'))
//Parse incoming requests with url encoded payloads
app.use(express.urlencoded({ extended: true }))
//Parse incoming json requests
app.use(express.json())

//Fetching data from database and renders it to the DOM
app.get('/',async (request, response)=>{
    //Set variable to find all to do todo items from the database and put in an array
    const todoItems = await db.collection('todos').find().toArray()
    //Set variable to return a count of uncompleted items in the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Renders that information into the EJS template (tells the EJS how to render info from database)
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//Send data to the database to create a todo item
app.post('/addTodo', (request, response) => {
    //Inserts uncompleted todo list item to database from user input in form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //Response from MongoDB
    .then(result => {
        //Logs that To Do was added to console
        console.log('Todo Added')
        //Redirects the DOM to index.ejs
        response.redirect('/')
    })
    //If the post fails, console logs the error.
    .catch(error => console.error(error))
})

//Update data when marked with complete in DOM
app.put('/markComplete', (request, response) => {
    //Update item in database when completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Set operator
        $set: {
            //Replace the value of the completed field with true
            completed: true
        }
    },{
        //Sorts items in descending order
        sort: {_id: -1},
        //Combination of update and insert: do not upsert
        upsert: false
    })
    //Response from MongoDB
    .then(result => {
        //Logs 'Marked Complete' to the console
        console.log('Marked Complete')
        //Returns a JSON object with "Marked Complete"
        response.json('Marked Complete')
    })
    //If the put fails, console logs the error
    .catch(error => console.error(error))

})

//Update data when marked as uncomplete
app.put('/markUnComplete', (request, response) => {
    //Update data in database when marked as incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Set operator
        $set: {
            //Replace the value of the completed field with false
            completed: false
          }
    },{
        //Sorts items in decending order
        sort: {_id: -1},
        //Always upsert false
        upsert: false
    })
    //Response from database
    .then(result => {
        // Console log to show status (should be uncomplete?)
        console.log('Marked Complete')
        //JSON object for uncomplete? is typo?
        response.json('Marked Complete')
    })
    //Returns error in the console
    .catch(error => console.error(error))

})

//Deletes one from database
app.delete('/deleteItem', (request, response) => {
    //Delete one item from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Response from mongodb
    .then(result => {
        //Console logs delet
        console.log('Todo Deleted')
        //JSON object to log deleted item
        response.json('Todo Deleted')
    })
    //Console logs if error
    .catch(error => console.error(error))

})

//Sets port for web server to listen on (heroku postman or local)
app.listen(process.env.PORT || PORT, ()=>{
    // console logs if the server is running on the port
    console.log(`Server running on port ${PORT}`)
})