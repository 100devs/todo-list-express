const express = require('express')// enables us to use express
const app = express()// declaring app variable to call express methods.
const MongoClient = require('mongodb').MongoClient//class that lets us use methods of the client and talk to DB 
const PORT = 2121 // ESTABLIshinG Port , global variable which is why its ALL CAPS
require('dotenv').config() // enables us to access the .env file


let db, //Declaring variable
    dbConnectionStr = process.env.DB_STRING, // assigning .env.db_string to dbConnectionStr to be able to use
    dbName = 'todo' // naming database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to client using function and passing key, passing additional property 
    .then(client => {// then method because promise is made
        console.log(`Connected to ${dbName} Database`)// logging connection established if okay
        db = client.db(dbName)// assign name of client to db// assigning to dbvariable db client method
    })// close
//middleware   
app.set('view engine', 'ejs')// lets us use ejs
app.use(express.static('public'))// lets us use files in public folder
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where the header matches the content and supports arr and obj  
app.use(express.json())// lets us use json


app.get('/', async (request, response) => {// read request to the root route , async rq and res parameters
    const todoItems = await db.collection('todos').find().toArray()// sets variable and awaits all items to to create an array from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })// sets a variable and awaits count that are marked false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//render index.ejs and passes obj todoItems and the left itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a post method when add route is passed
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })// to do db is called and inserts a new item called thing with a value of todoItem and completed being false
        .then(result => {
            console.log('Todo Added')// logs todo was added
            response.redirect('/')//refreshes page route is called
        })// closing .then
        .catch(error => console.error(error))// error catch handling which prints if error is found
})// ends the post

app.put('/markComplete', (request, response) => {// starts put method when markcompleted route is used
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {// looks in database for one item passed in from main.js that was clicked on 
        $set: {
            completed: true// changes value to true because it is being marked as completed
        }
    }, {
        sort: { _id: -1 },// moves item to bottom of the list 
        upsert: false// if the value did no exist it would insert it, so prevents insertion of item not found
    })
        .then(result => {// if update was successful
            console.log('Marked Complete')// log success
            response.json('Marked Complete')// repond with json marked complete
        })
        .catch(error => console.error(error))// error catch

})

app.put('/markUnComplete', (request, response) => {// starts a put with a markuncomplete route
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {// looks for one item in  from main.js that was clicked on 
        $set: {
            completed: false// changing the item to not done
        }
    }, {
        sort: { _id: -1 },// item to the bottom of the list
        upsert: false// prevents insertion if not there
    })
        .then(result => {// if true
            console.log('Marked Complete')// logs
            response.json('Marked Complete')// returns for main js to log
        })
        .catch(error => console.error(error))// error catching

})

app.delete('/deleteItem', (request, response) => {// delete method through deleteItem route
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })//looks for one item in  from main.js that was clicked on 
        .then(result => {// checks if true
            console.log('Todo Deleted')// logs deleted
            response.json('Todo Deleted')// returns json that it is deleted
        })
        .catch(error => console.error(error))// error catch

})

app.listen(process.env.PORT || PORT, () => {// listening on the port .env to be able to use on heroku
    console.log(`Server running on port ${PORT}`)// logs the port its running on
})