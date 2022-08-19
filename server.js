const express = require('express') //use the express module
const app = express() //use const app to call express methods
const MongoClient = require('mongodb').MongoClient //use the mongodb module and create a client
const PORT = 2121 //set the port
require('dotenv').config() //use the .env configurations


let db, //create a db variable
    dbConnectionStr = process.env.DB_STRING, //take the .env DB_STRING configuration, which has a username and password, and store it in the dbConnectionStr variable (this anonymizes it to protect it on a git repository)
    dbName = 'todo' //store this string in the dbName variable, this abstracts the code for any database name (shouldn't this really be centralized in the .env configurations?)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect the mongo client using the hidden database string and a flag showing you aren't using deprecated mongo code
    .then(client => { //after it connects, pass in the returned client
        console.log(`Connected to ${dbName} Database`) //log that you've successfully connected the server to the dbNamed database
        db = client.db(dbName) //set the client connected to that database into the (easier to type) db variable
    })
    
app.set('view engine', 'ejs') //have the app use the ejs view engine (renders html in browser, ejs allows javascript injection)
app.use(express.static('public')) //pass in the public folder as static files for express to use
app.use(express.urlencoded({ extended: true })) //express will be reading urlencoded data; extended: true specifies to use the qs library
app.use(express.json()) //express will be reading json


app.get('/',async (request, response)=>{ //if a get request is called on /, then do this asynchronous function
    const todoItems = await db.collection('todos').find().toArray() //wait to find the items in the todos database and put them in an array and stick them in the todoItems constant
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //wait to count how many items in the todos database have their completed value as false, and stick that in the itemsLeft constant
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tell the browser to render index.ejs while passing in the todoItems and the itemsLeft constants
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))

    //the above commented-out code is an alternative attempt to do the same as the uncommented-out code using promise-chaining rather than async-await
})

app.post('/addTodo', (request, response) => { //if a post request is called on /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert an object into the todo collection with the thing of todoItem and marked not completed
    .then(result => { //then (promise chain)
        console.log('Todo Added') //log in the console you added a new item to the database
        response.redirect('/') //redirect the page (get) to /
    })
    .catch(error => console.error(error)) //if any promise breaks, log error in console
})

app.put('/markComplete', (request, response) => { //if a put request is made to /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the first item matching the requested
        $set: { //and set
            completed: true //completion to true
          }
    },{
        sort: {_id: -1}, //sort the database by _id in descending order
        upsert: false // there is no update-and-insert
    })
    .then(result => { //then (promise chain)
        console.log('Marked Complete') //log in the console that you marked an item complete
        response.json('Marked Complete') //send a json response that you marked an item complete
    })
    .catch(error => console.error(error))//if any promise breaks, log error in console

})

app.put('/markUnComplete', (request, response) => { //when a put request is made to /markUncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the first item matching the request
        $set: { //and set
            completed: false //completion to false
          }
    },{
        sort: {_id: -1}, //sort the database in descending order
        upsert: false //and no update-and-insert occured
    })
    .then(result => { //then (promise chain)
        console.log('Marked Complete') //log in the console you marked an item complete
        response.json('Marked Complete') //send a json response you marked an item complete
    })
    .catch(error => console.error(error)) //if any promise breaks, log error in console

})

app.delete('/deleteItem', (request, response) => { //if a delete request is made through /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find the first item matching the requested and delete it
    .then(result => { //then (promise chain)
        console.log('Todo Deleted') //log in the console item was deleted
        response.json('Todo Deleted') //send a json response that item was deleted
    })
    .catch(error => console.error(error))//if any promise breaks, log in console

})

app.listen(process.env.PORT || PORT, ()=>{ //have the server listen through the port specified by .env, or the default port set earlier if no .env port configged
    console.log(`Server running on port ${PORT}`) //log in the console that the port is running
})