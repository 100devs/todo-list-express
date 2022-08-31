const express = require('express')//making it possible to use express in this file
const app = express()//seeting a variable and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient//setting a variable that makes it possible to use methods associated with Mongoclient and talk to our database
const PORT = 2121 //setting a constant to determine the PORT location where our server will be listening
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //declaring a variable, but NOT assigning it a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our db connection string stored in the env file
    dbName = 'todo'//declaring a variable and assigning the name of our database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string, also passing in an additional property
    .then(client => {//waiting for connection, and procceed when successful, we only want to do this stuff if this connection is successful 
        console.log(`Connected to ${dbName} Database`)//logging a template litteral, if succesful
        db = client.db(dbName)//assigning a value to previously declared DB variable that contains 'todo'
    })//closing .then

//middleware
app.set('view engine', 'ejs')//sets ejs as the default render method
app.use(express.static('public'))//sets location for static assets(photos, static stylesheets, html)
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode where URLs where the header matches the content, supports arrays and objects
app.use(express.json())//parses JSON content from inconming requests


app.get('/',async (request, response)=>{//starts a GET method when root route, starting an async function with two params req and res
    const todoItems = await db.collection('todos').find().toArray()//set varaible and awaits items from db collection 'todos' then finding everything (nothing specified) and converting to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets variable and awaits count of todos remaining uncompleted items to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering index.ejs and passing through db items and count remaining into an object
    // performing same action but as promise syntax
    //db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default so it works with CSS 
    .then(result => {//if insert is successful, then do osomething
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addToDo route and redirects to the home page
    })//closing then
    .catch(error => console.error(error))//catching errors
})//ending post

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks in the db for one item match then name of the item passed in the main.js file that was clicked on 
        //issue if there are duplicated, better to use ID as unique identifier
        $set: {
            completed: true//setting completed status to true
          }
    },{
        sort: {_id: -1},//sorts new items to the bottoms
        upsert: false //prevents insertion if item does not already exist 
    })
    .then(result => {//starts a then if update if it was successful
        console.log('Marked Complete') //console logging completion
        response.json('Marked Complete') //sending a response back to the sender 
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks in the db for one item match then name of the item passed in the main.js file that was clicked on 
        $set: {
            completed: false//setting completed status to false
          }
    },{
        sort: {_id: -1},//sorts new items to the bottoms
        upsert: false//prevents insertion if item does not already exist 
    })
    .then(result => {//starts a then if update if it was successful
        console.log('Marked Complete')//console logging completion
        response.json('Marked Complete')//sending a response back to the sender 
    })
    .catch(error => console.error(error))//catching errors

})//ending put

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item that has a matching name from the JS file
    .then(result => {////starts a then if update if it was successful
        console.log('Todo Deleted')//console log result
        response.json('Todo Deleted')//send response back
    })//close then
    .catch(error => console.error(error))//catch error

})//end delete

app.listen(process.env.PORT || PORT, ()=>{//specifying which port we should be listening on OR allowing us to use PORT variable
    console.log(`Server running on port ${PORT}`)//console log 
})//ending listen