const express = require('express')//use express in this file
const app = express()//setting a variable and assiginnig to the instance of express
const MongoClient = require('mongodb').MongoClient//setting a variable MongoClient..makes it possible for us to use methods associated with MongoClient and talk to our database..and btw MongoClient is capitalized because its a class
const PORT = 2121//setting the port...where the server will be listening..all caps because standards say global values need to be
require('dotenv').config()//allows us to look for variables inside of the .env file


let db, //declaring the db variable
    dbConnectionStr = process.env. DB_STRING,//declaring the variblae and assigning our database connection string to it
    dbName = 'todo' //declaring a var and assigining the name of the database we will be using

    //heirarchy of mongoDB..cluster..databases...collections..documents

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDb and pasing in our connection string and also passing in another property..have no clue what it does..middleware?? 
    .then(client => {//waiting for the connection and proceeding if successful, this is a promise and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//connection to the todo database..logging that into console
        db = client.db(dbName)//assiging the db variable that contains a db client factory method
    })//closing the then
//middleware
app.set('view engine', 'ejs')//sets the default render method
app.use(express.static('public'))//sets hte location of static assets...html...additional style sheets, pics
app.use(express.urlencoded({ extended: true }))//telss express to encode and decode urls whereas header matches the content , supports arrays and methdos
app.use(express.json()) //parses json content..replaced bodyparser from the old days


//routes!!
app.get('/',async (request, response)=>{//when the root route is passed in, sets up the rec and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a varible and await ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable..and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs file and passing through the the db itmes and count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))

    //the above commented out code does the same thing...but with promises instead of awaits
})//closes the get method

app.post('/addTodo', (request, response) => {//starts a post method where the /addTodo is passed in...the /addTodo comes from the form directly
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item in the todo collection...this also comes from the form...gives it a completed value of false by default
    .then(result => {//if insert is succesfull do something
        console.log('Todo Added')//console log the action
        response.redirect('/')//redirects back to the route or else you are going to end up in different route..you orginally want to go back to the home page..where you started filling out the form, it gets rid of the addTodo route
    })//closing the then
    .catch(error => console.error(error))//catching errors
})//ending the post

app.put('/markComplete', (request, response) => {//starting a put method when a markcomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on, better to do with unique id from the database, because this takes into account the name which may not be unique
        $set: {
            completed: true
          }//set completed status to true
    },{
        sort: {_id: -1},//moves items to the bottom of the list
        upsert: false//prevents insertion(upsert= update and insert) if doesn't already exist
    })
    .then(result => {//starts a then if update is successful
        console.log('Marked Complete')//log in the console marked complete
        response.json('Marked Complete')//sending a response back to the sender
    })//closing the then
    .catch(error => console.error(error))//catching erros

})//ending the put

app.put('/markUnComplete', (request, response) => {//starting a put method when a markUncomplete is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in from the main.js file that was clicked on, better to do with unique id from the database, because this takes into account the name which may not be unique
        $set: {
            completed: false
          }//set completed status to false
    },{
        sort: {_id: -1},//moves items to the bottom of the list
        upsert: false//prevents insertion(upsert= update and insert) if doesn't already exist
    })
    .then(result => {//starts a then if update is successful
        console.log('Marked Complete')//log in the console marked complete..maybe should be 'marked uncomplete'
        response.json('Marked Complete')//sending a response back to the sender
    })//completing the then
    .catch(error => console.error(error))//catching errors

})//finishing the method
app.delete('/deleteItem', (request, response) => {//starts a delete method when the /deleteItem  is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//looking inside the todos collection for the ONE item that has a matching name from the js file
    .then(result => {//start a then if delete is successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending response in json back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//closing then

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on, either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)//console log the running port
})//closing the listen