const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// the '/' is a route for the main page
app.get('/',async (request, response)=>{
    // this is an asynchronous version of the synchronous version below
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db is holding the connection to our DB in MongoDB, find is to find our collection of documents
    // An array would hold our documents of objects which is easier to find
    // db.collection('todos').find().toArray()
    // data is our array
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
                // passing our data(items) into our ejs, we pass 'data' as items in ejs
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// request.body.todoItem gets the value (ex: coffee), it then gets sent to the server,
// responds with confirmation and refreshes, makes a get request to the server
// insertOne makes everything easy by inputing a value into the server.
// 'thing' and 'completed' are shortcut names for the database
// we can grab the value that comes out of the input with request.body.todoItem <-- comes from ejs
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // once the item is added the page refreshes(submits get rerquest) and adds the item
        // with the unique id to the data base, it gets sent to the ejs, which later gets sent to the db
        // , then spits out html and responds to the client.
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//our client side js can hear us through the event listener to mark items completed.
//makes a fetch which is a put request through the server. 
//there is code through the server(API) that hears this request.
// there was a gremlin (db listener) that is listening for the put request, 
// which updates the completed property from false to true. 
// It responds by refreshing and makes a get request to the database 
// this time when it looks at the db the value looks different from false to true.
app.put('/markComplete', (request, response) => {
    //gonna go to our db, going to update the first document that has a thing property of 'get pizza'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // sorting from top to bottom(Whatever came first), +1 would be the opposite
        sort: {_id: -1},
        // upsert would create the document for us
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // we respond with marked complete to our client side js which triggers a get request
        // goes to db and this time 'get pizza' doc is different, when it goes to the HTML it has to 
        // look different
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // marks it as uncomplete which removes the strike
            completed: false
          }
    },{
        // sorting from top to bottom(Whatever came first), +1 would be the opposite
        sort: {_id: -1},
        // upsert would create the document for us
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// to delete we trigger a delete and get request 
// we trigger a smurf on the client side js
app.delete('/deleteItem', (request, response) => {
    // we go into the db and deleteOne, it is the opposite to updateOne, grab the thing property (getPizza)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// process.env.PORT is for Heroku
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})