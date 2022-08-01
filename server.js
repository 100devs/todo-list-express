const express = require('express') // needed to set up the express server
const app = express() // convention--sets express() to the variable app to make  writing the server easier 
const MongoClient = require('mongodb').MongoClient // enabling the use of mongoDB
const PORT = 2121  // the port your server will run on
require('dotenv').config() // enviroment variables


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'  // declaring variables that hold your connection string database name and db will help make your code cleaner

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to the mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //setttting ejs as your view... will spit out HTML

app.use(express.static('public')) //allowing the use of a public folder that will serve all of your static files. css js, images etc...
app.use(express.urlencoded({ extended: true })) //  middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

app.use(express.json()) // Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.


app.get('/', async (request, response)=>{ //serves the index.ejs file when the server is ran. can be accessed on localhost:2121

    const todoItems = await db.collection('todos').find().toArray() // sets the database to teh todoitems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // assigns uncompleted items to the variable items left. .countDocuments returs number of documents that matches the query.

    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //  function is used to render a view and sends the rendered HTML string to the client. 

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // adds items to the todos collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts one item
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // reloads the page after item added
    })
    .catch(error => console.error(error)) //error handling 
})

app.put('/markComplete', (request, response) => { // updates the collection, marking an added item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sorts the items by order items are added. 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // put request..updates the collection marking an item uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //the update one method from mongo first prameter is a query to select the item in the colelction being updated then the $set parameter is the new data that be updated.
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

app.delete('/deleteItem', (request, response) => { // delete request removing and item from the colelction 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // runs the server on port 2121
    console.log(`Server running on port ${PORT}`)
})