// this line imports Express module,
const express = require('express');
// initializes the new Express application, assign it to variable app. app defines routes, middleware, other settings for server
const app = express();
// imports MongoClient class from mongodb package, MongoClient is used to connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
// server will listen for incoming req using that PORT #, value can be changed as needed
const PORT = 2121;
// imports dotenv package, load environment vars
require('dotenv').config();

// we are declaring some variables in order to connect MongoDB to Node app
// with process.env.DB_STRING we are ensuring critical info is not hard-coded in source code
// database name
let db,
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'todo'

//This next block of code connects to DB, logs confirmation msg, and stores db reference for later use
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//.set()allows rendering of .ejs template files
//.use(1): serves static files (imgs, css,js) from public folder
//.use(2): parses form data & supports complex object
//.use(3): parses incoming reqs as JSON
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//.get() listens for GET req on root URL '/'
//async() handles async operations using await db queries
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


//app.post('/add...) sets up a route that listens dor POST reqs to the '/addTodo' endpoint\
//we are accessing db, in collection name 'todos', and we are inserting one document to the collection
//if operation is successful, we will log Todo Added, redirecting back to the root URL
//.catch will look for any errors and will log them if encountered
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//we are accessing and updating a document in the todos collection.
//sorting the document in descending order
//promise chain (.then => etc) logging completion
//finally we will catch any errors and log then during the update
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

//
//Same as the one above, however the only difference here is that we will be checking for uncomplete tasks
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

//setting up route that listens for delete req to '/deleteItem' endpoint, call back func that will be executed when req is received (req,res)
//db object, accesssing todos collection in db, accessing deleteOne; deleting document
//.then => etc: promise chain that executes when operation is complete, logging, and responding in JSON
//.catch => will handle errors if any arise during the operation, logging them
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//.listen() will start HTTP server listening on specified port
//process.env.PORT will determine the port number, whether its available or predeclared
//arrow callback that will be executed once the server is ready to handle the connection
//if succeeded, we will be loggin the message with the appropiate template literal 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})