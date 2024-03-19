const express = require('express') //importing express framework
const app = express() //creating an instance of express application
const MongoClient = require('mongodb').MongoClient //importing mongoclient object from  MongoDB Node.js driver
const PORT = 2121 //setting the port number
require('dotenv').config() //we are loading env variables from dotenv file 


let db,
    dbConnectionStr = process.env.DB_STRING,// Assigning the value of process.env.DB_STRING to the variable dbConnectionStr
    dbName = 'todo'  //This line sets the name of the database you intend to use to 'todo' 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //: This line initiates a connection to the MongoDB database specified by the dbConnectionStr variable
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //It takes the name of the database (dbName) as an argument and returns a database object associated with that name. This database object allows you to perform operation
    })

app.set('view engine', 'ejs') //we set the view of our application to ejs
app.use(express.static('public'))//we are telling express to use public folder for any static files
app.use(express.urlencoded({ extended: true }))//it's a middleware that automatically interprets data that we send to a server
app.use(express.json())//data is sent as a JSON string from the client, and express.json() middleware on the server side helps in converting that JSON string into a JavaScript object that you can work with in your server-side code


app.get('/', async (request, response) => { //When a client accesses your application's homepage, this function will be invoked
    const todoItems = await db.collection('todos').find().toArray() //we are accessing a collection withing todo database, we then find all documents and convert them into an array of objects
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //retrieves the count of incomplete todo items in the "todos"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //this line of code combines the EJS template with the data obtained from the database and sends the resulting HTML content to the client as the response to their request
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//When a client accesses your application's homepage, this function will be invoked
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //we are going to the database, we find 'todos' collection, and we are going to update an element that we have send to the server from a client-side
        $set: { //we are setting 'completed' property to true
            completed: true
        }
    }, {
        sort: { _id: -1 }, //we are sorting the results by an id in descending order
        upsert: false //if we don't find a document per criteria specified, we are not going to insert anything
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete') //we are responding back to our client-side. The client side will refresh, make a get request back to the server and then ejs template will update with the changes we have made.
        })
        .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {//we are setting 'completed' property to false
            completed: false
        }
    }, {
        sort: { _id: -1 }, //we are sorting the results by an id in descending order
        upsert: false //if we don't find a document per criteria specified, we are not going to insert anything
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})