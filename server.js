const express = require('express') // express is used to start our own local server
const app = express() // create a const use to interact with express
const MongoClient = require('mongodb').MongoClient // to connect to mongo datbase
const PORT = 2121 // what port the web server is looking for (will need to be appended to url domain)
require('dotenv').config() //uses the dotenv functions

// stor the dabase info in a variable
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the mongo database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // once it connects, do this next step
        console.log(`Connected to ${dbName} Database`) // log the name of the database connected to
        db = client.db(dbName) // store the db name in the variable
    })

app.set('view engine', 'ejs') // let express know we are using ejs to render html
app.use(express.static('public')) // use a public folder to make loading pages easier
app.use(express.urlencoded({ extended: true })) // let express know we will urlencoding things
app.use(express.json()) // let express know we will be using json


app.get('/',async (request, response)=>{ // if the root domain requested, do this
    const todoItems = await db.collection('todos').find().toArray() // find all the todo items in the database and store here
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // find all the todo items that are not marked completed and store here
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // use index.ejs to create html code using the variables passed to it
    
    // looks like someone was testing code and left some commented out

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Create
app.post('/addTodo', (request, response) => { // if url addTodo is loaded this will run
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert data into the db
    .then(result => { // if successful this happens
        console.log('Todo Added') // log it
        response.redirect('/') // send user back to the root page
    })
    .catch(error => console.error(error)) // log error on failure
})

// Update
app.put('/markComplete', (request, response) => { // if url markComplete is loaded this will run
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the data in the database
        $set: {
            completed: true // mark completed
          }
    },{
        sort: {_id: -1}, // change it's sort list so sorted items are at the bottom
        upsert: false
    })
    .then(result => { // if successful 
        console.log('Marked Complete') // log it
        response.json('Marked Complete') // send response to browser
    })
    .catch(error => console.error(error)) // log error on failure

})

// Update
// everything as above excep the completed bool is set to false
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

// Delete
app.delete('/deleteItem', (request, response) => { // deletedItem url is loaded
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // finds the item in the db and deletes it
    .then(result => {
        console.log('Todo Deleted') // log it
        response.json('Todo Deleted') // send response to browser
    })
    .catch(error => console.error(error)) // log error on failure

})

// Run the server using either the port given by the host, if none is given, use the number stored in the variable at the top
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})