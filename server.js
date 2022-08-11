const express = require('express')//makes it possible to use express -- this line imports express so it need to be installed 
const app = express()//this line shortens express so we can just use app -- and defines the express function
const MongoClient = require('mongodb').MongoClient //import mongoclient --  alows us to use mongo methods to talk to DB
const PORT = 2121//sets a deault port num --this is hardcoded to that one number
require('dotenv').config() //imports dotenv variable from the .env file 


let db, //declares db variable or DATABASE
    dbConnectionStr = process.env.DB_STRING, // provides the unique url tied to the mongoDB atlas database
    dbName = 'todo' // name of the database assigned to variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // this creates the monogoclient function to connect, the string points to the right cluster -- the nexxt bit allows for the use of promises instead of callbacks
    .then(client => { //passing in the client information if succesful
        console.log(`Connected to ${dbName} Database`) //logs the cluster name to the console
        db = client.db(dbName) //assigns db variable adds/conects a collection 
    })//close
  
//MIDDLEWARE
app.set('view engine', 'ejs') //sets the view engine to use ejs for templating and spitting out  html files
app.use(express.static('public')) // sets the location for static assetts -- sets the server to autromatically serve any files in the public folder 
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content supports arrays and objs
app.use(express.json()) // parseJSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the route is passed in sets up a req and res params
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items formt he to do collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render our EJS and passing throught the bd items and the count remaining inside an obj
    //  db.collection('todos').find().toArray()//this takes the remaining todo data and puts it into a readable array
    //  .then(data => { // when the promise resolves succesfully data function runs
    //     db.collection('todos').countDocuments({completed: false}) // this updates the todos count 
    //      .then(itemsLeft => {// .then goes when the promise resolves succesfully
    //          response.render('index.ejs', { items: data, left: itemsLeft })// this line puts the info in ejs so it can be convertted to html
    //      })
    //  })
    //  .catch(error => console.error(error)) //if an error occurs it will be printed to the console
}) //closes get block

app.post('/addTodo', (request, response) => { //this line sets up for updating the db with more or less todos
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //this adds one to the todo db
    .then(result => {// .then goes when the promise resolves succesfully
        console.log('Todo Added') //this logs the togo added to console
        response.redirect('/') //this refreshes the page after todo added so it appears
    })
    .catch(error => console.error(error)) // this line prints an error if there is one
})

app.put('/markComplete', (request, response) => {//this line updated and marks a todo as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//this goes into the db and updates it
        $set: { //outputs documents that contain all existing fields from the input documents and newly added fields.
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //removes one from the id
        upsert: false // MongoDB upsert option is used with update method which creates a new document if the query does not retrieve any documents satisfying the criteria. The default value for this option is false.
    })
    .then(result => { //.then runs when the promise resolves succesfully
        console.log('Marked Complete') // logs marked complete
        response.json('Marked Complete') //puts this in json format
    })
    .catch(error => console.error(error)) //prints err to console

}) //close

app.put('/markUnComplete', (request, response) => {//this line updated and marks a todo as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// add to todo db
        $set: {//outputs documents that contain all existing fields from the input documents and newly added fields.
            completed: false //sets completed status to false
          }
    },{
        sort: {_id: -1}, //removes one from id list
        upsert: false // MongoDB upsert option is used with update method which creates a new document if the query does not retrieve any documents satisfying the criteria. The default value for this option is false.
    })
    .then(result => { //.then runs when the promise resolves succesfully
        console.log('Marked Complete') //logs to console
        response.json('Marked Complete') //converts to json format
    })//clos then
    .catch(error => console.error(error)) // logs err to console

})//close put

app.delete('/deleteItem', (request, response) => { //starets a delete method when the delete route is passed -- 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looks ubsude tge tidis collection for the one item that has a mathcin name fom our JS file -- goes into db and removes req item
    .then(result => {  //.then runs when the promise resolves succesfully
        console.log('Todo Deleted') //logs line to console
        response.json('Todo Deleted') //converts to json format
    })
    .catch(error => console.error(error)) //prints err to console

})//close block

app.listen(process.env.PORT || PORT, ()=>{ //tuns on port or runs on the named port from heroku whicever makes sense
    console.log(`Server running on port ${PORT}`) //logs to console that server is running 
})//close 