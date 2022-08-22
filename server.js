const express = require('express') 
// Declares variable to enable express module - node framework. Modues must be required to be used.
const app = express()
// Sets variable app as function call of express.
const MongoClient = require('mongodb').MongoClient 
// Requires the use of MongoDB, the database we will be using
const PORT = 2121 
// Declares the port variable we will use to connect to app
require('dotenv').config()
// Enables dotenv module to hide information we wish to remain private


let db,
// Declare database variable
    dbConnectionStr = process.env.DB_STRING,
//MongoDB connection string which is stored privately in .env file
    dbName = 'todo'
// Assign database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// connect server to the MongoDB database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
// promise which activates upon connecting to database, and .then assigns value to db variable
    
app.set('view engine', 'ejs')
// sets view again as ejs, a templating language that will allow us to generate HTML for the client which uses code
app.use(express.static('public'))
// tells the app to serve up any files in the public folder as part of the root directory. commonly houses CSS and JS files
app.use(express.urlencoded({ extended: true }))
// tells app to use middleware urlencode which will parse requests to extract infromation
app.use(express.json())
// tells app to use json middleware to parse responses to json


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})
// READ // GET
// This method after receiving a GET requests from the client, then connects to our database, 
// looks for all the relevant info using the find() method and stores it in an array.
// It uses the async await methods so operates like synchronous code i.e one line of code 
// after another. Once the information we requested from the db, specifically all our todos,
// and a count of which todos are still pending completion, this is then sent to our index.ejs 
// file for rendering, where the html to be sent back to the client is generated.


app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// CREATE // POST
// This method facilitates the creation of entries in our db. On receiving a POST request, the server 
// contacts the db and sends over some information regarding the db entry The req body of the information 
// sent from the client holds the todo list item to be added and we set the completed value as false. 
// The .then method lets us know if the entry has been successfully created and then sends a response back 
// to the client redirecting it to thhe root folder which in turn sets off another GET request

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

// UPDATE // PUT
// This method facilitates the editing of entries in our db. On receiving a PUT request, 
// the server contacts the db and sends over some information regarding the db entry. The req body 
// of the information sent from the client holds the todo list item that we want to edit,and sets 
// the completed value as true through the use of the updateOne method.The .then method lets us know 
// if the entry has been marked complete and then sends a response back to the client that the task 
// has been marked complete.


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

// UPDATE // PUT
// Similar to the previous PUT, only this PUT request changes an entry's completed value from true to false.

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// DELETE // JUST DELETE
// This is our delete metod and it is used to remove entries from our database. the client sends over a 
// request body with a delete method which telss our server that using this method,send over the information 
// about the task to be deleted received in the request body. The db then navigates to our database and using 
// the deleteOne method it finds an entry that shares the same todo list item as that which was sent and 
// removes the entry. once this is done the server then sends a response to the client with a message saying 
// the task was deleted. 
 

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

// Tells the server where to listen for requests from the client. 
// We tell the server to listen for the various requests above, by specifying which port it should listen to 
// using the PORT variable. In this case if there is a port declared and assigned in our .env file it will use that 
// or use the port declared on line 7 as a default. once this has successfully started a mesage will appear in the 
// terminal to indicate the server is up and running and ready to process the requests from the client using the CRUD methods above.
