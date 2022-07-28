//importing express to make it possible to use express in this file
const express = require('express')
//declaring variable app that cannot be reassigned - the instance of express is assigned to the variable
const app = express()
//importing MongoClient to make it possible to use mongodb in this file - MongoClient allows us to communicate with mongodb using MongoClient methods
const MongoClient = require('mongodb').MongoClient
//declaring variable PORT that cannot be reassigned - sets the location of the port
const PORT = 2121
//importing and configuring dotenv to make it possible to reference the variables within our .env file in this file
require('dotenv').config()

//declaring a global variable that can be reassigned and not assigning a value
let db,
    //declaring a variable that can be reassigned and assigning our database connection string to it
    dbConnectionStr = process.env.DB_STRING,
    //declaring a variable that can be reassigned and assigning our database name to it
    dbName = 'todo'
//creating a connection to mongodb and passing in our connection string, also passing in an additional property useUnifiedTopology 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //MongoClient.connect() establishes a promise so we chain additional .then() methods - we only want to do what's inside the .then() method if the database connection is successful - waiting for the connection and proceeding if successful AND passing in all client information
    .then(client => {
        //logging successful connection to the console with the name of the database as a template literal - "connected to todo Database"
        console.log(`Connected to ${dbName} Database`)
        //assigning the value of the db variable to the db client factory method
        db = client.db(dbName)
    //closing .then() method
    })

//middlewares
//anything that is going to be rendered will be in ejs (sets the default render method)
app.set('view engine', 'ejs')
//setting the location of the default folder for static assets
app.use(express.static('public'))
//telling express to decode and encode urls where the header matches the content, extended part supports arrays and objects (larger nested type things)
app.use(express.urlencoded({ extended: true }))
//helping us parse json content from incoming requests
app.use(express.json())

//starting a GET (read) method when the root route is passed in, sets up req and res parameters
app.get('/',async (request, response)=>{
    //declares a variable that cannot be reassigned and awaits ALL items from the todos database collection 
    const todoItems = await db.collection('todos').find().toArray()
    //declares a variable that cannot be reassigned and awaits a COUNT of items from the todos database collection where the property completed has a value of false
    //sets a variable and awaits a count of uncompleted items to later display in EJS
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //rendering the EJS file and passing through the db items and the count remaining inside of an object - items=the array that we are looping through to list things out on the page, left: the counter of incomplete tasks rendered directly in the <h2>left to do</h2>
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //the code above using promises rather than async/await

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })

    //I think that commenting out this error handling was an error on Leon's part...
    //.catch(error => console.error(error))

//closing the GET method
})

//starting a POST (write/create) method when the /addTodo route is passed in, sets up req and res parameters
app.post('/addTodo', (request, response) => {
    //inserts a new item into the todos collection, setting up an object with 2 keys-thing and completed, where the value of thing is the todoItem (form's input box with the task that has the name todoItem) and the value of completed is false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //if insert is successful, do something
    .then(result => {
        //logging action to the console
        console.log('Todo Added')
        //redirecting to the index - when we use the form to pass an action, it's actually sending us to that route in the browser (localhost:whatever/addTodo) so the last thing we need to do in the browser is go back to the index
        response.redirect('/')
    //closing the .then() method
    })
    //if the insert is not successful, log error message
    .catch(error => console.error(error))
//closing the POST method
})

//starting a PUT (update) method when the /markComplete route is passed in, sets up req and res parameters
app.put('/markComplete', (request, response) => {
    //looking in the db for one item matching the name of the item passed in from the main.js file that was clicked on and using the .updateOne() method
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //setting the item's completed status to true
        $set: {
            completed: true
          }
    },{
        //moving the item to the bottom of the list...theoretically - doesn't seem to do anything?
        sort: {_id: -1},
        //mixture of insert and update - if we set upsert:true, if the value we're looking for did not exist, it would insert it => that's not what we want because we're always going to be clicking on something that already exists to complete it...theoretically
        //prevents insertion if item does not already exist
        upsert: false
    })
    //starting a then if update was successful
    .then(result => {
        //logging successful completion message to the console
        console.log('Marked Complete')
        //sending back JSON to the function in main.js markComplete() and gets assigned to the variable data, gets converted to a string, and logged to the console - lets us know that the action has been completed - sending a response back to the sender
        response.json('Marked Complete')
    //closing .then() method    
    })
    //if the update was not successful, log error message
    .catch(error => console.error(error))
//closing the PUT method
})

//starting a PUT (update) method when the /markUnComplete route is passed in, sets up req and res parameters
app.put('/markUnComplete', (request, response) => {
    //looking in the db for one item matching the name of the item passed in from the main.js file that was clicked on and using the .updateOne() method
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //setting the completed status of that item to false
        $set: {
            completed: false
          }
    },{
        //theoretically moving item to the bottom of the list although it doesn't seem to matter...
        sort: {_id: -1},
        //preventing insertion if the item doesn't already exist
        upsert: false
    })
    //starting a .then() if the update was successful
    .then(result => {
        //logging completion to the console
        console.log('Marked Complete') //this seems like an error, leon... should be marked UNcomplete
        //sending a response back to the sender
        response.json('Marked Complete') //this seems like an error, leon...should be marked UNcomplete
    //closing .then() method
    })
    //if the update was not successful, log error message
    .catch(error => console.error(error))
//closing the PUT method
})

//starting a DELETE method when the /deleteItem route is passed in, sets up the request and response parameters
app.delete('/deleteItem', (request, response) => {
      //looking in the db for one item matching the name of the item passed in from the main.js file that was clicked on and using the .deleteOne method 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //starting a .then() if the deletion was successful
    .then(result => {
        //logging the successful delete to the console
        console.log('Todo Deleted')
        //sending a response back to the sender
        response.json('Todo Deleted')
    //closing .then() method
    })
    //if the delete was not successful, log error message
    .catch(error => console.error(error))
//closing the DELETE method
})

//specifying which port we will be listening on - either gets the port from the .env file if that exists or gets the port from the variable PORT where we assigned the value in server.js
app.listen(process.env.PORT || PORT, ()=>{
    //log message to the console that the server is successfully running on port with template literal
    console.log(`Server running on port ${PORT}`)
//close the app.listen() method
})