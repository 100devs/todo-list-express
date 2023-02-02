const express = require('express')//makes it possible to use express in this file
const app = express()//setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//This allows us to talk to our mongo database using methods associated with MongoClient
const PORT = 2121//setting a variable to hold our port location where our server will be listening
require('dotenv').config()//lets us use the dotenv to access what we put in there


let db,//declare a variable called db but not assigning it a value yet
    dbConnectionStr = process.env.DB_STRING,//declare a variable and assign our db string to it, which is found in the .env file
    dbName = 'todo'//we declare a variable and set the name of the database that we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongdb and passing in our connection string, and then passing in an additional property useUnifiedTopology
    .then(client => {//waiting for the connection and proceeding if succesful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to console a template literal telling us that we are connected to todo database.
        db = client.db(dbName)//assigning a value to our previously declared db variable that contains a db client factory method
    })//closing our .then method
 
//middleware section helps facilitate our communication
app.set('view engine', 'ejs')//lets us use our ejs basically as the default render method
app.use(express.static('public'))//tells express to set the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URL's where the header matched the content. Supports arrays and objects
app.use(express.json())//allows us to parse json, this replaces bodyParser


app.get('/',async (request, response)=>{//express method to do a (read) get request to the '/' main  root route, then runs an async function with a req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits the todo collection in our mongo db then finds them all and returns them in an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable that gois into our collection todos from our mongodb then counts the documents that have the completed property to false then returns that number
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//we get the response that we want to send and render our ejs file which is our html and pass in the items property and the left property and their values to the two variables we set above.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))//our error handling, if there is ann weerror with the promise we console the error
})//we close the get method

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})