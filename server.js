const express = require('express') // importing express to this file - Making possible to use it here.
const app = express() // Setting a variable app, and assigns it to an instance of express
const MongoClient = require('mongodb').MongoClient // allows us to 'speak' with the database using specific methods from the MongoClient
const PORT = 2121 //Setting a const location for the server to listen
require('dotenv').config() // Allows the usage of variables in the .env file

//Initialize  DB connection string
let db, // declaring db variable
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning it out dbstring
    dbName = 'todo' // declaring a variable and setting the name of our database


// Connects the client to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connecting to MongoDB  passing in our connection string and an additional prop 
    .then(client => {  // MongoClient returns a promise so we wait for the connection and proceed if sucessful
        console.log(`Connected to ${dbName} Database`) // logs this template literal to the console //
        db = client.db(dbName) // assign a value to the db variable, containing the database factory method
    })

  
// MIDDLEWARE 
app.set('view engine', 'ejs') // Sets the HTML templating language, in this case it's EJS 
app.use(express.static('public')) // Tells app the location static files such as js and css files in the public directory
app.use(express.urlencoded({ extended: true })) // Allows app recognize the incoming Request Object as strings or arrays
app.use(express.json()) //Allows app to recognize the incoming Reque st Object as a JSON Object.



app.get('/',async (request, response)=>{ // // Creates the READ request when the 'path '/' is passed in, also sets request and response params 
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits, finds the db collection with the name 'todos' and passes all the found items to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits, finds the todos collectiong, and counts the number of elements with the complete property false 
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

app.post('/addTodo', (request, response) => { // Starts a POST method as /addTodo route is passed sets a req and res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // 
    .then(result => { 
        console.log('Todo Added') 
        response.redirect('/')// redirects to the path '/'
    })
    .catch(error => console.error(error)) // if the connection fails, console the error
})

app.put('/markComplete', (request, response) => {// Creates an UPDATE method as /markComplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes to the db collection and updates the specific item that was clicked
        $set: {
            completed: true // Sets the completed value to true
          }
    },{
        sort: {_id: -1}, // sorts in descending order
        upsert: false // upsert if true, if the value we passed in didn't exist it would be created, in this case this would never happen as we are clicking and not inserting, however is still good practice to set it to false
    })
    .then(result => { // when the response is delievered
        console.log('Marked Complete') // console logs marked complete
        response.json('Marked Complete') // creates a json response 
    })
    .catch(error => console.error(error)) // catches error

})


// This block does the same as the previous one, but it sets the completed value to false 
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

// 
app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the /deleteItem route is passed in, sets req res as params
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // gets a specific item from the db and deletes it
    .then(result => {
        console.log('Todo Deleted') // logs 'Todo Deleted'
        response.json('Todo Deleted')// Sends a response back to the sender
    })
    .catch(error => console.error(error)) // Catches and consoles errors

})

app.listen(process.env.PORT || PORT, ()=>{ // Tells the app which ports to listen to
    console.log(`Server running on port ${PORT}`) // logs if server is sucessfully runnning
})