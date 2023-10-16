// importing express package
const express = require('express')
// assigning app to express so we can use it
const app = express()
// internal connection pull we use with MongoDB
const MongoClient = require('mongodb').MongoClient
// assigning port we're using
const PORT = 2121
// package used to allow environment variables in code
require('dotenv').config()

// createing variables for database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo-list'

// making sure the database and server are running. 
// having mongo client conncet to database, and logging when connected
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    // assigning view engine as ejs
app.set('view engine', 'ejs')
// connecting to public folder -calling express methods- serve stacic files 
app.use(express.static('public'))
// middleware function- parses incoming requests with URL-encoded payloads and is based on a body parser.
app.use(express.urlencoded({ extended: true }))
// parses incoming requests with JSON
app.use(express.json())

// creates landing page that  
// 
app.get('/',async (request, response)=>{
    // finds todos within the collection and turns it into an array
    const todoItems = await db.collection('todos').find().toArray()
    // request number of documents in collection that = completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // request ejs to fill in items and left objects
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // finding collection in db turn into an array
    db.collection('todos').find().toArray()
    // return number of completed that = false
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            //respond with ejs
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    //catch errors
    .catch(error => console.error(error))
})

// '/addTodo' comes from the action on the form

// adding todos
app.post('/addTodo', (request, response) => {
    //inserting a todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // promise chaining
    .then(result => {
        // letting user know todo was added
        console.log('Todo Added')
        // redirect to landing page
        response.redirect('/')
    })
    //catch errors
    .catch(error => console.error(error))
})

// update and marking complete
app.put('/markComplete', (request, response) => {
    //updating completed items - once you check items as done, completed turns from false to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting completed as true
        $set: {
            completed: true
          }
    },{
        //sorting from oldest to newest
        sort: {_id: -1},
        // a database operation that will update an existing row if a specified value already exists in a table, and insert a new row if the specified value doesn't already exist
        upsert: false
    })
    // return new promise object
    .then(result => {
        // console log 'Marked Complete'
        console.log('Marked Complete')
        // responding with json
        response.json('Marked Complete')
    })
    //catch errors
    .catch(error => console.error(error))

})

// update on the todos collection 
app.put('/markUnComplete', (request, response) => {
    // looking at the todos collection and updating one
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting completed to false
        $set: {
            completed: false
          }
    },{
        // sorting from oldest to newest
        sort: {_id: -1},
        // if already in table, it will update. If not, it will make a new row with value. 
        upsert: false
    })
    // return result
    .then(result => {
        // console log 'Marked Complete'
        console.log('Marked Complete')
        // respone with json
        response.json('Marked Complete')
    })
    // catch error
    .catch(error => console.error(error))

})

// sending delete request
app.delete('/deleteItem', (request, response) => {
    // delete one from db collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // returning promise obj
    .then(result => {
        //console log 'Todo Deleted'
        console.log('Todo Deleted')
        // respond with json
        response.json('Todo Deleted')
    })
    //catch errors
    .catch(error => console.error(error))

})

// express router listening for env connection || defualt port
app.listen(process.env.PORT || PORT, ()=>{
    // console logging prot server is running on
    console.log(`Server running on port ${PORT}`)
})