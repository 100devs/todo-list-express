
// Install the neccessary dependency package for this project

// Express is framework used for building backend applications with javascript

const express = require('express')
// express() is top level function  provided by the express module  to create an express application


const app = express()
// Intsall the Mongodb to connect our epxress to database
const MongoClient = require('mongodb').MongoClient
// define the port number where application is running

const PORT = 2121
// Install the dotenv package to loads the enviroments variables from .env file into process.env 
require('dotenv').config()

// create a variable for db, database connecting string, database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the mongodb client with connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// set the view engine to ejs
// template engine enables you to use static files in your application at run time , the templates engine replaces variables in a template file with actual values and transform the template into the html file sent to the client

app.set('view engine', 'ejs')

// express.static('pulbic') is built-in middleware fuction in express , that serve the static files such images, css , files and javascript 
app.use(express.static('public'))

// express.urlencoded({}) is built in middleware function in express, use to parsing request body of content x-www-form-urlencoded 
//eg .../Name=Pikachu&Type=Banana&Number+In+Stable=12
app.use(express.urlencoded({ extended: true }))

// express.json() expects request data to be sent in JSON format , which often resembles a simple js object
//eg {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}
app.use(express.json())


// Define the get all  the todos  routes and render to the display
app.get('/',async (request, response)=>{
    // Retrieve all the todos from the 'todos' collection
    // .find() fetches all the documents in the 'todos' collection
    // .toArray() converts the documents into array of objects 
    const todoItems = await db.collection('todos').find().toArray()

    // Retrieve all the todos from the 'todos' collection
    // count the number of todos that are incomplete
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // Render the index.ejs template to display the todos
    // the .render() function renders() 'index.ejs' with the todoItems data and the count of incomplete todos, sending it to the client
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

// Define the route /addTodo to add a new todo using the POST method

app.post('/addTodo', (request, response) => {
    // retrieve  the todo item from the collection 'todos'
    // request.body.tododItem get the todoItem from request object 
    //  .insertOne() adds a new todo document to the 'todos' collection with the item and a completed status of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // Redirect to the home page, which will reflect the newly added todo
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


// define the route /markComplete to update the status of to complete or incomplete
app.put('/markComplete', (request, response) => {
        // Find the todo item in the 'todos' collection using the value provided in the request body
        
    db.collection('todos').updateOne(
        {thing: request.body.itemFromJS} // Match the todo item by its name or description
        ,{
        $set: {
            completed: true // Set the 'completed' status to true
          }
    },{
        sort: {_id: -1},// Sort in descending order by _id to target the most recent item if there are duplicates
        upsert: false // Do not insert a new document if no match is found
    })
    .then(result => {
        console.log('Marked Complete') // log the success message
        response.json('Marked Complete') // send a json response back to the client
    })
    .catch(error => console.error(error)) // handle any errors that occur during the update 

})

// define the route /markuncomplete to update the status of  to incomplete
app.put('/markUnComplete', (request, response) => {
    // find the todo item in the 'todos' collection using the value provided in the request body

    db.collection('todos').updateOne(
        {thing: request.body.itemFromJS}, // match the todo item by its name or description
        {
        $set: {
            completed: false  // set the uncompleted
          }
    },{
        sort: {_id: -1}, // sort in descending order by _id to target the most recent item if there are duplicates
        upsert: false // do not insert a new document if no match is found
    })
    .then(result => {
        console.log('Marked Complete') // log the success message
        response.json('Marked Complete') // send a json response back to the client
    })
    .catch(error => console.error(error))

})
// define the route /deleteItem to the delete the todo item
app.delete('/deleteItem', (request, response) => {
    // find and delete the todo item in the 'todos' collection using the value provided in the request body
    db.collection('todos').deleteOne(
        {thing: request.body.itemFromJS} // match the todoItem by name or description
    )
    .then(result => {
        console.log('Todo Deleted') // log the success message
        response.json('Todo Deleted') // send a json back to the client
    })
    .catch(error => console.error(error))

})

// Start the server and listen on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})