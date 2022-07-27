//assign the express module to the imported module express, basically imports the express library
const express = require('express')

//creates a new express application and assigns it to app variable
const app = express()

//require the mongodb module, to connect to the database
const MongoClient = require('mongodb').MongoClient

//set the port variable that we're going to listen for
const PORT = 2121

//import the dotenv module and call the config method, which reads from the .env file nearby and adds them all to process.env
require('dotenv').config()

//we are declaring three variables here: db, connectionstr and dbname and initializing two of them. 
//dbconnectionstring holds the value of the enviroment variable we set up in .env as DB_STRING
//dbname holds the string todo.
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//we are using the connect method in the mongoclient (imported above) and passing our db string(initialized above as dbconnectionstr)
//we are passing the useunifiedtopology (deprecated, it's default as true in newer versions of mongo) and setting it as true
//after this connection is completed(is a promise) we are console logging to know we are actually connected (and showing the dbname with template literals)
//finally, we are initializing the db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//sets 'ejs' as the rendering engine for the .render() method   
app.set('view engine', 'ejs')

//setting the static files location to the public folder
app.use(express.static('public'))

// using express urlencoded to enable express grab data from the form element by adding it to the request body property, setting the extended option to true to allow for object & array support
app.use(express.urlencoded({ extended: true }))

//allows us to be able to use express, middleware to load the json body parser for incoming requests.
app.use(express.json())

// this responds to a get request along the '/' route. this is the GET request where we're going to read (get something back) the items in the todo list. defines a 'get' method at the root of the server
app.get('/',async (request, response)=>{
    // access collection called 'todos' from connected database and find all documents, as an array, then await the promise, assigning the documents to todoItems
    // request to mongo to return all records from 'todos' collection, in an array.
    const todoItems = await db.collection('todos').find().toArray()
    //get items that are 'completed' value of 'false'. access collection named 'todos' from connected database and get the count of all documents that match the filter - have an property of completed with a value of false, awaiting this promise and assigning to itemsLeft.
    // returns a count of the number of records with the 'completed' field equal to false.

    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends over variables todoItems and itemsLeft to EJS.  tell express to tell EJS to render index.ejs with this object - which EJS will make into variables
    // express passes the data from the above two queries in to the ejs rendering engine - responds with html
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    //this is the promise version of the await:
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//responding to a post request to the '/addTodo' route. using POST request (create) to add  new items in the todo list
app.post('/addTodo', (request, response) => {
    // inserting a new todo item into the list with a completed false value
    //selecting our collection here and indicating that we are inserting one item (obj) with the key properties "thing" and 'completed', assigning the values of the todoItem 
    //(taken from the body of the request) and the boolean false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //once the previous promise is completed, we console log a message and redirect to root page or /
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //if the promise was rejected, we log the error
    .catch(error => console.error(error))
})

// PUT request or Update if the item is completed by Responding to an update request to mark an item complete and reordering the list to have the newest item at top
//defines an endpoint to handle a PUT request
app.put('/markComplete', (request, response) => {
    //selecting the 'todos' collection of our db and updating one item(object: key= thing, value= itemFromJs)
    // updates a record, using value recieved from 'itemFromJS' in the body of the request

    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //using the $set operator form mongo to change the completed key to true. $ sign shows this is a mongo command 
        $set: { 
            completed: true
          }
    },
        // update the newest document if multiple results. if no matches, don't create a new record.

    {
        //using the mongo sort by id - 1 means descending or get the largest or latest values first Z Y X or 9 8 7
        sort: {_id: -1},
        //upsert is insert and update mongo method to false-the default value
        upsert: false
    })
    //when this promise is completed, we console log and send the same as json
    //if successful, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if the promise was rejected it gets console logged
    .catch(error => console.error(error))

})

//practically the same as above but opposite-sets completed to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        //we don't want to create a new document
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//de-lay-te handler at `/deleteItem` that deletes a todo document forom the collection
//handles a DELETE request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    //accessing the 'todos' collection, delete one document that matches the filter, has a property of thing equal to itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successful log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if fails log the error
    .catch(error => console.error(error))

})

// listen to the port that we established in the variable or the port that is available with heroku, for example
//starts the server and waits for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})