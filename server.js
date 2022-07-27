//required variables to get all the npm stuff working correctly
const express = require('express') //loads express
const app = express() //define the variable needed to use express
const MongoClient = require('mongodb').MongoClient //importing mongodb functions
const PORT = 2121 //declaring the port
require('dotenv').config() //importing dotenv

//declaring global variables
let db, //declaring db
    dbConnectionStr = process.env.DB_STRING, //declaring the mongodb connection string, different for every user and should be hidden, in this case is hidden in local .env as DB_STRING 
    dbName = 'todo' //declaring the name of the database as todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to MongoDB, first param is the connection string, second is set to false by default, so changing that to true. Used to opt in to the MongoDB new connection management engine (i think?)
    .then(client => { //after connection, then the client does:
        console.log(`Connected to ${dbName} Database`)//console logs a connection message containing the name of the DB
        db = client.db(dbName) //assigning the declared DB variable a value, which is 'todo'
    })

//middleware functions, will be used to load the content correctly?
app.set('view engine', 'ejs') //sets view engine to EJS so it can produce HTML from the .ejs file
app.use(express.static('public')) //set server to auto produce files in the 'public' folder
app.use(express.urlencoded({ extended: true })) //parses incoming requests with urlencoded payloads. lets arrays and large objects to be passed through in correct format
app.use(express.json()) //parses incoming reqs with json

//get/READ, so pulling info
app.get('/',async (request, response)=>{ //home page of server
    const todoItems = await db.collection('todos').find().toArray() //declaring todoItems and storing as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //uncompleted items stored in an array
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the HTML and making sure that the correct items on the list get shown as completed or not
    //the following is functionality that was probably moved into the ejs file, its purpose is irrelevant currently
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//post, creating new content
app.post('/addTodo', (request, response) => { //accessed when user makes a post req to the /addTodo route, so adding a new item to the list?
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert new todo item into the current collection stored in DB
    .then(result => { //triggers after the previous line, takes the result and:
        console.log('Todo Added') // console.logs the message 'todo added'
        response.redirect('/') //sends user back to home page, which re-renders the content with updated list from the DB
    })
    .catch(error => console.error(error)) //console logs and errors
})

//put, so updating content
app.put('/markComplete', (request, response) => { //the /markComplete route, so updating items as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //conecting to the collection 'todos' and updating a specific entry
        $set: { //seting the value of something
            completed: true //seting the value of completed as true
          }
    },{
        sort: {_id: -1}, //should be sorting this specific item so that it would appear earlier in the list?
        upsert: false //if this were set to true, would update/insert item if it did not exist
    })
    .then(result => { //once it is updated
        console.log('Marked Complete') //console logs completed message
        response.json('Marked Complete') //send a json response that it is logged on the client's side
    })
    .catch(error => console.error(error)) //catches any errors and console logs them

})

//put, so updating content
app.put('/markUnComplete', (request, response) => { //the /markUnComplete route, so updating items that are not completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //conecting to the collection 'todos' and updating a specific entry
        $set: { //seting the value of something
            completed: false //seting the value of completed as true
          }
    },{
        sort: {_id: -1}, //should be sorting this specific item so that it would appear earlier in the list?
        upsert: false //if this were set to true, would update/insert item if it did not exist
    })
    .then(result => {//once it is updated
        console.log('Marked Complete') //console logs completed message (but should be uncomplete, not complete?)
        response.json('Marked Complete')  //send a json response that it is logged on the client's side
    })
    .catch(error => console.error(error))  //catches any errors and console logs them

})

//delete so removing an item from the DB
app.delete('/deleteItem', (request, response) => { //the /deleteItem route, removes item from the collection when we hit trash can
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //conecting to the collection 'todos' and deleting a specific entry
    .then(result => {  //once it is deleted
        console.log('Todo Deleted') //console logs deleted success message
        response.json('Todo Deleted') //send a json response that it is logged on the client's side
    })
    .catch(error => console.error(error)) //catches any errors and console logs them

})


//starts the server on the PORT that was declared earlier
app.listen(process.env.PORT || PORT, ()=>{ //uses env to start server on prot 2121
    console.log(`Server running on port ${PORT}`) //console logs connection message
})
