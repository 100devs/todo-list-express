const express = require('express')//make it possible to use express in this file
const app = express()//assigning express to the variable app
const MongoClient = require('mongodb').MongoClient// makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121//setting const to determine location where our server will be listening
require('dotenv').config()//allows us to look for variables inside the .env file (grants accesss)


let db,//declaring db var, not assigning single value yet
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our db connection string to it 
    dbName = 'ToDoLeon'//setting dbName to a var

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and passing in connection string and passing in an additional property
    .then(client => {// waiting for the connection and proceeding if successful , and passing in client info
        console.log(`Connected to ${dbName} Database`)//log db name to console 
        db = client.db(dbName)//assigning a value to a previously declared db var that contains a db client factory method
    })//closing our .then
    
    //middleware
app.set('view engine', 'ejs')//sets ejs as the default render
app.use(express.static('public'))//sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decone and encode URL where the header matcher the content,extended :true supports arrays and objects
app.use(express.json())//helps us parse json content from incoming requests


app.get('/',async (request, response)=>{//starts a GET method when the route route is passed in,sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the 'todos' collection and puts into array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets variable and awaits a count of UNCOMPLETED items to display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs file and passing through the db items and the count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//looks inside the db , goes to the collection 'todos' , inserts the (task we enter in the input)and name of form as a 'thing' property with a 'completed' property of false ( so it does not have a strike through the text as a completed item does)
    .then(result => {//if insert successful do something
        console.log('Todo Added')//log action to the console
        response.redirect('/')//routes back to the home page after the /addTodo route
    })//closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the /markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks in db collection for 'todos' that matches the name of the item passed in from the main.js file that was clicked on 
        
        $set: {
            completed: true // set completed status to true 
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was sucessful  
        console.log('Marked Complete')//log sucessful completion
        response.json('Marked Complete')//mark complete function in main.js awaits this response .. sending response back to sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the /markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks in db collection for 'todos' that matches the name of the item passed in from the main.js file that was clicked on 
        
        $set: {//set completed status to false
            completed: false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was sucessful  
        console.log('Marked Complete')//log sucessful completion
        response.json('Marked Complete')//sending res back to sender
    })//closing then 
    .catch(error => console.error(error))//catching errors

})//ending put

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the /deleteItem route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//looks in db collection for 'todos' that matches the name of the item passed in from the main.js file that was clicked on 
    .then(result => {//if insert successful do something
        console.log('Todo Deleted')//log successful deletion 
        response.json('Todo Deleted')//send response back to sender
    })//closing then 
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//telling express to listen for the port number -.env file OR var we set
    console.log(`Server running on port ${PORT}`)//console.log the running port
})//end listen method