//These are all the dependencies needed for the app to work.
//makes it possible to use express
const express = require('express')
//assigns express to the variable "app"
const app = express()
//this lets us talk to the database and use Mongo
const MongoClient = require('mongodb').MongoClient
//this assigns the port numbeer to a variable.
const PORT = 2121
//this loads files from the .env file. 
require('dotenv').config()

//this creates the database at the mongo link provided in .env nad names it 'todo' while declaring the "db" variable.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connection to mongodb with our connection string 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //logs a confirmation that we successfully connected to the console. 
        console.log(`Connected to ${dbName} Database`)
        //assigning a value to previous declared db variable(line 14) that contains a db client factory method
        db = client.db(dbName)
    })

//this section is what lets us use middleware
//this lets us use the ejs template engine that comes with express
app.set('view engine', 'ejs')
//this lets us use static files with express and serve them in a directory named "public"
app.use(express.static('public'))
// a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This and the following method are what replace bodyparser which is depreciated. 
app.use(express.urlencoded({ extended: true }))
//a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json()) 

//this gets the data we have stored in the "todos" collection of our mondo database when requested. GET request.
app.get('/',async (request, response)=>{
    //set a variable called todoItems and awaits all items from the todos collecton eg: go to the todos collection and find everything then put it into an array
    const todoItems = await db.collection('todos').find().toArray()
    //set another variable called itemsLeft to await a count to uncompleted items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //this then renders both new variables in the corresponding place in index.ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//this posts new todos in the database when they are entered in the form in index.ejs
app.post('/addTodo', (request, response) => {
    //inserts new item to todos collection, gives it a completed value of false by default (comes from form input that has a name called todoItem. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //when post is successful, log "todo added" to the console
    .then(result => {
        console.log('Todo Added')
        //redirects to home page
        response.redirect('/')
    })
    //this handles any errors if they occur above. 
    .catch(error => console.error(error))
})

//this handles what happens when we mark an item on the list as complete 
app.put('/markComplete', (request, response) => {
    ////look in the db for one item matching the name of the item passed in from the main.js file that was clicked on (updateONe then do something)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets completed status to true
        $set: {
            completed: true
          }
    },{
       //moves item to the bottom of the list 
        sort: {_id: -1},
        //doesn't insert into db if it doesn't already exist.
        upsert: false
    })
    .then(result => {
        //log 'marked complete' in the console 
        console.log('Marked Complete')
        //send same response back to sender
        response.json('Marked Complete')
    })
    //catches errors
    .catch(error => console.error(error))

})

//this handles what happens when we mark an item on the list as uncomplete 
app.put('/markUnComplete', (request, response) => {
    //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on (updateONe then do something)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets completed status to false
            completed: false
          }
    },{
        //moves item to the bottom of the list 
        sort: {_id: -1},
        //doesn't insert into db if it doesn't already exist.
        upsert: false
    })
    .then(result => {
        //log 'marked complete' in the console 
        console.log('Marked Complete')
        //send same response back to sender
        response.json('Marked Complete')
    })
    //catches errors
    .catch(error => console.error(error))

})

//starts delete method for when item is deleted
app.delete('/deleteItem', (request, response) => {
    //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on (deleteOne then do something)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//this sets up the app to listen at the port specified at the top of file. 
app.listen(process.env.PORT || PORT, ()=>{
    //confirms server is running with this message in the console.
    console.log(`Server running on port ${PORT}`)
})