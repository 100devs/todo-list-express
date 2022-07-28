//modules
const express = require('express') //express be imported into node
const app = express() //creates an express application
const MongoClient = require('mongodb').MongoClient //requires that the mongo client library be imported
const PORT = 2121 //requires that the mongo client library be imported
require('dotenv').config() //it allows you to use the .env file contents within your server.js file //Tip - this should be in your gitignore file
// import and enable env file (to hide keys)

//DATABASE
//.env lets you set environment variables, so you can keep sensitive info. like your mongodb connection string,
//This is our private hidden environment variables. .env is for hiding important keys
//private but still use it in your application with process.env 

let db, // this is like an anddress point our databse at an address provided by mongo db. Db string is a
//place holder for a string of numbers, the address. db string will be hidden by the required configuration.
// declare unique-connection-key to db
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' // declare name of db into a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then
    
//MIDDLEWARE
app.set('view engine', 'ejs') //declaring that we're using templating engine to render ejs 
app.use(express.static('public')) // tells our app to use a folder named "public" for all of our static files
//e.g images and css files
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //tells the app to use Express's json method to take the object 
//and turn it into Json string

//Routes
app.get('/',async (request, response)=>{ //go get something to display to users on our client side, / is our main page index.ejs
    // it's doing it with an async function

    //create a const called 'todoitems's' that goes into our databse , creating a collection called todos
    // and finding anything in that database and turning it into an array of objects
    //called todo 
//OR
    // create a variable to capture an array of our documents in our colleCtion 'todos' db called
    const todoItems = await db. //creates a constant in our todos collectio
    collection('todos')//loos at dococuments in teh collection 
    .find().toArray() 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // The countdocuments methdos
    //coiutsn teh numer of documents hthat have a complted stuatus equal to 'false - you're poing
    // and counting how may to-do list items haven't been completed yet. "what is left on the agenda?"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //SENDS RESPONSE THAT RENDERS TEH NUMBER
    //OF DOCUMENTS IN OUR COLLECT AND THE NUMBER OF ITEMS LEFT-ITEMS THAT DON'T AHVE "TRUE" FOR "COMPLETED IN INDEX.JS".
//     db.collection('todos').find().toArray()
//     .then(data => {
//         db.collection('todos').countDocuments({completed: false})
//         .then(itemsLeft => {
//             response.render('index.ejs', { items: data, left: itemsLeft })
//         })
//     })
//     .catch(error => console.error(error))
// })

app.post('/addTodo', (request, response) => {
    //adding an elemnet to our databse via route. /addTodo
    db.collection('todos')
    //server will go into our collection called todos
    .insertOne({thing: request.body.todoItem, completed: false}) // insert ine thing called todoitem with a status of "completed" set to "false, ie 
    //it puts some stuff in there. bye.
    .then(result => {  //asuming thate everythng went oaky ..
        console.log('Todo Added') //print "todo added" to the console in the rele for VS code
        response.redirect('/') // refreshed index.ejs to show thte new thing we added to the databse on the page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    //update  when we click somthing on the frontend ...
    db.collection('todos') // going to go into our 'todos' collectins
    .updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // add status of completed equal to 'true' to item in our collection
          }
    },{
        sort: {_id: -1}, //once a thing has been marked as completed it takes it off the to-do list and
        //adds plus one to the completed list. sorted by completed or not. -1 means we're getting rid of it
        upsert: false //upsert will update the db if the note is found and insert a new note if not found

    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') //response.json is what is going back to our fetch in main.js

    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //this route unclicks a thing that you've marked as complete
    //will take away complete status
    db.collection('todos')//Go into todos collection
    .updateOne({thing: request.body.itemFromJS},{ //look for item from itemFromJS
        $set: {
            completed: false // undoes what we did with markcomplete. it changes 'completed'
            //status to "false"
          }
    },{
        sort: {_id: -1}, //
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //console log "marked complete"
        response.json('Marked Complete') //returns response of marked cote to fetch in main.js
    })
    .catch(error => console.error(error))

})
//request response is the other half of the async await in main.js
app.delete('/deleteItem', (request, response) => {
    //database collection requesting something from the body.
    db.collection('todos')
    //goes into your collection
    .deleteOne({thing: request.body.itemFromJS})
    //uses deleteone metod and find a thing that matche the name of the thing you clicked
    //on
    .then(result => { //assuming everyitng wehnt well ...
        console.log('Todo Deleted') //console log"to do deleted'
        response.json('Todo Deleted') //returns response fo "todo deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    //tells our server to listen for connection on the PORT we defined as a constant ealier or 
    //process.env.PORT will tell the server to listen on the port of the app
    //eg the port used by Heroku
    console.log(`Server running on port ${PORT}`) //console log the port number or serer is running on
})