// Import express
const express = require('express') //invoking express
// assign the express function to the app variable
const app = express()
// import MongoDB and assign it to the MongoClient class so we can use some methods associated with it to communicate with the database
const MongoClient = require('mongodb').MongoClient
// assign a port number to "PORT"
const PORT = 2121 //this sets the constant port location where our server will be listening
// import the dotenv environment
require('dotenv').config()//this allows communication with contents in the .env file


//database connection
let db, //declaring a variable db
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning a database connection string to it
    
    dbName = 'todo'// Assign a name to the database

// connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// creating a connection thru mongodb and passing in our connection string. Also passing in additional property.
    
    .then(client => {//waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal "connecting to todo Database"
        db = client.db(dbName)//assigning a value to the variable db that contains the db client factory method
    })
    
// middlewares

app.set('view engine', 'ejs')// this connects to the index.ejs and sets it as the default for render in web page
app.use(express.static('public'))//this connects all static files eg css and javascript files
// middleware that replaces body parser
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs automatically. The extended:true supports arrays and objects
app.use(express.json())// this ensures we can work with json files in express


//get request
app.get('/',async (request, response)=>{
    // this is the syntax for finding all the items in the database (check documentation)
    const todoItems = await db.collection('todos').find().toArray()//sets a variable that awaits all items from the todo collection.
    // assign the result to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS.
    // render ejs on the DOM
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs file and passing through the db items and the count of remaining items


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// post request
app.post('/addTodo', (request, response) => {//starts a POST method when the addTodo route is passed in.
    // this is the syntax for posting items (post request) from form on to  the database (check documentation) using the "insertOne". "todoItem" is the name of the input of the form in the index.ejs. Default status for the task is false 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//this gets the content from the input element with name:todoItem in the ejs file. Completed is false by default as new tasks cannot be completed 
    
    .then(result => {//if insert is successful, run the callback
        console.log('Todo Added')//log "Todo Added" in the console
        response.redirect('/')//redirects you back to the homepage after submitting a post request
    })
    // if promise isn't fulfilled, display the error messages in the console
    .catch(error => console.error(error))//catches errors
})

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in
    // this put request modifies a single entry at a time
    db.collection('todos').updateOne(
        // this is the selected item after the click event in main.js
        {
        thing: request.body.itemFromJS //look in the db for one item matching the name of the item passed in the main.js file
    },  
    
        {
        $set: {
            completed: true // this is the action taken after the click event is executed in main.js changing the boolean completed to true
          }
    },
        {
        sort: {_id: -1}, //moves item to the bottom of the list ie sorting in descending order
        upsert: false //prevents insertion if item does not already exist
    })
    
    .then(result => {//if insert is successful, run the callback
        console.log('Marked Complete') //logs success in the console
        response.json('Marked Complete')//resending a response back to the sender
    })
    // if promise isn't fulfilled, display the error messages in the console
    .catch(error => console.error(error))//catching errors

})

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    // this put request modifies a single entry at a time
    db.collection('todos').updateOne(
        // this is the selected item after the click event in main.js
        {thing: request.body.itemFromJS},//look in the db for one item matching the name of the item passed in the main.js file
        // this is the action taken after the click event is executed in main.js changing the boolean completed from true to false
        {
        $set: {
            completed: false // this is the action taken after the click event is executed in main.js changing the boolean completed to true
          }
    },
    {
        sort: {_id: -1},//moves item to the bottom of the list ie sorting in descending order
        upsert: false //prevents insertion if item does not already exist
    })
   
    .then(result => {//if insert is successful, run the callback
        console.log('Marked UnComplete')//logs success in the console
        response.json('Marked UnComplete')//resending a response back to the sender
    })
    // if promise isn't fulfilled, display the error messages in the console
    .catch(error => console.error(error))//catching errors

})

//Express method that responds to the delete method
app.delete('/deleteItem', (request, response) => {
    // This delete request deletes a single entry at a time.
    db.collection('todos').deleteOne(
        //Express method that responds to the delete method.  This is the selected item after the click event in main.js
        {thing: request.body.itemFromJS}) //look in the db for one item matching the name of the item passed in the main.js file

    
    .then(result => {//if insert is successful, run the callback
        console.log('Todo Deleted')//logs success in the console
        response.json('Todo Deleted')//resending a response back to the sender
    })
    // if promise isn't fulfilled, display the error messages in the console
    .catch(error => console.error(error))//catching errors

})

// connect to the port
app.listen(process.env.PORT || PORT, ()=>{//specifi=ying which port we will be listening on. Either the port in the .env file OR the initialized PORT variable
    console.log(`Server running on port ${PORT}`) //console.log running port
})//End the listen method