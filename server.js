//creating variables for and 'requiring' needed packages, using 'app' as variable for shorthand when calling methods, setting port number, 
//getting and configuring .env to hide secrets


const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//creating database varialbes for use in upcoming functions; the connection string is stored in the environment folder that is hidden
//database name is created
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


//making connection to mongodb using our stored connection string; calling connection when successful to the console at the given database name; 
//setting the db variable after the client is connected    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//using express (set in our 'app' variable) to get our server up and running, connecting our public files, and setting up middleware for body parser    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//using a get request in async/await format to create the items in to do list and put them in an array, also counting items left to complete
//renders the response to the ejs template
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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


//using express to make a post request on the /addtodo url; inserting a collection item into the database as an item with no completion;
//logging success to the console; redirects back to todo list page; logs error if necessary
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//using express to make a put request (edit) to mark an item (in a span element) as complete; uses mongo syntax to update an item from the collection
//and changes the completed key to true; no need to upsert or update a document; console logs success and sends response as "okay"; console logs
//error if necessary
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//using express to make a put request (edit) by updating the item retrieved from the click eventlistener, this sets the completed key as false
//so that it does not cross through; no need to upsert or update a document; console log with mark success as will json respone
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


//using express for a delete request; this will use mongodb syntax to delete a collection item that is grabbed from the client side js eventlistener; 
//the success will respond and console log; error will be logged if necessary
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


//this is setting the server to listen to our port that is hard-coded above OR the port given from mongodb, which is grabbed from our hidden env folder;
//if the connection is successful, the success will be logged to the console with the port it is connected on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})