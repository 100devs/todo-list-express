const express = require('express') // install express
const app = express() // express() function returns instance of an Express app, app represents express appliction and central object for configuring server
const MongoClient = require('mongodb').MongoClient // installmongodb
const PORT = 2121 // localhost 2121
require('dotenv').config() // install dotenv


let db,
    dbConnectionStr = process.env.DB_STRING, // hides db string in env
    dbName = 'todo' // mongodb name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to mongoDB database using Node.js driver
    .then(client => {
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // configures app to use EJS template
app.use(express.static('public')) // serves static files from a directory named public
app.use(express.urlencoded({ extended: true })) // middleware function that parses incoming requests with URL-encoded payloads
app.use(express.json()) // simplifies the process of handling JSON data in Express API


app.get('/',async (request, response)=>{ // initializes an asynchronous route handler for the root path / in express.js app, get something. forward slash is the route main
    const todoItems = await db.collection('todos').find().toArray() // go to collection, find all documents and convert to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // go to collection, get exact count of documents
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // respond with rendering of html
    // db.collection('todos').find().toArray() *go to db find collection todos, inside collection is docs (objects), find all docs in todo and put in array*
    // .then(data => { *pass the array into parameter data*
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) *pass objects into ejs template* in ejs template we see items
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // make something, addtodo is the route, came from action on form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // method to add single document into todo collection. smurf listens for this post request. thing and completed property
    .then(result => { // register callback functions that will be executed when promise settles add to db
        console.log('Todo Added') 
        response.redirect('/') // refresh, then GET request, goes to db, there will be a new doc in db
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // update / change something, route from main js line 39 back and forth, gremlin hears request, checks put checks right route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // method to update first document that specifies filter. updating first doc that has thing property of get pizza
        $set: {
            completed: true // when finded, was falsee, sets completed property in to true get pizza
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // updated value, reponds marked complete sent to the client that made request, when refresh browser has permission
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // update / change something
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // method to update first document that speciifies filter
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

app.delete('/deleteItem', (request, response) => { // remove something 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go to db find document that has thing property of get pizza and delete it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})