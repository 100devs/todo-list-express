//Declare variables to allow server.js to use express, mongodb,dotenv
//Also declare port variable to run server from
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//Declare variables to access MongoDB info
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connect to Mongodb database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //When promise resolves, console log string
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assign db variable to database
        db = client.db(dbName)
    })

//lets you use ejs
app.set('view engine', 'ejs')
//Serves static files (images, CSS, JS) in the public folder
app.use(express.static('public'))
// built on body parser, parses incoming requests with urlencoded payloads and returns an object
app.use(express.urlencoded({ extended: true }))
// parses incoming JSON requests and puts the parsed data in request
app.use(express.json())


//Send read request to server, grabbing the homepage using an async/await syntax
app.get('/',async (request, response) => {
    //Once collection is specified and all documents are grabbed and made into array, store into variable todoItems
    const todoItems = await db.collection('todos').find().toArray()

    //Once collection is specified and all documents with value false are grabbed, store into variable todoItems 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //Renders ejs and data to populate into ejs template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //Promise syntax
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//Send POST request to specified path
app.post('/addTodo', (request, response) => {
    //Insert value from todoItem input into thing, task false because it is uncompleted
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //When promise resolves, log that it was added and refresh page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Updating to complete in the db
app.put('/markComplete', (request, response) => {
    //Go into collection 'todos' and update 'thing' matching itemFromJS(from main.js) to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //update 'completed' field to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        //upsert prevents new document of 'completed: true' from being inserted
        upsert: false
    })
    //When promise resolves log 'Marked Complete' and send response as a JSON as well
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Updating to incomplete in the db
app.put('/markUnComplete', (request, response) => {
    //Go into collection 'todos' and update 'thing' matching itemFromJS(from main.js) to incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
       //update 'completed' field to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        //upsert prevents new document of 'completed: false' from being inserted
        upsert: false
    })
    .then(result => {
        //When promise resolves log 'Marked Complete' and send response as a JSON as well
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Remove data from database
app.delete('/deleteItem', (request, response) => {
    //Go into collection todos and delete item matching the filter
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //After promise resolves log delete message and provide JSON response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Connect app to port specified 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})