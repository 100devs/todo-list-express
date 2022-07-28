const express = require('express')
//lets you use express
const app = express()
//assign express to app variable
const MongoClient = require('mongodb').MongoClient
//lets you use mongodb
const PORT = 2121
//your test port of 2121
require('dotenv').config()
//import the dotenv module and call the config method, which reads from the .env file nearby and adds them all to process.env


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//declearing three variables and initializaing two of them
//dbconnectionstring holds the value of the enviroment variable we set up in .env as DB_STRING

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//use connect method in mongoDB, inputting the connection string (password)
//we are passing the useunifiedtopology (deprecated, it's default as true in newer versions of mongo) and setting it as true
//after connection is completed (a promise), we console.log sucess message and initializing db variable
    
app.set('view engine', 'ejs')
//set templating engine to ejs
app.use(express.static('public'))
//setting the static files locaiton to public folder
app.use(express.urlencoded({ extended: true }))
//using express urlencoded to enable express grab data from the form element by adding it to the request body property, setting the extended option to true to allow for object & array support
app.use(express.json())
//allows us to actually use express


app.get('/',async (request, response)=>{
//READ - get request from todo list
    const todoItems = await db.collection('todos').find().toArray()
    //access db collections names 'todos', find all documents, and converting to array, awaiting the promise, and assignign documents to variable todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // access collection named 'todos' from connected database and get the count of all documents that match the filter - have an property of completed with a value of false, awaiting this promise and assigning to itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // tell express to tell EJS to render index.ejs with this object - which EJS will make into variables

    // db.collection('todos').find().toArray()
    // .then(todoItems => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
//create - POST to add items to do list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //selecting collection 'todos' and inserting one item (obj) with key properties of 'thing' and 'completeld', assigning the value of thing from the body of the requst and assigning boolean false.
    .then(result => {
    //once promise is complete, we console.log messages success and rediret to '/'
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
    //if promise was rejected, we log the error
})

app.put('/markComplete', (request, response) => {
    //UPDATe - put. update one item on todo list - marked completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //select the 'todo's colleciotn of our db & updating one object item. key ='thing' value = 'itemFromJS'
        $set: {
            completed: true
          }
        //we are using the $set operator from mongo to change the completed key to true
    },{
        sort: {_id: -1},
        upsert: false
        //using mongodb sort method by ID, and -1 means the latest first (descending order)
        //setting the upsert (insert + update) mongo method to false (which is the default value)
    })
    .then(result => {
        //once promise is completed, we log the compeltion and send the same message as JSON back to client
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
        //if promise was rejected, we log the error

})

app.put('/markUnComplete', (request, response) => {
//update - PUT. update one item on todolist as uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
    //from DB select the 'todos' collection and update one item that is an object with a key of 'thing' and value fromJS
        $set: {
            completed: false
          }
        //we are using the $set operator from mongo to change the completed key to false
    },{
        sort: {_id: -1},
        upsert: false
        //we are using the mongo sort method and sorting by id in a descending order (latest first)
        //setting the upsert (insert + update) mongo method to false (which is the default value)
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
        //when promsie is completed, we log messages and respond to client with same message in JSON form
    })
    .catch(error => console.error(error))
    //if promise was rejected, we log the error

})

app.delete('/deleteItem', (request, response) => {
//using express delete method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //from mongoDB database, selecting the 'todos' collection and deletes one document that matches the object filter, with a property of 'thing' and a values of itemFromJS
    .then(result => {
        //when promise is completed, we log the message and respond to client with same message but in JSON format
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
    //if promise is rejected, we log the error

})

app.listen(process.env.PORT || PORT, ()=>{
    //listen to either the port we estbalisehd in the variable, or another port that is available - heroku for example. if successful lot the following message
    console.log(`Server running on port ${PORT}`)
})