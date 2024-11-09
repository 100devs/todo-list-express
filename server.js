//imports express framework 
const express = require('express') 
const app = express()

//imports MongoDB module
const MongoClient = require('mongodb').MongoClient 

//hardcode port to local server
const PORT = 2121 

// loads environmental variables from a .env file. Allows secret keys to be stored in .env file
require('dotenv').config() 

// declares variables needed to connect to MongoDB, including the connection string (in .env file as "DB_String") and database name
let db,
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'todo' //MongoDB database name

//connects to MongoDB using connection string and console logs result.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// sets template engine to EJS  
app.set('view engine', 'ejs') 

//sets route for static files (CSS and JS). files stored in 'public' folder
app.use(express.static('public')) 

//will parse information from post and put requests
app.use(express.urlencoded({ extended: true })) 

// parses JSON data from request body and stores it in req.body
app.use(express.json()) 

//listen for request on homepage
app.get('/',async (request, response)=>{ 
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //finds all documents in the todo collection and put the documents into an array.
    db.collection('todos').find().toArray()  

     //the array will be held in the variable 'data'
    .then(data => { 
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            //pass the data (array) into the ejs template. The data is given the name of items.
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
     
})

//listens for post request from form with route '/addTodo'
app.post('/addTodo', (request, response) => {

    //parses information in form, creates new database document, prints result, refreshes page, and catches errors
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Listens for put request with the route of '/markComplete'
app.put('/markComplete', (request, response) => {

    //updates database document that matches the text in itemFromJs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{

          //updates completed property to true
        $set: {
            completed: true
          }
    },{
        //sorts completed list items to the bottom of the list
        sort: {_id: -1},

        //sets upsert to false -- meaning no new document will be created if document isn't found
        upsert: false
    })

    //respond to client side request and print result to the console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Listens for put request with the route of '/markUnComplete'
app.put('/markUnComplete', (request, response) => {

    //update database document that matches the text in itemFromJs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{

         //updates completed property to false
        $set: {
            completed: false
          }
    },{
        //sorts completed list items to the bottom of the list
        sort: {_id: -1},

        //sets upsert to false -- meaning no new document will be created if document isn't found
        upsert: false
    })

    //respond to client side request and print result to the console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


//Listens for delete request with the route of '/deleteItem'
app.delete('/deleteItem', (request, response) => {

    //deletes document that matches text in itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})

    //respond to client side request and print result to the console
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


//access port from environment variable or from port 2121 and print result to the console.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})