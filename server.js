const express = require('express') 
//requiring the express package to be installed, gives access to express methods
const app = express() 
//assigning express call to a variable for quick use
const MongoClient = require('mongodb').MongoClient
//requiring the MongoDB client be installed, gives access to mongoDB methods
const PORT = 2121 //declare port
require('dotenv').config() //alows use of the env files


let db,
    dbConnectionStr = process.env.DB_STRING,
    //databse connection string from env files
    dbName = 'todo' //assign name of database

//connects to the mongo client
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { 
        console.log(`Connected to ${dbName} Database`)
        //if connects sucessfully, console log the connection
        db = client.db(dbName) 
        //storing the databse in a variable
    })

    //setting up middleware
app.set('view engine', 'ejs') //render ejs for the client side
app.use(express.static('public')) //serve all files in the public folder
app.use(express.urlencoded({ extended: true }))
//middleware for parsing bodies from URL
app.use(express.json()) //parses incoming json requests


app.get('/',async (request, response)=>{ //get root / default root
    const todoItems = await db.collection('todos').find().toArray()
    //storing an array of objects in a const
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts how many docs have been created and adds them to "todo" collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //responding with ejs, renders objects on screen
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create a to do item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //pulls an item from the form in the ejs, inserts in document, defaults not complete, so no strikethrough
    .then(result => { //if insertion succeeds
        console.log('Todo Added') //logs the todo item added
        response.redirect('/') //redirects to root page
    })
    .catch(error => console.error(error)) //catch error if inserting todo item fails
})

app.put('/markComplete', (request, response) => { //request to mark as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the item the user clicked
        $set: {
            completed: true //sets completed property to true
          }
    },{
        sort: {_id: -1},
        upsert: false //do not create a document if you cant find it
    })
    .then(result => { //if update succesfull, log the update
        console.log('Marked Complete')
        response.json('Marked Complete') //responds with marked complete to main.js
    })
    .catch(error => console.error(error)) //catch error

})

app.put('/markUnComplete', (request, response) => { //request to mark as uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the item the user clicked
        $set: {
            completed: false //sets completed property to false
          }
    },{
        sort: {_id: -1},
        upsert: false //do not create a document if you cant find it
    })
    .then(result => { //if update succesfull, log the update
        console.log('Marked Complete')
        response.json('Marked Complete') //responds with marked complete to main.js, a typo! should be uncomplete
    })
    .catch(error => console.error(error)) //catch error


})

app.delete('/deleteItem', (request, response) => { //request to delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find the item the user clicked
    .then(result => { //if delete sucesful, log it
        console.log('Todo Deleted')
        response.json('Todo Deleted') //responds with deleted to main.js
    })
    .catch(error => console.error(error)) //catch error

})

app.listen(process.env.PORT || PORT, ()=>{ //listens for local port or environment file
    console.log(`Server running on port ${PORT}`) //log the server running on PORT
})