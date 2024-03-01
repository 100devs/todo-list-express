//import express framework
const express = require('express')
//declare a variable 'app' and assign it to use express
const app = express()
//import MongoDb
const MongoClient = require('mongodb').MongoClient
//declare a variable 'PORT' to use port 2121
const PORT = 2121
//enable environment variable 
require('dotenv').config()

//set database connection string and name
let db,
    dbConnectionStr = process.env.DB_STRING,//variable retrieved from environment variables
    dbName = 'todo'//set name of the database

//connect to MongoDB   
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
//console log to test success or failure        
        console.log(`Connected to ${dbName} Database`)
//set db variable to connected DB        
        db = client.db(dbName)
    })

//sets view engine to ejs    
app.set('view engine', 'ejs')
//Serve files from the 'public' folder
app.use(express.static('public'))
//recognize incoming request as string
app.use(express.urlencoded({ extended: true }))
//recognize incoming requests as JSON
app.use(express.json())

//after each page refresh, a get request is intiated at the route url ('/')
app.get('/',async (request, response)=>{
//Declare a todoItems variable and assign it the items in the DB collection and parse to an array.    
    const todoItems = await db.collection('todos').find().toArray()
//Declare a itemsLeft variable and assign it the incomplete items in the DB   
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

//Render the index.ejs file as html with the incomplete items in the DB.
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


//Setup a post route for a post request-usually through a form submission
app.post('/addTodo', (request, response) => {
//Insert one item to the DB    
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    
    .then(result => {
//Console log 'Todo Added' on a succesful add        
        console.log('Todo Added')
//Refresh the page so we serve the new file with the updated items in the DB        
        response.redirect('/')
    })
//Console log any errors in the operation    
    .catch(error => console.error(error))
})
//Setup a put route for a put request-Marking items as complete/incomplete
app.put('/markComplete', (request, response) => {
//Update an item in the DB collection with the 'thing' property and 'request.body.itemFromJS' value   
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//Set completed to be true        
        $set: {
            completed: true
          }   
    },{
//sort in descending order        
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
//Console log 'Marked Complete'        
        console.log('Marked Complete')
//parse the response to JSON        
        response.json('Marked Complete')
    })
//Console log error    
    .catch(error => console.error(error))

})

// Setup a put route for a put request-Marking items as complete/incomplete
app.put('/markUnComplete', (request, response) => {
//Update an item in the DB collection with the 'thing' property and 'request.body.itemFromJS' value     
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//Set completed to be false        
        $set: {
            completed: false
          }
    },{
//sort in descending order          
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
//Console log 'Marked Complete' s/b 'Marked Uncomplete?'        
        console.log('Marked Complete')
//parse the response to JSON            
        response.json('Marked Complete')
    })
//Console log error    
    .catch(error => console.error(error))

})
//Set up delete route to delete item from DB
app.delete('/deleteItem', (request, response) => {
//delete one item from the DB collection    
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
//Console log 'Todo Deleted' when complete        
        console.log('Todo Deleted')
//Parse response to JSON        
        response.json('Todo Deleted')
    })
//Console log error    
    .catch(error => console.error(error))

})

//setup server to listen on specified port. If it fails, you can add a default port
app.listen(process.env.PORT || PORT, ()=>{

//Console log string to test if server is running correctly.
    console.log(`Server running on port ${PORT}`)
})