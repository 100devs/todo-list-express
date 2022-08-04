const express = require('express')// making express available to use
const app = express()//saving the call to express as app or saving an instance ofexpress to the variable app
const MongoClient = require('mongodb').MongoClient// makes it possible to use methods with MondoClient and talk to our DB
const PORT = 2121 //setting a variable to assign our port where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declaring a variable of db globally so it can be used anywhere
    dbConnectionStr = process.env.DB_STRING,// declaring a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a variable and assigning the name of database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connectiont o MongoDb and passing in our connection string.
    .then(client => {//After the connection is established do the following.
        console.log(`Connected to ${dbName} Database`)//log to the console "connected to todo Database"
        db = client.db(dbName)//assign value to the declared db variable that contians a db client factory method
    })//closing our .then
    
app.set('view engine', 'ejs')// sets ejs as the default render method
app.use(express.static('public'))// sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the header matched the content. Supports arrays and objects
app.use(express.json())//Helps parse JSON content


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, sets up req and res parameters.
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside the object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the addTodo route is passed in. This is triggered by the action = '/addTodo' form the form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into the todos collection. The value of thing comes from the request that was sent and the request is coming from the textbox of the form. Completed is false because it is a newly added task.
    .then(result => {//if successful then do the following
        console.log('Todo Added')//log 'todo added' to the console
        response.redirect('/')//gets rid of the /addTodo route and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//catching the errors
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true//setting the completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logs successful completion to the console
        response.json('Marked Complete')//this is sent to the markComplete await function in the main.js document and logged to the data variable there. This response is sent back to the sender.
    })//closing .then
    .catch(error => console.error(error))//catching errors
})//ending PUT

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false//setting the completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logs successful completion to the console
        response.json('Marked Complete')//this is sent to the markUnComplete await function in the main.js document and logged to the data variable there. This response is sent back to the sender.
    })//closing .then
    .catch(error => console.error(error))//catching errors
})//ending PUT

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => {//starts a then if update was successful
        console.log('Todo Deleted')//logs successful completion to the console
        response.json('Todo Deleted')//this is sent to the deleteItem await function in the main.js document and logged to the data variable there. This response is sent back to the sender.
    })//closing .then
    .catch(error => console.error(error))//catching errors
})//ending DELETE

app.listen(process.env.PORT || PORT, ()=>{//setting up the port to listen to which can get it out of the .env file or the PORT variable
    console.log(`Server running on port ${PORT}`)//logs msg to the console.
})//ending LISTEN