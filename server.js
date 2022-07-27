//Initialize express
const express = require('express')
//Instantiate express
const app = express()
//Initialize MongoDB client
const MongoClient = require('mongodb').MongoClient
//Set PORT variable
const PORT = 2121
//Allow usage of environment variables
require('dotenv').config()

//Declare variables for database, mongodb connection string, database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo';

//Connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to mongodb using connection string
    .then(client => {                                              //When a response from mongodb is received
        console.log(`Connected to ${dbName} Database`)             //Log in console
        db = client.db(dbName)                                     //Assign client.db to the db variable declared above
    })
    
app.set('view engine', 'ejs')                                      //Use ejs as the view engine
app.use(express.static('public'))                                  //Use public folder
app.use(express.urlencoded({ extended: true }))                    //Parse url-encoded data with the qs lib
app.use(express.json())                                            //Parse JSON 


app.get('/',async (request, response)=>{                                                    //GET (read) request at endpoint '/'
    const todoItems = await db.collection('todos').find().toArray()                         //Store the mongodb collection 'todos' in a new array todoItems            
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})       //Count number of todo items in the database collection which have not been completed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                     //Render the ejs, assigning the todoItems array to the ejs variable items and itemsLeft to the ejs variable left
    
    // db.collection('todos').find().toArray()                                              //Without using async await: Find 'todos' collection and store in array
    // .then(data => {                                                                      //Promise chain. 'todos' array stored in data variable
    //     db.collection('todos').countDocuments({completed: false})                        //Count number of incomplete todos
    //     .then(itemsLeft => {                                                             //Number of incomplete todos stored as itemsLeft arg
    //         response.render('index.ejs', { items: data, left: itemsLeft })               //Render ejs using data, itemsLeft
    //     })
    // })
    // .catch(error => console.error(error))                                                //Catch errors
})

app.post('/addTodo', (request, response) => {                                               //POST (create) request at endpoint '/addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})      //Add the value of the todo form to the database with the default property completed: false
    .then(result => {                                                                       //When the post is successful
        console.log('Todo Added')                                                           //Log in console
        response.redirect('/')                                                              //Send user back to endpoint '/'
    })
    .catch(error => console.error(error))                                                   //Catch errors
})

app.put('/markComplete', (request, response) => {                                           //PUT (update) request at endpoint 'markComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{                     //Find and update item in db based on the item marked completed in the view 
        $set: {
            completed: true                                                                 //Update found item completed property to true
          }
    },{
        sort: {_id: -1},                                                                    //Sort based on id in descending order
        upsert: false                                                                       //No upsert - do not insert a new document if no match is found
    })
    .then(result => {
        console.log('Marked Complete')                                                      //Log in console
        response.json('Marked Complete')                                                    //Send response to client (which will then be console logged on client side)
    })
    .catch(error => console.error(error))                                                   //Catch errors

})

app.put('/markUnComplete', (request, response) => {                                         //PUT (update) request at endpoint '/markUnComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{                     //Find and update item in db based on the item marked incomplete in the view
        $set: {
            completed: false                                                                //Update found item completed property to false
          }
    },{
        sort: {_id: -1},                                                                    //Sort based on id in descending order
        upsert: false                                                                       //Do not upsert
    })
    .then(result => {
        console.log('Marked Complete')                                                      //Log in console
        response.json('Marked Complete')                                                    //Send response to client
    })
    .catch(error => console.error(error))                                                   //Catch errors

})

app.delete('/deleteItem', (request, response) => {                                          //Delete request at endpoint '/deleteItem'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})                      //Find and delete item in db based on item clicked on in the view
    .then(result => {
        console.log('Todo Deleted')                                                         //Console log server side
        response.json('Todo Deleted')                                                       //Send response to client
    })
    .catch(error => console.error(error))                                                   //Catch errors

})

//Start server using environment variable or hard coded PORT variable if environment variable does not exist
app.listen(process.env.PORT || PORT, ()=>{                                                          
    console.log(`Server running on port ${PORT}`)
})