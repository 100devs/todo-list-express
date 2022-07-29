//MODULES
const express = require('express') //requires express be imported into Node
const app = express() //create Express application 
const MongoClient = require('mongodb').MongoClient //requires import MongoClient
const PORT = 2121 //set port (currently local port 2121)
require('dotenv').config() //import and enable env key (to hide keys)


let db, //create database variable
    dbConnectionStr = process.env.DB_STRING, //set db connection string equal to address provided by MongoDB
    dbName = 'todo' //set db name

    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to db
    .then(client => { //if connected
        console.log(`Connected to ${dbName} Database`) //log connection
        db = client.db(dbName) //set db to client db
    })
    
    //MIDDLEWARE
app.set('view engine', 'ejs') //set view (template) engine to ejs (embedded JavaScript) commands
app.use(express.static('public')) //tells app to use a folder named 'public' for all static files (imgs, css)
app.use(express.urlencoded({ extended: true })) //call to middleweare that cleans up how things are displayed and how our server communicates with our client (similar to useUnifiedTopology above)
app.use(express.json()) //tells the app to use express's json method to take the object and turn it into a json string

//ROUTES
app.get('/',async (request, response)=>{ //get request to root to get stuff to display to users in an async function
    const todoItems = await db.collection('todos').find().toArray() //get all todo items from the db and hold in variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //get number of incomplete items from db and store in itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render index.ejs with todo items and number of incomplete items

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
    //adds item to database via rout /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //server will go into our collection called todos. inserts one "thing" named todoItem with a status of completeed or completed false
    .then(result => {
        console.log('Todo Added') //print "todo added" console
        response.redirect('/') //refeshes ejs page to show newly added item
    })
    .catch(error => console.error(error)) //if shit went sideways, print error to console
})


// UPDATE when clicked on client side
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //going into todo collection
        $set: {
            completed: true //marking the item to completed or 'true' in the collection
          }
    },{
        sort: {_id: -1}, //once completed, takes from to-do list and adds to the completed list? maybe
        upsert: false //doesnt create a document for the todo if the item isn't found
    })
    .then(result => { //assuming ok and got a result
        console.log('Marked Complete') //logs complete to console
        response.json('Marked Complete') //returns response of marked complete to main.js
    })
    .catch(error => console.error(error)) //if something broke, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => { //unmarks something that was marked as complete --takes away complete status and adds number back into "todo count"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //in the todos collection, looks for itemFromJS and updates it
        $set: {
            completed: false //opposite of upsert, marks as undone
          }
    },{
        sort: {_id: -1}, //sorting in descending order
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //console log 'marked complete'
        response.json('Marked Complete') //returns response of 'marked complete' to fetch in main.js
    })
    .catch(error => console.error(error))//if something broke, error is logged

})

// DELETE
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //serches collection for matching item. uses deleteOne method to remove it
    .then(result => {
        //logging the confirmed deletion to the console
        console.log('Todo Deleted')
        // responding to the main.js deleteItem request which it's awaiting
        response.json('Todo Deleted') //returns response of tod deleted to the fetch in main.js
    })
    .catch(error => console.error(error)) //if didn't work, logs an error

})

//tells server to to listen for connections on PORT defined earlier, or process.env.PORT from the hosting site
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})