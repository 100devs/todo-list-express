const express = require('express') //Load express
const app = express() //Express server object
const MongoClient = require('mongodb').MongoClient //Load MongoDb and get client
const PORT = 2121 //Use port 2121 - normally in .env
require('dotenv').config() //Load dotenv, which gets environmental variables from .env


//Define and name database, using DB_STRING from .env
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Then tell us it worked
        console.log(`Connected to ${dbName} Database`)
        //Assign the database's response to db
        db = client.db(dbName)
    })
//Set express's view engine to EJS
app.set('view engine', 'ejs')
//Load everything in the 'public' folder
app.use(express.static('public'))
//Allow server to understand URL encoded requests
app.use(express.urlencoded({ extended: true }))
// Use JSON (Do we really need to tell the server this?)
app.use(express.json())

//Respond to GET requests for '/'
app.get('/',async (request, response)=>{
    //Get all the todo items and put them in an array
    const todoItems = await db.collection('todos').find().toArray()
    //Count how many aren't completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render index.ejs, providing it the todo items and #items left (items & left are the var names passed to index.ejs)
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

//Respond to POST requests to '/addTodo'
app.post('/addTodo', (request, response) => {
    //Send request to DB to insert the request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')  //Display message in console
        response.redirect('/')     //Redirect back to '/'
    })
    .catch(error => console.error(error))    //Catch and display any error messages
})

//Respond to PUT requests to '/markUnComplete'
app.put('/markComplete', (request, response) => {
    //Send request to DB to update one item from the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true /* set 'completed' to true */
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')        //Display message in console
        response.json('Marked Complete')        //Send response back to requester
    })
    .catch(error => console.error(error))    //Catch and display any error messages

})

//Respond to PUT requests to '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    //Send request to DB to update one item from the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false /* set 'completed' to false */
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')        //Display message in console
        response.json('Marked Complete')        //Send response back to requester
    })
    .catch(error => console.error(error)) //Catch and display any error messages

})

//Respond to DELETE requests to '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    //Send request to db to delete one item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')        //Display message in console
        response.json('Todo Deleted')        //Send response back to requester
    })
    .catch(error => console.error(error))    //Catch and display any error messages

})

//Listen for requests on {PORT}
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})