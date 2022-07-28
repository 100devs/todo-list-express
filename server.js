const express = require('express')//makes express usable and assigns it to the variable express
const app = express()//setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with Mongo and talk to out db
const PORT = 2121//setting out default port to a variable to define the location our server should be listening
require('dotenv').config()//allows us to look for our variables inside of the .env files


let db,//declare a variable called db but does not assign a variable
    dbConnectionStr = process.env.DB_STRING,// assigning our db connection string to the variable dbConnectionString
    dbName = 'todo'//assigning our db name to a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creates a connection to Mongo, and passes in connection string. Also passing on a property
    .then(client => {//waits for the connection and continues if successful and passes in all the client info
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal stating we've connected to the database
        db = client.db(dbName)// assigning a value to previously declared db variable that contains a db client factory method
    })// closes the 'then'
//middleware    
app.set('view engine', 'ejs')//sets ejs as the default render method
app.use(express.static('public'))//sets the location for static assets to those in public
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where the header matches the content. supports arrays and objects
app.use(express.json())//parses JSON from incoming request


app.get('/',async (request, response)=>{// starts a get when the route is passed in, sets req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display with EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//renders the EJS file and passes through the db items and the count of remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {// starts a POST method when the addToDo route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into the todos collection and sets the value of completed to false to begin with
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console logs what we've done
        response.redirect('/')//redirects to the home page
    })//closes the 'then'
    .catch(error => console.error(error))//catches error and logs them to console
})//ends the post

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for an item matching the name of the item passed
        $set: {
            completed: true//sets the completed value to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then block if update was successful
        console.log('Marked Complete')// logging successful completion
        response.json('Marked Complete')//sends response back to the sender
    })//closes the 'then'
    .catch(error => console.error(error))//catches errors and logs them to console

})//ends put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed
        $set: {
            completed: false//sets the completed value to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list 
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closes then
    .catch(error => console.error(error))//catches errors and logs them

})//ends put

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the one item matching the name of the item passed
    .then(result => {//starts a then if delete was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sends a response back to sender
    })//closes the 'then'
    .catch(error => console.error(error))//catches errors and logs them

})// closes the delete

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on, either the port from .env or the PORT
    console.log(`Server running on port ${PORT}`)//console.log the running port
})//closes the listen