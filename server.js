// MODULES
// requires that express be imported into Node
const express = require('express')

// create express application
const app = express()

// requires that MongoClient library be imported
const MongoClient = require('mongodb').MongoClient

// sets port to run code in browser
const PORT = 2121

// brings in hidden environment variables that are stored in .env file
require('dotenv').config()

// creates database variable
let db,
    // sets connection string variable by grabbing DB string from env file
    dbConnectionStr = process.env.DB_STRING,
    // sets database name to todo
    dbName = 'todo'

// defines how to connect to database; useUnifiedTopology helps ensure that things are returned in a clean   manner
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // if connected then console log the string - response
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // sets db as database name - todo
        db = client.db(dbName)
    })
  
// MIDDLEWARE
// sets how we're going to use a view (template) to render ejs commmands for app
app.set('view engine', 'ejs')
// sets static folder called public for static files like images, css, etc
app.use(express.static('public'))
// reference to middleware that cleans up how things are displayed and how server communicates with client
app.use(express.urlencoded({ extended: true }))
// tells the app to use express's json method to take object and turn it into a JSON string
app.use(express.json())

// ROUTES
// tells app to go get / file (main page - index.ejs) to display on client side
app.get('/',async (request, response)=>{
    // sets variable - goes into database, creates a collection call todos and finds anything in that database and turns that into an array 
    const todoItems = await db.collection('todos').find().toArray()

    // sets variable - looks at documents in todos collection and counts documents if they have a completed status of false - returns a number of documents that have a completed status of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // render index.ejs with todo items & number of items left to do
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

// adds item to database via /addTodo route
app.post('/addTodo', (request, response) => {
    // goes into collection called todos, inserts one thing named todoItem with a completed status of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if everything goes well, then console log the string then redirects (or refreshes in the case) the index.ejs page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // error if post method doesn't work
    .catch(error => console.error(error))
})

// update method that responds when something happens on client side
app.put('/markComplete', (request, response) => {
    // goes into todo collection and updates one thing
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // adds status of completed true to item in the collection
        $set: {
            completed: true
          }
    },{
        // once thing has been marked as completed this sorts the array in descending order by id 
        sort: {_id: -1},
        // doesn't create a document for the todo if the item isn't found
        upsert: false
    })

    // if everything goes well and we get a result
    .then(result => {
        // logs the string
        console.log('Marked Complete')
        // returns response of marked complete - goes back to the fetch in main.js
        response.json('Marked Complete')
    })
    // if it doesn't work then an error is logged to the console
    .catch(error => console.error(error))

})

// put method that takes away complete status from a thing that you've marked as complete
app.put('/markUnComplete', (request, response) => {
    // go into todos collection and looks for item from itemFromJs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // undoes what we did with mark complete and changes complete status to false
            completed: false
          }
    },
    {
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // if everything worked, marked complete in console
        console.log('Marked Complete')
        // returns response of marked complete to fetch in main.js
        response.json('Marked Complete')
    })
    // if things didn't work then error is logged
    .catch(error => console.error(error))

})

// delete method
app.delete('/deleteItem', (request, response) => {
    // goes into todos collection and uses deleteOne method, finds a thing that matches the name of the thing you clicked on 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if everything went ok then string is logged to the console and response is returned to the fetch in main.js
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if things didn't work then error is logged
    .catch(error => console.error(error))
})

// tells server to listen to connection on port defined earlier or process.env.port will tell server to listen to port of the app (ex. heroku)
app.listen(process.env.PORT || PORT, ()=>{
    // logs port number the server is running on
    console.log(`Server running on port ${PORT}`)
})