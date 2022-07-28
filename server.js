const express = require('express')
//declare a variable that requires express
const app = express()
//declare a variable that calls the express module; this allows easier access to the express methods
const MongoClient = require('mongodb').MongoClient
//declare a variable that requires the MongoDB Node.js package
const PORT = 2001
//declaring a number that will be our localhost port 
require('dotenv').config()
//require and configure the dotenv module to provide access to variables hidden in the .env

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//declare a set of variables that will be used by MongoClient to connect to the target database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //MongoClient.connect() takes dbConnectionStr as an argument to access the correct database
    //do we need useUnifiedTopology? probably not
    .then(client => {
        //when the .connect method is fulfilled...
        console.log(`Connected to ${dbName} Database`)
        //...we console.log that we are connected...
        db = client.db(dbName)
        //...and access to the entire database 'todo' is stored in the variable declared above.
        //down below, we can access the target collection 'todos' with db.collection('todos').
    })
//MIDDLEWARE
app.set('view engine', 'ejs')
//allows use of ejs; at this point, we would create a views directory
app.use(express.static('public'))
//express allows us to to look into the public folder
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//.urlencoded() and .json() ensure that ONLY requests made in the correct format are accepted.
//in this app, the main.js specifies the Content-Type to be 'application/json' 

//C R U D Methods
//READ Method (READ the TODO LIST) 
app.get('/', async (request, response) => {
    //read from the root dir; then call the async function with (req,res)
    const todoItems = await db.collection('todos').find().toArray()
    //declare a variable that fetches the 'todos' collection from our db; .find() returns the collection; .toArray() formats the data into an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    //countDocuments counts the documents in the 'todos' collection whose {completed} property is set to {false}
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
        .catch(error => console.error(error))
    //renders the async response object as .ejs 
    // db.collection('todos').find().toArray()
    //     .then(data => {
    //         db.collection('todos').countDocuments({ completed: false })
    //             .then(itemsLeft => {
    //                 response.render('index.ejs', { items: data, left: itemsLeft })
    //             })
    //     })
    //     .catch(error => console.error(error))
})
//CREATE (ADD AN ITEM TO TODO LIST)
app.post('/addTodo', (request, response) => {
    //the .post method reads the '/addTodo' path to call the above function (which is implicitly Promise-based due to use of express)
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        //take the 'todos' collection, and .insertOne document to the collection
        //the attributes in the <form action="/addTodo" method="POST"> element specify this path and method
        //request.body matches the name specified in the <form> element
        .then(result => {
            console.log('Todo Added')
            //yay we did it
            response.redirect('/')
            //"refreshes" the page by redirecting the client to the root, which is the .get()
        })
        .catch(error => console.error(error))
    //error handling
})
//UPDATE (UPDATE TODO LIST, TASK COMPLETED)
app.put('/markComplete', (request, response) => {
    //this function runs with the URL path '/markComplete' 
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        //we take the itemText from the main.js and set that to ????
        $set: {
            completed: true
        }
        //tell mongodb to change something
    }, {
        sort: { _id: -1 },
        //sort the collection by ID, from most recent(?)
        upsert: false
        //mongo stuff (does NOT upsert in this case)
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        //console.log indicates fulfillment in the terminal
        //response.json() does the same in the client
        .catch(error => console.error(error))
    //error handling
})
//UPDATE (UPDATE TODO LIST, TASK UN-COMPLETED)
app.put('/markUnComplete', (request, response) => {
    //an async function in the main.js changes our path to '/markUnComplete'...
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        //...we take out the 'todos' collection from our database, and update the matching object....
        $set: {
            completed: false
        }
        //...the 'completed' property our target document is changed to false
    }, {
        sort: { _id: -1 },
        upsert: false
        //mongo stuff
    })
        .then(result => {
            console.log('Marked Un-Complete')
            response.json('Marked Un-Complete')
        })
        .catch(error => console.error(error))
    //error handling :))))
})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        //we take the todos collection, and delete the JSon object that matches the request specifications
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
            //we did it (deletion)!
        })
        .catch(error => console.error(error))
    //error handling

})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})