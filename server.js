const express = require('express') //require app to use express module
const app = express() //set express function to variable "app"
const MongoClient = require('mongodb').MongoClient //assigns variable for methods associated with MongoClient and talking to our DB
const PORT = 2121 //hard-coded default port where server will be listening
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //database variable
    dbConnectionStr = process.env.DB_STRING, //database connection string variable
    dbName = 'todo' //set database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to MongoDB using our connection string
    .then(client => { //waiting for connection and proceeding if connection is successful
        console.log(`Connected to ${dbName} Database`) //logging message for successful DB connection
        db = client.db(dbName) //assigning value to previously declared variable, contains a DB client factory method
    })
    
app.set('view engine', 'ejs') //tells express the templating language is EJS
app.use(express.static('public')) //handles routing for static pages like main.js and css
app.use(express.urlencoded({ extended: true })) //tells express to encode/decode URLs where header matches content, 'extended' allows for arrays and objects
app.use(express.json()) //parses JSON content


app.get('/',async (request, response)=>{ //Get/read request for main page
    const todoItems = await db.collection('todos').find().toArray() //go to database collection 'todos', find the documents, list them in an array and set this to a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts number of documents with completed property set to false and assigns this number to a variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render HTML and send response object containing todoItems and itemsLeft variables

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Post/create request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds document to 'todos' collection; sets form submission to property 'thing' and 'completed' property to false
    .then(result => {
        console.log('Todo Added') //sends confirmation to terminal that item was added 
        response.redirect('/') //refreshes page/creates new Read request with updated info
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //Update/put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find document in 'todos' connected to markComplete click event in main.js
        $set: {
            completed: true
          } //update completed property to 'true'
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

app.put('/markUnComplete', (request, response) => { //Update/put request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find document in 'todos' connected to markUnComplete click event in main.js
        $set: {
            completed: false
          } //update completed property to 'false'
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

app.delete('/deleteItem', (request, response) => { //Delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find document in 'todos' connected to deleteItem click event in main.js
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) //function for default port (set at beginning of server) or port provided by hosting website to listen for server.js 