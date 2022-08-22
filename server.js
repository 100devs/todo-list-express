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
// built on body parser, parses incoming requests with urlencoded payloads, grabs stuff like text and returns an object
app.use(express.urlencoded({ extended: true }))
// parses incoming JSON requests and puts the parsed data in request
app.use(express.json())


//Server is listening for GET request, grabbing the homepage using an async/await syntax
app.get('/',async (request, response) => {
    //Once collection is specified and all documents are grabbed and made into array, store into variable todoItems
    const todoItems = await db.collection('todos').find().toArray()

    //Once collection is specified and all documents with value false are grabbed, store into variable itemsLeft 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //Renders ejs and data to populate into ejs template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //Promise chain syntax
    // Go to database stored in variable db. Go into todos collection. Find all documents (objects) in todos collection. Store them in array
        // db.collection('todos').find().toArray()
    //Return array into data parameter in .then
        // .then(data => {
        //     db.collection('todos').countDocuments({completed: false})
        //     .then(itemsLeft => {
            //Pass data holding array of objects into index.ejs under the name 'items'. In ejs, wherever 'items' is used, that is the array of documents. Render html and respond with html
        //         response.render('index.ejs', { items: data, left: itemsLeft })
        //     })
        // })
        // .catch(error => console.error(error))
})

//Listen for POST request with route '/addTodo' (route is from action attribute in form that made request)
app.post('/addTodo', (request, response) => {
    //Go to database, into collection 'todos'. Assign request.body.todoItem to document property of thing with completed property of false. Insert into collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //When promise resolves, log that it was added and refresh page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//Create gremlin listening for fetch request matching the '/markComplete' route and run code below
app.put('/markComplete', (request, response) => {
    //Go into collection 'todos' and update document 'thing' with text matching itemFromJS(itemText from main.js)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //update 'completed' property to true
        $set: {
            completed: true
          }
    },{
        //sorts top to bottom. right now, grabs first document matching itemText
        sort: {_id: -1},
        //upsert prevents new document of 'completed: true' from being inserted
        upsert: false
    })
    //db is updated at this point, BUT
    //User hasn't seen changes in the DOM yet
    //When promise resolves log 'Marked Complete' and send response to the client as a JSON as well
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
    //Go into collection todos and delete item with text matching the text from the request.body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Once item is deleted respond to client with 'TodoDeleted'
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