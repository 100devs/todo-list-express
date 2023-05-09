const express = require('express') // require express module, and store into express variable
const app = express() //Create a new instance of Express, and store in 'app' variable
const MongoClient = require('mongodb').MongoClient //require mongoDB module, and store into 'MongoClient' variable
const PORT = 2121 //declare 2121 as PORT variable
require('dotenv').config() //allow access to .env file to use variables within


let db, //declare db as variable in memory
    dbConnectionStr = process.env.DB_STRING, //declare dbConnectionStr as variable in memory
    dbName = 'todo' //declare dbName as variable in memory


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to MongoDB using dbConnectionStr variable
    .then(client => { //begin promise if successful, console log the below
        console.log(`Connected to ${dbName} Database`) //console log string
        db = client.db(dbName) //set the db variable to the specified database using the client.db() method
    })
    
app.set('view engine', 'ejs') //sets view engine to ejs
app.use(express.static('public')) //allow access to 'public' folder
app.use(express.urlencoded({ extended: true })) //parse URL-encoded bodies
app.use(express.json()) //parse JSON bodies


app.get('/',async (request, response)=>{ //listen for a GET request for root ('/')
    const todoItems = await db.collection('todos').find().toArray() //Get documents from database and put into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Counts all documents that are not completed, and stores into variable 'itemsLeft'
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders index.ejs file and passes in  variables
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Listens for POST request at the /addTodo endpoint, see form with this route in the ejs 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert a new todo item into database
    .then(result => { //being promise that if successful, then do the below
        console.log('Todo Added') //console log 'Todo Added'
        response.redirect('/') //redirects to the route directory, essentially a refresh of the page
    })
    .catch(error => console.error(error)) //catches errors if they are present during the above code
})

app.put('/markComplete', (request, response) => { //listens for a PUT/Update request from fetch call in JS file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update the todo item in the database with the specified text, setting the completed status to true
        $set: {
            completed: true //sets $set as true if completed
          }
    },{
        sort: {_id: -1}, //Sort the documents in the collection by '_id' field in descending order
        upsert: false //If the document does not exist, do not insert a new document
    })
    .then(result => { //If the update operation is successful, execute the following function with the result object
        console.log('Marked Complete') //Console log a string 'Marked Complete'
        response.json('Marked Complete') // Send a JSON response containing the message 'Marked Complete'
    })
    .catch(error => console.error(error)) //Catches error and responds with error

})

app.put('/markUnComplete', (request, response) => { //listens for a PUT/Update request from fetch call in JS file
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update the todo item in the database with the specified text, setting the completed status to true
        $set: {
            completed: false  //sets $set as false if not completed
          }
    },{
        sort: {_id: -1}, //Sort the documents in the collection by '_id' field in descending order
        upsert: false //If the document does not exist, do not insert a new document
    })
    .then(result => { //If the update operation is successful, execute the following function with the result object
        console.log('Marked Complete') //Console log a string 'Marked Complete'
        response.json('Marked Complete') // Send a JSON response containing the message 'Marked Complete'
    })
    .catch(error => console.error(error)) //Catches error and responds with error

})

app.delete('/deleteItem', (request, response) => { //listens for a Delete request from fetch call in JS file
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Delete the todo item in the database with the specified text, setting the completed status to true
    .then(result => { //If delete is successful proceed to run the code below
        console.log('Todo Deleted') //Console log a string 'Todo Deleted'
        response.json('Todo Deleted') // Send a JSON response containing the message 'Todo Deleted'
    })
    .catch(error => console.error(error)) //Catches error and responds with error

})

app.listen(process.env.PORT || PORT, ()=>{ //Listens for either a varible within .env file, PORT, or variable PORT declared within this file
    console.log(`Server running on port ${PORT}`) //If successful, then console log '`Server running on port ${PORT}`
}) 