// load in express module and assign to variable
const express = require('express')
// run the express module and assign to variable
const app = express()
// load in mongodb module and create new client instance
const MongoClient = require('mongodb').MongoClient
// The port we listen to
const PORT = 2121
// allows us to use environment variables in .env file (such as server connection string)
require('dotenv').config()

//Creates the variables to access the mongoDB database.
// db will become the variable for the database
let db,
// dbConnection string is our connection string to the mongo database
    dbConnectionStr = process.env.DB_STRING,
    // the database name is dbName
    dbName = 'todo'
//Connects the user to the backend database with the connection string and outputs it to the console. 
//First connect to the database,
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Tells express which template engine to use to build out the html file before it is sent to the client/user. 
app.set('view engine', 'ejs')
// tells express which folder to use when serving static files such as CSS/images/JS
app.use(express.static('public'))
// Tells the post request to send it as an object
app.use(express.urlencoded({ extended: true }))
//Converts the sent object to JSON for the server to read. 
app.use(express.json())

// runs get(READ) method, runs an async callback function which does the following:
app.get('/',async (request, response)=>{
    // creates a variable which contains an array of the results from the databse collection titled "todos"
    const todoItems = await db.collection('todos').find().toArray()
    // creates a variable containing the number of documents in the todo collection which have the parameter of "completed" as False.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Grabs the ejs file to render the above data into HTML  
        // items = list of objects in the database collection as an array
        // left = amount of incompleted objects in the database collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    //Does the same thing as above but as a promise. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// app.post is used for adding a new entry to the todo list
app.post('/addTodo', (request, response) => {
    //Gets the data from the form and sends it to the database as an object with the default completed parameter being false. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //console logs todo added if successful and redirects to the route (which is the app.get above)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //Catches and returns any errors
    .catch(error => console.error(error))
})

// runs put method to update db 
app.put('/markComplete', (request, response) => {
    // find an object in the todos collection to update
    // updateOne() has three parameters
        // thing to update
        // what to update it to
        // additional options
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set the database item to completed
        $set: {
            completed: true
          }
    },{
        // sort it in descending order in the database
        sort: {_id: -1},
        // don't create a new object if it doesn't exist
        upsert: false
    })
    .then(result => {
        //console.logs that the task was completed
        console.log('Marked Complete')
        //Sends a response to the front end (main.js) that it was marked complete
        response.json('Marked Complete')
    })
    //catches any possible errors and console.logs them
    .catch(error => console.error(error))

})

// markuncomplete does the same as above but for marking items uncomplete
app.put('/markUnComplete', (request, response) => {
    // find an object in the todos collection to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set the database item to uncompleted
        $set: {
            completed: false
          }
    },{
        // sort it in descending order in the database
        sort: {_id: -1},
        // don't create a new object if it doesn't exist
        upsert: false
    })
    .then(result => {
        //console.logs that the task was completed
        console.log('Marked Complete')
        //Sends a response to the front end (main.js) that it was marked complete
        response.json('Marked Complete')
    })
    //catches any possible errors and console.logs them
    .catch(error => console.error(error))

})

// DELETE request will delete an item in the database
app.delete('/deleteItem', (request, response) => {
    // find an object in the database with the correct "thing" value
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // confirm that the database object was deleted
        console.log('Todo Deleted')
        // send a response to the frontend user as json, stating that the item was deleted
        response.json('Todo Deleted')
    })
    // handle any errors that occur incase the database explodes or something
    .catch(error => console.error(error))

})

// listens for requests
app.listen(process.env.PORT || PORT, ()=>{
    //console log if connection successful
    console.log(`Server running on port ${PORT}`)
})