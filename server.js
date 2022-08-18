
// calling the necessary modules needed for the full-stack app 
const express = require('express') // helps you makes it easier to run http methods - making it possible to use express (which is downloaded as a dependency) in this file 
const app = express() // created an app variable so that you don't have to call express() constantly - assigning to the instance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated w/ MongoClient and talk to our DB; needed in order to connect to mongodb
const PORT = 2121 // created the port constant where you can access your local server (where our server will be listening)- location of the PORT - global variable
require('dotenv').config() // allows us to look for variables inside of the .env file - you need the dotenv in order to create .env file to hold your secrets

let db, // declares db as a variable but not assigning value; declaring it globally so that we can use it anywhere 
    dbConnectionStr = process.env.DB_STRING,  // declare fb and assign DB string (which should be secure in your .env file)
    dbName = 'todo' // declare another variable - this is the name of the database on the mongodb 
// declaring variables related to the database 


// connect the local server to the mongo database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB and passing in our connection string and also passing in additional property 
    .then(client => { // if connection is successful - MongoClient.connect establishes a promise => we can chain things in sequence (we are WAITING b/c we only want to proceed if the previous step is successful
        // we are also passing in all the client information 
        console.log(`Connected to ${dbName} Database`) // if the connection is successful - log success message on console 
        db = client.db(dbName) // assigning info that contains db client factory method  to db variable; 
    }) // closing tag of the MongoClient connect method 


//middleware 
app.set('view engine', 'ejs') // sets the view engine as EJS  - this is our render method default 
app.use(express.static('public')) // sets the location for static assets (plain HTML, stylesheet, client side javascript)
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. supports arrays and objects. 
app.use(express.json()) // helps us parse JSON (replaces body praser )


app.get('/',async (request, response)=>{ // get (READ) function of CRUD - the route is the main root and it sets up request and response parameters 
    const todoItems = await db.collection('todos').find().toArray()         //variable awaits for information information of  all the documents from the database collection 'todos' into arrays 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})          //constant that waits for the count (number) of documents that have completed:false info within the database, 'todos' collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the responsed info into index.ejs template - passing items and left objects info 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })                                   // this is same action but different syntax (without the await/async function)
    // .catch(error => console.error(error))
}) // closing tag of the app.get method 

app.post('/addTodo', (request, response) => { // post method with route of '/addTodo' 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // you go into db collection 'todos' and inserting one document that contains thing and completed key-value pairs. request.body.todoItem is from the client-side javascript form 
    .then(result => { // if insertOne is successful, this method is initiated 
        console.log('Todo Added') // logs 'added' message on the console. 
        response.redirect('/') // we are refreshing the root route in order for the new info to be loaded (we don't want to stay in /addTodo ROUTE)
    }) // closing .then 
    .catch(error => console.error(error)) // if insertOne is not successful, catch and log the error 
}) // closing tag of the app.post method 

app.put('/markComplete', (request, response) => { // put method with route of '/markComplete' 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // we are going into database collection todos and updating one document: the match query is the key-value of THING (task name)
        $set: { // you find the right document and you are setting/updating 
            completed: true // the task as true 
          } // closing tag for updating/setting 
    },{ // closing and opening tag 
        sort: {_id: -1}, // moves the item to the bottom of the list 
        upsert: false // upsert - if true: if the value did not exist, it will insert in the db for us 
    }) // closing tag of the updateOne method 
    .then(result => { // if updating was successful, run this 
        console.log('Marked Complete') // logs message on console if the previous step is complete 
        response.json('Marked Complete') // also sends the message back to the response in JSON format 
    }) // closing tag of then 
    .catch(error => console.error(error))  // catch error if method did not go through 

}) // closing tag of the app.put method 
 
app.put('/markUnComplete', (request, response) => { // put method with route of '/markUnComplete' 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // we are going into database collection todos and updating one document: the match query is the key-value of THING (task name)
        $set: { // sets the document and updates it as not completed; 
            completed: false
          }
    },{ 
        sort: {_id: -1}, // moves the item to the bottom of the list 
        upsert: false // upsert - if true: if the value did not exist, it will insert in the db for us 
    }) // close tag of updateOne Method 
    .then(result => { // if updateOne method is successful 
        console.log('Marked Complete') // log 'marked complete' on console 
        response.json('Marked Complete') // return the message as a response in JSON format 
    }) // close tag of .then 
    .catch(error => console.error(error)) // catch error if method did not go through 

}) // closing tag of the app.put method 

app.delete('/deleteItem', (request, response) => { // delete method with route of '/deleteItem' 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // you go into todos collectino of your database and delete one document (match query is also passed - grabbed from client side javascript) 
    .then(result => { // if deleting document went through  
        console.log('Todo Deleted') // log the message on console 
        response.json('Todo Deleted') // also returning the response in json back to the client-side 
    })
    .catch(error => console.error(error)) // catch error if method did not go through 

}) // closing tag of the app.delete method 

app.listen(process.env.PORT || PORT, ()=>{ // it sets up which PORT we will be listening on either on the PORT from the .env file  or the PORT we chose at the top of this file 
    console.log(`Server running on port ${PORT}`) // if the server is live, there is a log on console that tells us it is successful. 
}) // closing tag of the app.listen method 