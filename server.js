const express = require('express') //sets express
const app = express() //lets us use express with the "app" variable
const MongoClient = require('mongodb').MongoClient //sets mongodb
const PORT = 2121 //sets port for local testing
require('dotenv').config() //requires the .env file for password stuff w/ mongodb


let db, //declaring global variable db
    dbConnectionStr = process.env.DB_STRING, //declaring variable from .env file
    dbName = 'todo' //declaring variable dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to mongoDB, passing in connection string
    .then(client => {//once connection is successful, do this stuff
        console.log(`Connected to ${dbName} Database`)//console log after successful connection to database
        db = client.db(dbName) //setting variable db (declared above) to database name
    })//closing things
    
//setting middleware
app.set('view engine', 'ejs')//set render engine to ejs
app.use(express.static('public'))//sets location for frontend assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode url's where the header matches the content. supports arrays and objects. no idea what this means!
app.use(express.json())//parses JSON content


app.get('/',async (request, response)=>{//start a GET method, sets up req & res params
    const todoItems = await db.collection('todos').find().toArray() //sets variable todoItems from database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable itemsLeft from todos database, counting uncompleted items
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//puts above data/variables into index.ejs

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//closes function

app.post('/addTodo', (request, response) => { //starts a POST (create) method with route of /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //calls insertOne method, pulling text from document
    .then(result => {//after todo added, this stuff happnes
        console.log('Todo Added')//console log "todo added"
        response.redirect('/') //returns to main page
    })
    .catch(error => console.error(error))//catches error if there is one
})//closes method

app.put('/markComplete', (request, response) => { //starts a PUT (Update) method on the /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //specifies specific item in db
        $set: {
            completed: true
          }//changes completed state from false to true
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insert if item doesn't exist
    })
    .then(result => { //after the above is completed, do the following
        console.log('Marked Complete') //console logs "marked complete"
        response.json('Marked Complete') //sends a JSON response to main.js
    })
    .catch(error => console.error(error)) //catch & log error

})//closes method

app.put('/markUnComplete', (request, response) => { //starts a PUT (update) method on the /markUnComplete route; reverses value of /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //specifies item in the database
        $set: {
            completed: false //sets "completed" variable to false
          }
    },{
        sort: {_id: -1}, //sorts the item again
        upsert: false //prevents insert if item doesn't exist
    })
    .then(result => {//after the above is completed, do the following
        console.log('Marked Complete')//console logs "marked complete"
        response.json('Marked Complete')//sends a JSON response to main.js
    })
    .catch(error => console.error(error))//catch & log error

})//closes method

app.delete('/deleteItem', (request, response) => { //starts a DELETE (delete) method on the /deletedItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //specifies which item, runs deleteOne method, removing it from database
    .then(result => { //does similar console logging as above
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

}) //closes method

app.listen(process.env.PORT || PORT, ()=>{ //setting port app will be listening on, pulling info from .env file
    console.log(`Server running on port ${PORT}`) //console logs what port is being used.
})//closes method