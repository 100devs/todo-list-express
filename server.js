const express = require('express')//making it possible to use express in this file
const app = express()//setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//mongoclient helps connect to the database , mongobd is the location we are storing the data at, makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121// setting a variable to determine the location where our server will be listening
require('dotenv').config()//allows us to look for variables inside the .env file


let db, //declare a varible called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a varible and assigning the name of the database we will be using (cluster>databases>collections> documents)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Creating a connection to mongoDB and passing in our connection string. also passing in an additional property
    .then(client => {//establishing a promise, Waiting for the connection and proceeding if successful and passing in all the client information 
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal 'connected to todo Database'
        db = client.db(dbName)//assigning a value to previously declared db variable that contains a db client factory method
    })//closing our .then
    


 //MIDDLEWARE CODE   
app.set('view engine', 'ejs') //setting ejs as the default to be rendered
app.use(express.static('public'))//sets the location for static assets
app.use(express.urlencoded({ extended: true }))//Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json())//Parses JSON content from incoming requests


app.get('/',async (request, response)=>{//READ= GET , starts a GET method when the root is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of numbers uncompleted
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a complete value of false by default
    .then(result => {//if insert is successdful do something
        console.log('Todo Added')//console log action
        response.redirect('/')//redirct back to the route// gets rid of the /addTodo route, and redirects back to the homepage
    })//closes the .then
    .catch(error => console.error(error))//catching errors
})//ending the post

app.put('/markComplete', (request, response) => {//PUT = UPDATE , starts a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true//set complete status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion id item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//console logs as Marked Complete
        response.json('Marked Complete')// sending a response back to the sender
    })//closing .then 
    .catch(error => console.error(error))//catching error

})//ending put 

app.put('/markUnComplete', (request, response) => {//PUT = UPDATE , starts a put method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false//set complete status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion id item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked UnComplete')//console logs as Marked UnComplete
        response.json('Marked UnComplete')// sending a response back to the sender
    })//closing .then 
    .catch(error => console.error(error))//catching error

})//ending put 

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the one item that has a matching name from our JS file
    .then(result => {//starts a then if delete was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on -either the port from the .env file or the port variable we set 
    console.log(`Server running on port ${PORT}`)//console log the running port
})//end the listen