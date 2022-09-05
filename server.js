const express = require('express') //importing express into the file
const app = express() //instantiating a new instance of an express app, allows you to use easy to use variable name 
const MongoClient = require('mongodb').MongoClient //importing mongoDB and the mongo client property in order to connect to a database
const PORT = 2121 //variable for port number so you can use the variable later
require('dotenv').config() //allows us to use dotenv file


let db, //declaring db variable
    dbConnectionStr = process.env.DB_STRING, //process of looking into the env file for the DB_STRING variable
    dbName = 'todo' // database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect mongo client 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //sets our view engine to ejs, allows us to use ejs
app.use(express.static('public')) //sets up public folder that will serve files to clients without giving every single file a get request
//it parses incoming requests with urlencoded payloads and is based on body-parser
app.use(express.urlencoded({ extended: true })) 
//it parses income json requests and puts the parsed data in request
app.use(express.json())

//defines a GET request at default endpoint of /
app.get('/',async (request, response)=>{ //defines a GET request at default endpoint of /
    //accessing db collection called todos, find returns documents that meet a criteria, convert them into an array
    const todoItems = await db.collection('todos').find().toArray() 
    //count documents in database that have key property value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //pass todoItems and itemsLeft to index.ejs files in order to be rendered 
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

//defines a POST request at /addTodo endpoint, use to create a document
app.post('/addTodo', (request, response) => {
    //adds new document into the todos collection, todoItem is pulled from our request body
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //redirects to base endpoint after the document is added, this is to show the changes
    })
    .catch(error => console.error(error))
})

//defines a put request at /markComplete endpoint, used to update a document 
app.put('/markComplete', (request, response) => {
    //find the collection called todos and find the object based on thing property with a value of itemFromJS 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //change the document property of completed to true
          }
    },{
        sort: {_id: -1}, //sort in descending order of ID
        upsert: false //do not insert a new object if this doesnt exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // error handling

})

app.put('/markUnComplete', (request, response) => { // put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { 
            completed: false
          }
    },{
        sort: {_id: -1}, // sort descending
        upsert: false // prevents insertion of item if it does not exist
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // delete http request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go to the db collecting, delete one which has a thing as specified by the request body
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') // send response to the user that the todo was deleted
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port will be listening to the requests
    console.log(`Server running on port ${PORT}`)
})