const express = require('express') //defining variable to use express in server.js
const app = express() //initiating express app, allows you to use variable name app
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods assosiated with MongoClient and talk to our DB 
const PORT = 2121 //setting a constant to define the location where out server will be listening.
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declaring a variable called db but not assigning a value - globally to use multiple places
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigns our database connection string to it.
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongoDB and passing in our connection string. Also passing in an additional property.
    .then(client => { // waiting for the connection and proceeding if successful, and passing in the client information.
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal, connected to the "todo Database". 
        db = client.db(dbName) //assigning a value to a previously declared db variable that contains a db client factory method.
    })//closes our .then()


//MIDDLEWARE - helps open the communication channels for our requests
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) //parses JSON content from incoming requests



app.get('/', async (request, response) => { // defines a GET method when the root route is passed in, sets up req and res parameters.
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closes GET method



app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into 'todos' collection, gives it a completed value of false by default.  
    .then(result => { //if insert is successfull, do something
        console.log('Todo Added') //console log action
        response.redirect('/') // gets rid of the /addtodo route and redirects back to the homepage
    }) //closes the .then()
    .catch(error => console.error(error))// catches any errors
}) //closes POST method


//defined a PUT request at /markComplete endpoint, used to update a document
app.put('/markComplete', (request, response) => {

    //updates a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the completed key to true (in our ejs, will add a class "completed" in the span)
            completed: true
          }
    },{
        // method specifies the order in which the quert returns the match documents from the given collection
        sort: {_id: -1},
        // makes sure a new document isn't created if the document isn't found in our DB
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // respond with json indicatin the marking is complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the completed key to true (in our ejs, will add a class "completed" to the span) 
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})


//adds a DELETE request to /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    //delete document from todos collection that has the thing key's value as the document passed to the request.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})