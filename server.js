//importing express
const express = require('express')
//putting it in a variable so we can use it later
const app = express()
//importing mongo database
const MongoClient = require('mongodb').MongoClient
//declaring port
const PORT = 2121
//importing dotenv so we can load the environment variables from the .env file
require('dotenv').config()

//declaring the database variable, the connection to the string from the .env file and the db name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    //connecting the dbConnectinStr variable to the mongo client
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//checking if we are connected to the db
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //redeclaring the db variable
        db = client.db(dbName)
    })

    //setting our app to use the ejs file
app.set('view engine', 'ejs')
//setting our app to use the public folder
app.use(express.static('public'))
//we set the urlencoded method to recognize the incoming request as a string or array
app.use(express.urlencoded({ extended: true }))
//we tell our app to put the data into json
app.use(express.json())

// we make our server listen to get requests from the home page
app.get('/',async (request, response)=>{
    //declaring a todoItems variable and putting the todos collection into an array
    const todoItems = await db.collection('todos').find().toArray()
    //declaring a itemsLeft variable and putting the documents that are not completed in it
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //we respond by rendering teh index.ejs file and set the todoItems in items, and itemsLeft in left
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

//making a post request on the addTodo page
app.post('/addTodo', (request, response) => {
    //we target the todos collection and insert an object with a property called thing 
    //and inside it we put the item the user put in the input, 
    //and a second property with a value false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //then we console log so we can make sure that the item is added, and then we refresh
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })

    //making sure we catch an error if there is one
    .catch(error => console.error(error))
})

//making a put request and setting up a markComplete route
app.put('/markComplete', (request, response) => {
    //we target the todos collection and with the first argument it is telling it to update the text from the span (itemFromJS) 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //and with the second argument is setting the completed field to true
        $set: {
            completed: true
          }
    },{
        //additional options to the update operation ,sorting the most recently added documents first
        sort: {_id: -1},
        //setting the upsert to false specifies to not create a new document if there is no matching document found
        upsert: false
    })
    //then we console log to make sure the update was successful, 
    //and we send a json to inform the client the update was successful
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if error occurs during the update it will be logged to the console
    .catch(error => console.error(error))

})

//we set up a route /markUnComplete for the put method, 
app.put('/markUnComplete', (request, response) => {
    //accessing the todos collection and telling it to perform an update, 
    //the first argument is to match the thing to the itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //the second argument to update the completed to false
        $set: {
            completed: false
          }
    },{

        //sorts the ids n descending order, meaning most recently added ones are first
        sort: {_id: -1},
        //if there is not matching document to not create one
        upsert: false
    })
    //then we console log marked complete to make sure it is updated 
    //and send a json response to the client
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if there is an error it will be logged to the console
    .catch(error => console.error(error))

})

//setting the route /deleteItem for the delete method
app.delete('/deleteItem', (request, response) => {
    //accesing the todos collection in the db and performing a delete method 
    //with the argument to match the document for deleting
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log todo deleted message to make sure we performed the method correctly
        console.log('Todo Deleted')
        //sending json response with a message to do deleted
        response.json('Todo Deleted')
    })
    //if there is an error it will be logged to the console
    .catch(error => console.error(error))

})
//listening to the environment variable PORT or a default PORT
app.listen(process.env.PORT || PORT, ()=>{
    //logging a message to the console to indicate that 
    //the server is running on the port with the number we put in the port variable
    console.log(`Server running on port ${PORT}`)
})