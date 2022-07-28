const express = require('express') //requiring express
const app = express() //saying this app is an express app
const MongoClient = require('mongodb').MongoClient //using and talking to Mongo
const PORT = 2121 //declaring the localhost port
require('dotenv').config() //require a configuration file so we can store secret shiz in there


let db, //declaring a variable
    dbConnectionStr = process.env.DB_STRING, //declaring the connection key to the database to a variable
    dbName = 'todo' //assigning the name of the database to a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to Mongo and passing in the connection string, as well as an additional property
    .then(client => { //a promise saying to do things, but only if we successfully connect to the database
        console.log(`Connected to ${dbName} Database`) //console log db name
        db = client.db(dbName) //save a bunch of info about the database to a variable
    //close function
    })

//middleware
app.set('view engine', 'ejs') //establishing we're using EJS
app.use(express.static('public')) //sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the heads matches the content, supports arrays and objects
app.use(express.json()) //parse incoming requests to JSON


app.get('/',async (request, response)=>{ //handles a read request and starts a GET method, homepage root route gets passed in, then sets up req, res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL the to do items from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the count of the items that are NOT completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the response in the index.ejs file, pass through the db items and the count remaining using an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
//close request
})

app.post('/addTodo', (request, response) => { //handles a create request and starts a POST method, /addTodo route is used, then sets up req, res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //look in the database, find a collection called todos, insert a doc into that collection where the thing is the input, and it's not marked as complete
    .then(result => { //chaining a promise, if the insert works do the following
        console.log('Todo Added') //console log a success message
        response.redirect('/') //if the request has been completed, go home
    })
    //if there's an error console log it
    .catch(error => console.error(error))
//close request
})

app.put('/markComplete', (request, response) => { //handles an update request and starts a PUT method, /markComplete route is used, then sets up req, res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //looks at the collection todos, updates if the thing name matches whats passed in from the main.js file (what was clicked on)
        $set: { //set the following
            completed: true //set the item to completed
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //promise, says if the above is successful do the following
        console.log('Marked Complete') //success message
        response.json('Marked Complete') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //if there is an error console log it
})

app.put('/markUnComplete', (request, response) => {//handles an update request and starts a PUT method, /markUnComplete route is used, then sets up req, res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //looks at the collection todos, updates if the thing name matches whats passed in from the main.js file (what was clicked on)
        $set: { //set the following
            completed: false //set the item to NOT completed
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //promise, says if the above is successful do the following
        console.log('Marked Complete')//success message
        response.json('Marked Complete') //sending a response back to the sender
    })
    .catch(error => console.error(error)) //if there is an error console log it
})

app.delete('/deleteItem', (request, response) => {//handles a detele request and starts a DELETE method, /deteleItem route is used, then sets up req, res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//looks at the collection todos, updates if the thing name matches whats passed in from the main.js file (what was clicked on)
    .then(result => {//promise, says if the above is successful do the following
        console.log('Todo Deleted')//success message
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error)) //if there is an error console log it
})

app.listen(process.env.PORT || PORT, ()=>{ //listen for the app on the previously defined port
    console.log(`Server running on port ${PORT}`) //console log a success message when port is opened and app is running
})