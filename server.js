//allows use of/loads the express module
const express = require('express')
//creates express application/object
const app = express()
//loading mongoDB module
const MongoClient = require('mongodb').MongoClient
//setting a port for our server
const PORT = 2121
//loading dotenv module
require('dotenv').config()

//delcaring 3 varoables. one to receive our db, another to set our connection string into a hidden env file and a third one to store the name of db we want to use
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Mongo client connection with Unified Topology flag
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//promise syntax to wait until the connection happens before assigning the database to our db variable
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//this function sets a value (ejs) to a name (view engine), can change some behavior
app.set('view engine', 'ejs')
//the use function allows the use of middleware (functions that have access to the request and response objects)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// the "read" in crud. A get request work as the server sending back some data to you (user) . the "/" parameter means this is the GET request for the home page. async makes our function asynchronous. 
app.get('/',async (request, response)=>{
    //waits for the get request to finish then selects a collection (todos) and then finds/selects documents in said collection (in this case there's no query paramethers passed in so it will select every document) and stores it in an array
    const todoItems = await db.collection('todos').find().toArray()
    //waits for the last function to finish then counts all documents in our db that have the "completed" value set to false and set this number to a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //renders our page, passing to EJS an obejct containing 2 variables we will use on the page rendering
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
// the "create" in crud. A post request work as the client (us) sending data to the server and said data being used to create a new entry in our db . the "/addTodo" parameter is the path which we use to call our method. no asynchronous syntax this time, we're using promise syntax.
app.post('/addTodo', (request, response) => {
    //insert one....inserts one.... document to our db. it takes the "thing" key value from the request body and also sets a "completed" key with the value of "false"
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //after successfully adding we redirect the user back to the home page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //errors are caught here and sent back to our console
    .catch(error => console.error(error))
})
//// the "update" in crud. A put request work as the client (us) sending data to the server and said data being used to update an exsiting entry in our db . the "markComplete" parameter is the path which we use to call our method. no asynchronous syntax this time, we're using promise syntax.
app.put('/markComplete', (request, response) => {
    //the updateOne method ....updates one (always only one)... document from our db. the first paramether is a kind of selector, to indicate which document from the db we want; the second one is the update operator set which....sets.... the specified key of our document to the specified value and the third paramether are options. the sort one, sorts the documents in increasing order and the upsert one determines if a new document should be created if no matching document is found (true) or not (false)
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
//read more on the put method on line 59. the only difference here being this put method will set one of our document's "completed" key with a value of "false" (instead of true, from the put method on line 60)
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
// the "delete" in crud. the delete request sends some data to the server and specifies a document to be deleted. the deleteOne Method takes an object as paramether to find a single document and delete it from our db
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//the listen method sets a specific port in which the server will listen for requests. if no paramethers or the whole method isnt used, express will select a random port. in this specific case we're using the dotenv module to access a hidden env file to select our port OR using the one hard coded on line 8
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})