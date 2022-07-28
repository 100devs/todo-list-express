const express = require('express') // requires that the express is imported to node
const app = express() //creates an express app 
const MongoClient = require('mongodb').MongoClient // require that mongoclient library is imported
const PORT = 3000 //sets my local port to 3000
require('dotenv').config() // enables to bring in hidden environment variables - go to .gitignore


let db, // creates database 
    dbConnectionStr = process.env.DB_STRING, //sets dbConnectionString equal to address provided by mongo (.env config file)
    dbName = 'todo' // 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//defines how we conneect to mongo, and unified topology helps ensure things are returned properly
        .then(client => {  // this get called when the promise is fulfilled
        console.log(`Connected to ${dbName} Database`) //if this console log, we have successfully connected to the db
        db = client.db(dbName) //defines the 'todo' database 
    })  // .connect RETURNS A PROMISE IF NO CALLBACK IS SPECIFIED

    //Middlewares 

app.set('view engine', 'ejs') //sets the template engine we'll use, ejs 
app.use(express.static('public')) // tells the app to use a folder public for static files
app.use(express.urlencoded({ extended: true })) //  recognizes the incoming request object as strings or arrays
app.use(express.json()) // it recognizes the incoming object as a JSON Object 

//READ  - GET 

app.get('/',async (request, response)=>{ // GET the following to display to users on the client side
    const todoItems = await db.collection('todos').find().toArray() // creates var todoItems which goes to the db, 
    //create a collection called "todos", find anything in the db and turn it into an array of objects
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //creates var itemsLeft, goes to the db, looks at "todos" collection and counts the number of docs which have completed
    //status of false. AKA counting how many things aren't completed; what's left to do? 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sends response that renders the number of docs
    //in collection and the number of items left (those which don't have "true" for "completed")

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//CREATE - POST

app.post('/addTodo', (request, response) => { //adds items to the db via route/addTodo
    db.collection('todos') //server goes to the collection "todos"
    .insertOne({thing: request.body.todoItem, completed: false}) //inserts one "thing" named todoItem with a status of 
    // "completed" set to false
    .then(result => { //if the promise is fulfilled
        console.log('Todo Added') // loggs "Todo Added"
        response.redirect('/') // refreshes the page to show new thing it's been added to the db
    })
    .catch(error => console.error(error)) //if we're unable to add to db, we will see an error in the console
})

//UPDATE -- PUT 

app.put('/markComplete', (request, response) => { // updates items in the db via /markComplete
    db.collection('todos') // goes to the collection
    .updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            completed: true
          }
           // sets status of "completed" equal to true to an item in the collection
    },{
        sort: {_id: -1}, //once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false //doesn't create anything if the item isn't found 
        // 
    })
    .then(result => { //if a promise is fullfilled, it will.. 
        console.log('Marked Complete') // console log Marked complete
        response.json('Marked Complete') //returns response of Marked complete to the fetch in main.js
    })
    .catch(error => console.error(error)) //if something's wrong, an error is logged to the console 

})

app.put('/markUnComplete', (request, response) => {
    //this route unmarks a completed thing, takes its completed status away
    db.collection('todos') //go to "todos" colleection
    .updateOne({thing: request.body.itemFromJS},{
        //look for item from itemFromJS
        $set: {
            completed: false //changes completed status to "false"
          }
    },{
        sort: {_id: -1}, //once something has been completed, it sorts it by descending order by id
        upsert: false //if the item isn't found, doesn't create a document
    })
    .then(result => {
        console.log('Marked Complete') //console logs "Marked Complete"
        response.json('Marked Complete') //returns response of "Marked Complete" to the fetch in main.js
    })
    .catch(error => console.error(error)) //if something breaks, it console logs error

})

//DELETE - DELETEY :) 
app.delete('/deleteItem', (request, response) => { 
    db.collection('todos') //goes into the collection "todos"
    .deleteOne({thing: request.body.itemFromJS}) // uses deleteOne method and find a thing that matches the name of the thing you clicked on

    .then(result => { //if the promise is fullfilled
        console.log('Todo Deleted') // it console logs "todo deleted"
        response.json('Todo Deleted')// returns reponse of "todo deleted" to the fetch in main.js
    })
    .catch(error => console.error(error)) //if something goes wrong, the error is catched and console logged 

})

app.listen(process.env.PORT || PORT, ()=>{ //tells our server to listen for connections on  the PORT we defined as 
    //a constant earlierr OR process env will tell the server to listeen  on the port of the app (eg PORT used by heroku)
    console.log(`Server running on port ${PORT}`) //console log the port numberr or server is running on
})