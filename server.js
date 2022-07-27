// requires the Express module
const express = require('express')
//creates an express application
const app = express()
//requires the mongodb to be imported
const MongoClient = require('mongodb').MongoClient
//creates a port to locally view our app when the server is live
const PORT = 2121
//this allows us to bring in our hidden keys from our .env file
require('dotenv').config()

//creates database
let db,
    //this variable allows us to connect to our database by grabbing the DB_STRING in our .env file
    dbConnectionStr = process.env.DB_STRING,
    //this will set our database name
    dbName = 'todo'
//this defines how we connect to our mongo db, useUnifedTopology helps enture that things are returned in a clean manner
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
    //will produce a message in the console if the client connected properly
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//this is will allow us to render our app using ejs 
app.set('view engine', 'ejs')
//tells our app to use the 'public' folder for all of our static files
app.use(express.static('public'))
//this is a call to middleware that cleans up how things are displayed and how our server communicates with our client
app.use(express.urlencoded({ extended: true }))
//tells the app to use express's json method to take the object and turn it into a json string
app.use(express.json())

//this will go get content to display on the client side
app.get('/',async (request, response)=>{
    //this will go into our db,create a collection, and turn what it finds into an array of objects
    const todoItems = await db.collection('todos').find().toArray()
    //looks at all the documents in the collection and checks if they have not been competed, this will be our list of pending todos
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends a response that renders all of this information into our ejs
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
//this will route all the HTTP POST reqs to the specified path with the specified callback functions
app.post('/addTodo', (request, response) => {
    //this will insert a new todo to our db collection 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //once complete it will console log the following message and redirect back to the main page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //this is an error handling mechanism that will console log the error if one occurs
    .catch(error => console.error(error))
})
//this will respond when a user updates their todo item as completed
app.put('/markComplete', (request, response) => {
    //this will update the todo item 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //ths will set the 'completed' to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //once that finishes the following will occur
    .then(result => {
        //if succesful it will console log the following message
        console.log('Marked Complete')
        //this will take json as input and parse it to produce an object
        response.json('Marked Complete')
    })
    //this is an error handling mechanism that will console log the error if one occurs
    .catch(error => console.error(error))

})
//this will respond when a user updates their todo item as uncompleted
app.put('/markUnComplete', (request, response) => {
    //thi swill update the todo item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //this will set 'completed' to false make it an uncompleted todo item
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
      //once that finishes the following will occur
    .then(result => {
        //if succesful it will console log the following message
        console.log('Marked Complete')
        //this will take json as input and parse it to produce an object
        response.json('Marked Complete')
    })
    //this is an error handling mechanism that will console log the error if one occurs
    .catch(error => console.error(error))

})
//this will fire when the user deletes a todo item
app.delete('/deleteItem', (request, response) => {
    //this will go into the todo collection and delete the todo item from the collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //once that is completed it will do the following
    .then(result => {
        //if succesful it will console log the following message
        console.log('Todo Deleted')
         //this will take json as input and parse it to produce an object
        response.json('Todo Deleted')
    })
    //this is an error handling mechanism that will console log the error if one occurs
    .catch(error => console.error(error))

})
//used to bind and listen to the connections on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    //if succesful it will consle log that the server is running
    console.log(`Server running on port ${PORT}`)
})
