const express = require('express') //let us use express in the backend.
const app = express() //gives it the 'app' variable so its ready to use.
const MongoClient = require('mongodb').MongoClient //set up for the database
const PORT = 2121  //port variable
require('dotenv').config() //lets us use our env file for hiding passwords etc


let db,
    dbConnectionStr = process.env.DB_STRING, //the variable holding the db connection string
    dbName = 'todo' //database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to the database
    .then(client => { //unified true is yes to the new drivers. //promise that executes after connection
        console.log(`Connected to ${dbName} Database`) //tells us in the console we're connected successfully
        db = client.db(dbName) //puts all of the database info into just DB
    })
    
app.set('view engine', 'ejs') // lets us use embedded Java Script
app.use(express.static('public')) //sets up a directory to serve static files (in public folder)
app.use(express.urlencoded({ extended: true })) //lets us uswe the  req.body object
app.use(express.json()) // req.body


app.get('/',async (request, response)=>{ //get request. reloads page.
    const todoItems = await db.collection('todos').find().toArray() // looks in db collections. finds todo-all. gives it as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// counts how many documents are left
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//reload the original index page
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //how you add to the todo list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => { //above looks in db collection todo, adds one- as an object that is a thing, todo item, and sets completed to false
        console.log('Todo Added') //after thats done it console logs that its been added
        response.redirect('/') //reloads the page
    })
    .catch(error => console.error(error)) //console logs any errors that happened in above
})

app.put('/markComplete', (request, response) => { //changes the todo item to completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //looks in db collection under todos then updates one thing object. It matched the 'itemfromjs' on the client side js file to run this function.  
            completed: true //changes completed to true if this function runs
          }
    },{
        sort: {_id: -1}, //sorts top to bottom
        upsert: false  //doesnt create a new object if one doesnt exist
    })
    .then(result => {
        console.log('Marked Complete') //tells you in  the console that its complete
        response.json('Marked Complete') //json object sent with string marked complete
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //runs once the item is clicked on when its alreay completed. updates the item from the mainJS to run the uncomplete function
            completed: false //changes it to flase
          }
    },{
        sort: {_id: -1}, //sorts  up to down
        upsert: false //doesnt insert a new one if not found
    })
    .then(result => {
        console.log('Marked Complete') //console log complete
        response.json('Marked Complete') //json object sent
    })
    .catch(error => console.error(error)) //errors

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => { //client clicks garbage can and runs this function to delete. looks in collections, todo, item, matches info then deletes the document
        console.log('Todo Deleted') //console log deleted
        response.json('Todo Deleted') //the object json response
    })
    .catch(error => console.error(error)) //errors

})

app.listen(process.env.PORT || PORT, ()=>{ //sets up the node server to listen for requests
    console.log(`Server running on port ${PORT}`) //console logs which server is running
})