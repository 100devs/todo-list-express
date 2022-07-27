const express = require('express') //imports express into the node server as express
const app = express() // app will now use the express which makes syntax easier later
const MongoClient = require('mongodb').MongoClient //imports mongoClient for mongodb
const PORT = 2121 //Sets the port the server will be running on
require('dotenv').config() //Requires the dotenv node package to allow us to separate database connections without posting them to github or online.


let db, //declares a db variable, currently empty
    dbConnectionStr = process.env.DB_STRING, //creates the d bConnectionStr variable and sets it equal to the Database url string stored in the .env file
    dbName = 'todo' //Creates a variable called dbName that we store the data base name for mondodb in so it is easier to change if we need to late in one place

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connection to mongodb string stored earlier, and useUnifiedTopology allows us to use MongoDB's new management engine
    .then(client => { //promise chain if we connect to the database
        console.log(`Connected to ${dbName} Database`) // logs we connected to the database
        db = client.db(dbName) /// stores the client database collection name in db
    })
    
app.set('view engine', 'ejs') //sets the view engine to EJS for using a template style and using javascript within markdown
app.use(express.static('public')) //tells express to look into the public folder to distribute the files
app.use(express.urlencoded({ extended: true })) // Parses the incoming requests with urlencoded payloads. Extended True allows for rich objects and arrays to be encoded into the URL-encoded format 
app.use(express.json()) //parses incoming request with JSON payload


app.get('/',async (request, response)=>{ //the get request for the main route or root route
    const todoItems = await db.collection('todos').find().toArray() //goes to mongo db and lists all the items in the collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // goes into mongodb and counts all of the ones that currently are incomplete
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the EJS passing through them items we just stored above
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // receives the post request from our browser 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // takes our post request and adds the new todo item to the database with a default completion state of false
    .then(result => { // continues the promise chain awaiting a response, once the response is received the rest of the code runs
        console.log('Todo Added') // logs Todo Added
        response.redirect('/') // redirects the user to the root directory/page, which happens to be the page the user was already on
    })
    .catch(error => console.error(error)) // if there is an error, the logs the error in the console
})

app.put('/markComplete', (request, response) => { // creates an update request to the server under the /markCompleted url
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes into the database and updates one item that matches the item noted
        $set: { // creates the change
            completed: true // changes completed to equal true
          }
    },{
        sort: {_id: -1}, // not sure if this has an effect
        upsert: false // this is the default, true would update and add item if it does not exist
    })
    .then(result => { // if all of this works, and a result response is received completing promise chain
        console.log('Marked Complete') // log marked completed
        response.json('Marked Complete') //sends a response to the client saying marked completed
    })
    .catch(error => console.error(error)) //if something goes wrong log the error

})

app.put('/markUnComplete', (request, response) => { //creates another update request from the server
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //finds the item from the body of the ejs in the database
        $set: { // allows us to change the files in the entry
            completed: false //changes completed to false
          }
    },{
        sort: {_id: -1}, // not sure if this is doing anything
        upsert: false // this is the default, true would update and add item if it does not exist
    })
    .then(result => { // if all of this works, and a result response is received completing promise chain
        console.log('Marked Complete') // log marked completed
        response.json('Marked Complete') //sends a response to the client saying marked completed
    })
    .catch(error => console.error(error)) //if something goes wrong log the error

})

app.delete('/deleteItem', (request, response) => { //receives and creates a delete response to mongodb
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes the specific item from mongodb
    .then(result => { // from the promise chain if a response is received
        console.log('Todo Deleted') // log todo deleted
        response.json('Todo Deleted') // send a response to the client saying response deleted
    })
    .catch(error => console.error(error)) // if there is an error log it

})

app.listen(process.env.PORT || PORT, ()=>{ //this is the listen port for the node server, if something like heroku wants a different port allows that override on the left side of the OR operator
    console.log(`Server running on port ${PORT}`) //logs the current port the server is running on on the node server
})