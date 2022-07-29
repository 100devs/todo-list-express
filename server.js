const express = require('express')  // import expressjs
const app = express() // set up expressjs server
const MongoClient = require('mongodb').MongoClient  //import mongo
const PORT = 2121 // determine port number
require('dotenv').config() //not sure

// set database variable
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// connect to database, console.log that it is connected, assign database from md to database var.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
   
app.set('view engine', 'ejs')

// public folder
app.use(express.static('public'))

// do not remember
app.use(express.urlencoded({ extended: true }))

// parse req.body as json
app.use(express.json())

// READ- responds to "/" route, request from the browser, response is what it sends back to client
app.get('/',async (request, response)=>{
    // items from db
    const todoItems = await db.collection('todos').find().toArray()
    
    // items for false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
    //respond by ejs template
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    // example?
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
// CREATE add what to do, to db
app.post('/addTodo', (request, response) => {
    
    // insert thing: request.body.todoItem to todos collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        
        // console.log what we added
        console.log('Todo Added')
        // send back to the '/'
        response.redirect('/')
    })
    // if action fails, log error to console
    .catch(error => console.error(error))
})
// UPTADE, you can update list, handle '/markComplete'
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        
        // set comleted as true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    
    // result
    .then(result => {
        // console.log what we marked it to console
        console.log('Marked Complete')
        
        // send json back to browser
        response.json('Marked Complete')
    })
    // error if db update fails
    .catch(error => console.error(error))

})

// UPDATE when it is not completed
app.put('/markUnComplete', (request, response) => {
    
    // find document in 'todos' collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        
        // set as false 
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // respond with 'Marked complete' json and console.log it
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    
    // console.log error if it can not be updated db
    .catch(error => console.error(error))

})

// DELETE 
app.delete('/deleteItem', (request, response) => {
    // find the document which matches and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // console.log todo deleted 
    .then(result => {
        console.log('Todo Deleted')
        // respond what we did back to browser
        response.json('Todo Deleted')
    })
    // logs error
    .catch(error => console.error(error))

})

//listen env.PORT and console.log that we are running
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
