//link our depencies
const express = require('express') //express used for our server
const app = express() //initiate app using the express constructor
const MongoClient = require('mongodb').MongoClient //database
const PORT = 2121 //fallback port
require('dotenv').config() //using dotenv for our config file.  Keep private info off of GIT

//create some variables to use for our database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'  //name of the collection for our database

//connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //once connected log connection status
        console.log(`Connected to ${dbName} Database`)
        //assign the reference to the connected DB
        db = client.db(dbName)
    })

//set the viewengine to ejs
app.set('view engine', 'ejs')
//use express' built in public directory for default client side css/html/js
app.use(express.static('public'))
//urlencoded parses incoming requests
app.use(express.urlencoded({ extended: true }))
//parses incoming json requests
app.use(express.json())

// get request to the db
app.get('/',async (request, response)=>{
    //returns all documents in our todos db and turns it into and array
    const todoItems = await db.collection('todos').find().toArray()
    //returns all documents in our todos db that is not completed and turns it into and array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders the view index.ejs and send the ejs the following items todoItems and itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //alternative method using .then instead of async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//post request to the db on route /addTodo
app.post('/addTodo', (request, response) => {
    //adds a new document (insert) to our database, set completed to false by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //console log after the request has been completed
        console.log('Todo Added')
        //redirect to the / route (refresh)
        response.redirect('/')
    })
    //if there was an error - display to the screen
    .catch(error => console.error(error))
})

//put request to the db on route markComplete to update the item
app.put('/markComplete', (request, response) => {
    //updates the found document in our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //set the documents completed property to true
            completed: true
          }
    },{
        //sorts the collection in ascending order by their id that was created on mongodb
        sort: {_id: -1},
        upsert: false //create the item if it doesn't exist when set to true
    })
    .then(result => {
        //console log the completion
        console.log('Marked Complete')
        //respond marked complete in json
        response.json('Marked Complete')
    }) 
    //if any errors log to console
    .catch(error => console.error(error))

})
 //put request to the db on route markUnComplete to update the item
app.put('/markUnComplete', (request, response) => {
    //updates the found document in our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //set the documents completed property to true
            completed: false
          }
    },{
        //sorts the collection in ascending order by their id that was created on mongodb
        sort: {_id: -1},
        upsert: false //create the item if it doesn't exist when set to true
    })
    .then(result => {
        //console log the completion
        console.log('Marked Complete')
        //respond marked complete in json
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//delete request to the db 
app.delete('/deleteItem', (request, response) => {
    //removed the document from the db that is sent from the body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log the delete request
        console.log('Todo Deleted')
        //response in json that it was deleted
        response.json('Todo Deleted')
    })
    //any errors log in console
    .catch(error => console.error(error))

})

//allow our app to listen to requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})