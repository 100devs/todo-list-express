const express = require('express') // connecting express to the app
const app = express() // express command
const MongoClient = require('mongodb').MongoClient // connecting mongodb to the app
const PORT = 2121 // declaring port for the server
require('dotenv').config() // connecting .env modules to the app


let db,
    dbConnectionStr = process.env.DB_STRING, // declaring connection string to the database from the .env file
    dbName = 'todo' // declaring the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to the database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // declaring database to make actions after connecting
    })
    
app.set('view engine', 'ejs') // setting the view engine as ejs
app.use(express.static('public')) // setting the static files to be inside the public folder
app.use(express.urlencoded({ extended: true })) // middleware to parse url requests body
app.use(express.json()) // middleware to parse requests body to json files


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // take all the documents from the database "todos" and make an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count all the documents inside the database with a propriety completed set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send the response to the client to render the ejs file with data from the database
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) // catch errors in case of failing
})

app.post('/addTodo', (request, response) => { // listen to post requests made to /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // take the request from the client and insert a new document in the database wih the propriety completed set to false
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // make the user go back to the main route
    })
    .catch(error => console.error(error)) // catch errors in case of failing
})

app.put('/markComplete', (request, response) => {  // listen to put requests made to /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the database document that match the thing property value
        $set: { // set the propriety completed to true
            completed: true 
          }
    },{
        sort: {_id: -1}, // change the sorting in the database by the id
        upsert: false // mongodb is not going to create a new document if the one in the request is not present 
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // send response back to the client
    })
    .catch(error => console.error(error)) // catch errors in case of failing

})

app.put('/markUnComplete', (request, response) => { // listen to put requests made to /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the database document that match the thing property value
        $set: { // set the propriety completed to false
            completed: false
          }
    },{
        sort: {_id: -1},  // change the sorting in the database by the id
        upsert: false // mongodb is not going to create a new document if the one in the request is not present
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // send response back to the client
    })
    .catch(error => console.error(error)) // catch errors in case of failing

})

app.delete('/deleteItem', (request, response) => { // listen to delete requests made to /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // update the database document that match the thing property value
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') // send response back to the client
    })
    .catch(error => console.error(error)) // catch errors in case of failing

})

app.listen(process.env.PORT || PORT, ()=>{ // listen to requests made to the declared port or the .env port
    console.log(`Server running on port ${PORT}`)
})