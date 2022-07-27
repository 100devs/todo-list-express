//imports the express object
const express = require('express')
//uses the express app constructor and creates the 'app' object exports
const app = express()
//imports the mongodb file and exports the mongo object
const MongoClient = require('mongodb').MongoClient
//sets default port to 2121
const PORT = 2121
//import the .dotenv and sets it up for the project
require('dotenv').config()

//creates empty db variable, sets the db_string to dbConnectionStr, and sets dbName to 'todo'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//uses the mongoclient object, and calls the connect object.  sets the dbconnecton str, and sets the useunifiedtopology to true
//returns a promise that waits to resolve to the client return object.  Then prints connects to the ${dbname}
//then sets the client db to the dbName ('todo') and sets that to db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//sets the express object view engine to 'ejs'
//express object uses the express static to public, gives access to files in public folder across project
//express object uses the express.urlencoded method and passes an object with key/value extended:true.  simplifies the url parsing
//express object uses the express.json() method so we can use the json to render/parse
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//calls the get method on the express object, passes in the root directory, then make an anonymous async function that has parameters of request/response.
//awaits call and collects all todoitems documents from todo collection and converts it to an array
//awaits call and gives a number of documents in the collection
//response from the server, renders the index.ejs template, and passes in an object with two key/values pairs that populated the ejs file.
app.get('/', async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

//express object post method is called, from the client to the addTodo route
//the request parameter body is parsed and inserted into the db.colloection
//once doc inserted and successful, then is called logging the todo message and redirected back to root route
//if promis is not succesful, an error is logged
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//put requests from client to the markcomplete route
//finds the item in the list updates the todo collection item once with with the parsed item from the request body.
//sets the complete field to true of the found object.
//sorts the documents by descending order and sets upsert to false
//if promise resolves, console log marked complete
//if promise fails, error is caught and logged.
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

//put request is made to markuncomplete route
//updatesone with the the requests item and set to thing keyword
//set the parameter of the complete key to false
//sorts the documents in descending order
//forces the upsert:false --> false by default?
//if promise resolves then keyword logs mark complete
//promise fails, error caught printed
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

//calls the express object delete method, routes to deleteitem route.  
//deletes one item matching the request.body
//once success logs and responses with json
//fails it catches error and logs
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//express listens on the defined port or the port form the .env file. good for heroku hosting
//logs the port to the console
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})