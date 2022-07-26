// assign the express module to the imported module express
const express = require('express')
// create a new express application, assigned to the app variable
const app = express()
// Require the mongodb module, to connect to the database
const MongoClient = require('mongodb').MongoClient

// set the port variable that we're giong to listen for
const PORT = 2121
// import the dotenv module and call the config method, which reads from the .env file nearby and adds them all to process.env
require('dotenv').config()

//we are declaring three variables here: db, connectionstr and dbname and initializing two of them. 
//dbconnectionstring holds the value of the enviroment variable we set up in .env as DB_STRING
//dbname holds the string todo.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//we are using the connect method in the mongoclient (imported above) and passing our db string(initialized above as dbconnectionstr)
//we are passing the useunifiedtopology (deprecated, it's default as true in newer versions of mongo) and setting it as true
//after this connection is completed(is a promise) we are console logging to know we are actually connected (and showing the dbname with template literals)
//finally, we are initializing the db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
 
//setting the templating engine to use ejs
app.set('view engine', 'ejs')
//setting the static files location to the public folder
app.use(express.static('public'))
// using express urlencoded to enable express grab data from the form element by adding it to the request body property, setting the extended option to true to allow for object & array support
app.use(express.urlencoded({ extended: true }))

// this allows us to be able to use express
app.use(express.json())

// this is the GET request where we're going to read (get something back) the items in the todo list
app.get('/', async (request, response)=>{
    // access collection called 'todos' from connected database and find all documents, as an array, then await the promise, assigning the documents to todoItems
    const todoItems = await db.collection('todos').find().toArray()
    // access collection named 'todos' from connected database and get the count of all documents that match the filter - have an property of completed with a value of false, awaiting this promise and assigning to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // tell express to tell EJS to render index.ejs with this object - which EJS will make into variables
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(todoItems => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//using POST request (create) to add items in the todo list
app.post('/addTodo', (request, response) => {
//selecting our collection here and indicating that we are inserting one item (obj) with the key properties "thing" and 'completed', assigning the values of the todoItem 
//(taken from the body of the request) and the boolean false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
//once the previous promise is completed, we console log a message and redirect to /
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
//if the promise was rejected, we log the error
    .catch(error => console.error(error))
})


//PUT request (update) to update one item in the todo list
app.put('/markComplete', (request, response) => {
//selecting the 'todos' collection of our db and updating one item(object: key= thing, value= itemFromJs)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//we are using the $set operator from mongo to change the completed key to true
        $set: {
            completed: true
          }
    },{
//using the mongo sort method to sort by id. -1 means that we are getting the latest first (descending order)
        sort: {_id: -1},
//setting the upsert (insert + update) mongo method to false (which is the default value)
        upsert: false
    })
//when this promise is completed, we console log 'marked as completed' and send the same as json. 
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
//if the promise was rejected, we log the error
    .catch(error => console.error(error))

})

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

// DE-LAY-TAY handler at `/deleteItem` that deletes a todo document from the collection
app.delete('/deleteItem', (request, response) => {
    // accessing the 'todos' collection, delete one document that matches the filter, has an property of thing equal to itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// listen to the port that we established in the variable or the port that is available with heroku, for example
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})