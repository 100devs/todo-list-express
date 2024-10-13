//loads or imports express
const express = require('express')

//variable assigned to express
const app = express()

//loads or imports connection to mongo database
const MongoClient = require('mongodb').MongoClient

//hard codes port to local server
const PORT = 2121

//assigning .env file (environment variables) to project
require('dotenv').config()


// declares important database variables and the connection string from the previous environment variable, assigns name of database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


//connects db via connection string in the .env, enables unified topology engine which helps optimization and console logs the result
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//sets view engine using EJS, sets route for static files to public folder, allows express to parse information from forms, tells express to use JSON data
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//tells server to listen to get request on main route, finds items from todo collection and turns to an array, finds the remaining documents that are incomplete, then the response is rendered by EJS via the view engine
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


//this post request goes to the database, finds the collection, adds one to it, console logs status, and refreshes page, and catches any errors
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//goes to the database, gets todos collection, updates via updateOne method, sets completed value to true, disables upsert, console logs result and catches any errors
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


//same put request logic as before just for marking task incomplete instead of complete by still using updateOne and providing a different completed value
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


//delete request using deleteOne method, goes to db in same way as earlier requests, console logs results of succesful deletion, sends JSON response and then catches errors
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})



//accesses port from enviroment variable or hard coded port 2121, console logs result
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

