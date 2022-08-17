const express = require('express') //using express in this file
const app = express() // Saving expres to a variable called app 
const MongoClient = require('mongodb').MongoClient // using mongoClient in this file 
const PORT = 2121 //setting the port that the local host is to be run on
require('dotenv').config() //For the .env file to be read 

//Declairing variables for db, dbConnectionStr and dbName
let db,
    dbConnectionStr = process.env.DB_STRING, //Obtaining the string from the .env file
    dbName = 'todo' //name of the DB

//Creating a connection to MongoDB, and passing in our connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { //Using a promise to wait for the connection, if successful completes the following block
        console.log(`Connected to ${dbName} Database`) // Logs to the console if promise if fulfilled
        db = client.db(dbName) //Assignment of db to the database name with the db client method
    })

//Middleware -- From MayaneWolfe Stream -- Helps facililitate communiccation between req and responses
app.set('view engine', 'ejs') //Sets the ejs as the default render methods
app.use(express.static('public')) //Allows for the routing of all the files in the public folder (location of static assets)
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content...supports arrays and objects
app.use(express.json()) // Ensures that the requests are parsed as JSON

//The Read requests
app.get('/',async (request, response)=>{ // Stats a GET method when the root route is passed in
    // Storing the documents from the db in a variable call toDoItems that is an array
    const todoItems = await db.collection('todos').find().toArray() 
    //Counts all documents that have the completed property as false and stored in the items left variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Rendering the EJS and passing in above variables as an object to be used by the EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

//The Create Requests 
app.post('/addTodo', (request, response) => { //Starts a post request, putting a new item into the Db
    //Inserts a new document into the db using the obbject passed into the insertOne method
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) 
    .then(result => { //if insert is successful, console.log('ToDo Added') and refresh the page (redirect to the main page)
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) //If error console the error
})

//The Update Requests (This one is the markComplete)
app.put('/markComplete', (request, response) => { //Starts a PUT method when the route is triggered
    //Access the db and finds the thing using the req.body.itemsFromJS and sets the completed property to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { //if insert is successful, console.log('Marked Completed')
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //If error console the error

})

//The Update Requests (This one is the markUnComplete)
app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the route is triggered
    //Access the db and finds the thing using the req.body.itemsFromJS and sets the completed property to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { //if insert is successful, console.log('Marked Completed')
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //If error console the error

})

//The Delete request 
app.delete('/deleteItem', (request, response) => { //Starts a DELETE method when the route is triggered
    //Access the db and finds the document where thing == request.body.itemFromJS and uses the deleteOne method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => { //if Delete is successful.  console.log('ToDo Deleted')
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //If error console the error

})

app.listen(process.env.PORT || PORT, ()=>{ //Setting up which port we will be listening on - either the port from the .env file or the PORT declared with const PORT
    console.log(`Server running on port ${PORT}`) //Logs to console the PORT
})