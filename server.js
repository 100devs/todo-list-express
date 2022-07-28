//imports express and allows node to use it
const express = require('express')
//lets you use app and run any express methods off of it
const app = express()
//imports mongo client and allows express to use it
const MongoClient = require('mongodb').MongoClient
//creats a variable that's used to tell the server to run on port 2121
const PORT = 2121
//allows node to use dotenv to hide certain variables that we dont want to be public when pushing to github
require('dotenv').config()

//creates a db variable, the connection string to the db which is being stored in a dotenv variable to hide it from github, and the name of the db to connect to
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connects to mongoclient with the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //tells you if you're connected
        console.log(`Connected to ${dbName} Database`)
        // sets db equal to the database from mongoclient with dbName
        db = client.db(dbName)
    })

//lets you use ejs to template create html with databse information
app.set('view engine', 'ejs')
//makes it so thatg you don't have to hard code get requests to every file inside public in your api, files inside public will be done automatically by express
app.use(express.static('public'))
//parses html post forms
app.use(express.urlencoded({ extended: true }))
//allows use to turn the information sent in fetch requests from the front end into JSON so we can parse through it on the backend
app.use(express.json())

//this is a get/read request that is done on the homepage, asynchronously
app.get('/',async (request, response)=>{
    //asynchronously sets the variable to the items in the todos collection of the database and turns them into an array
    const todoItems = await db.collection('todos').find().toArray()
    //counts the number of documents that have the completed property set to false, therefore saying how many items are still left to do
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends this information from the databse to index.ejs so that it can be put into the dom with html templating
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    //this is what it would look like without async/await

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//this is create request with is sent to the path /addTodo
app.post('/addTodo', (request, response) => {
    //go to the db, find todos collection, and add this item with these properties, the thing is taken from the html form 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //tells you when it is done in the console
        console.log('Todo Added')
        //redirects you to the homepage so you can see your new entries
        response.redirect('/')
    })
    //catches any errors and displays in the console
    .catch(error => console.error(error))
})

//this is an update request on the path /markComplete to updated when an item on the todo list has been completed
app.put('/markComplete', (request, response) => {
    //go to the db, collection todos, and update the thing with the name 'itemFromJS' in the body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //update whats in set, setting completed to true
        $set: {
            completed: true
          }
    },{
        //this sorts them in descending order and picks first one if multiple matches
        sort: {_id: -1},
        //will not add an entry if no match is found
        upsert: false
    })
    .then(result => {
        //console says if completed
        console.log('Marked Complete')
        //respond to the front end to let it know its completed
        response.json('Marked Complete')
    })
    //catches any errors and shows in console
    .catch(error => console.error(error))

})

//an update request on path markUncomplete to change items from complete if necessary
app.put('/markUnComplete', (request, response) => {
    // go to db collection todos and update the item that matchs 'property thing = whatever is held in request.body.itemFromJS'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //updates are done in the set, set completed property to false
        $set: {
            completed: false
          }
    },{
        //sort in descending order and pick highest one if multiples
        sort: {_id: -1},
        //do not add an entry if no matches are found
        upsert: false
    })
    .then(result => {
        //console tells you if completed
        console.log('Marked Complete')
        //tells the front end that it has been completed
        response.json('Marked Complete')
    })
    //any errors are caught here and showed in console
    .catch(error => console.error(error))

})

//a delete request api on the path deleteItems to remove items from your todo list
app.delete('/deleteItem', (request, response) => {
    //go to db, collection todos, and delete the item that matches thing property = the request.body.itemFromJS which is from the body of the request object sent from the front end
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console tells you when its completed
        console.log('Todo Deleted')
        //tells front it its been deleted
        response.json('Todo Deleted')
    })
    //catches any errors and shows in the console
    .catch(error => console.error(error))

})

//tells your server to run on either the port you specified or the PORT that heroku specifies
app.listen(process.env.PORT || PORT, ()=>{
    //shows in the console once your server starts running and says the port you're on
    console.log(`Server running on port ${PORT}`)
})