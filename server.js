//Modules and global variables
//express module, MongoDB module, and dotenv module being used and requiring it for the app
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
//declaring the local port number as a variable
const PORT = 2121
require('dotenv').config()

//declaring db, mongodb connection link, and database name as global variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connecting to the mongo database collection using a connection string(declared in the private env file)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//after the promise connection returns then giving a value to the db variable and letting the server side viewer know that connection to the database is set in the console.log
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Middleware
//telling the app to use view engine ejs so we can use that for our html output
app.set('view engine', 'ejs')
//telling the app to connect to static public folder for stylesheets, images, javascript sheets, etc
app.use(express.static('public'))
//(similar to bodyparser)The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }))
//telling the app we're using json for data information
app.use(express.json())

//changed the code to include error handling
//app 'reading' for initial load, async function getting the database collection from mongodb, and upon recieving that information, rendering the html page for the user
app.get('/',async (request, response)=>{
    //variable being used to hold an array of the collection documents from the 'todos' collection
    const todoItems = await db.collection('todos').find().toArray()
    //variable being used to hold the number(countDocuments) of uncompleted items from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //try catch block to respond with a render of the ejs and incorporate the variables from above into the rendered page, if it doesn't work, the catch will display the error in the console.
    try{
        response.render('index.ejs', { items: todoItems, left: itemsLeft })
    }
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    catch(error){
        console.error(error)
    }
})

//Routes
//app 'creating' a new item for the the todo list, sending data body to the server database using the route '/addTodo' that will match an action on our form in ejs
app.post('/addTodo', (request, response) => {
    //using the 'insertOne' method, added an item to our todo list, with completed tag of false, we get the data fromt he request body sent from the client side form webpage
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //once the item has been added, the page redirects(basically reloads) to main route and has that added task on it. console.logs that a todo was added, there's a catch to console.log any errors
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//app 'updating' a task item as complete, using the route '/markComplete'
app.put('/markComplete', (request, response) => {
    //accessing the collection and using the 'updateOne' method to change the task clicked on from the client JS and updating the completed value to 'true' using set
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //NOTE:inteboxer: from docs: To sort array elements that are not documents, or if the array elements are documents, to sort by the whole documents, specify 1 for ascending or -1 for descending.
        //keeps the tasks sorted in descending order and...
        sort: {_id: -1},
        //NOTE: Busma: upsert will update the db if the note is found and insert a new note if not found Sasha: yes! and it's set to false, so it prevents that behavior from happening
        //does not allow new tasks to be created from this update
        upsert: false
    })
    //after update is finished, responds with complete to client js and console.logs marked complete as well, has a catch to deal with errors
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

//updated code to say task is marked uncomplete
//app 'updating' a task item as incomplete, using the route '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    //accessing the collection and using the 'updateOne' method to change the task clicked on from the client JS and updating the completed value to 'false' using set
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //keeps the tasks sorted in descending order and...
        sort: {_id: -1},
        //does not allow new tasks to be created from this update
        upsert: false
    })
    //after update is finished, responds with complete to client js and console.logs marked uncomplete as well, has a catch to deal with errors
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})

//app is 'delaytaying' a task from the list using route '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    //accessing the collection and using the 'deleteOne' method to remove the task clicked on from the client JS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //after item removal is finished, responds with complete to client js and console.logs todo deleted as well, has a catch to deal with errors
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

//// Tells our server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app (e.g., the PORT used by Heroku)
app.listen(process.env.PORT || PORT, ()=>{
    //console.logs the port we're running on
    console.log(`Server running on port ${PORT}`)
})

// connecting to the database
// passing in the connectiong string to tell the connect method which server to connect to
// useUnifiedTopology determines the version of MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // establishes the client with its given name
        db = client.db(dbName)
    })

// telling the app which view engine to use, so that we can use ejs
app.set('view engine', 'ejs')
// setting up the use of the public folder and tells ejs where to find the compatible files
app.use(express.static('public'))
// negates the need for body-parser
// and tells express to encode and decode URLs automatically
app.use(express.urlencoded({ extended: true }))
// tells express that everything we're doing in JSON
app.use(express.json())

// the operations to do when going to the different pages
// this is for the home page
app.get('/', async (request, response) => {
    // converts the todoItems into an array
    const todoItems = await db.collection('todos').find().toArray();
    // counts how many items still need to be done and counts them
    // then sets their boolean completed value to false
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    // renders the index.ejs page and passes the parameters into that page
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

// the method to create additional items to the todo list
app.post('/addTodo', (request, response) => {
    // adds a new item to the todo list and sets its completed boolean to false
    db.collection('todos').insertOne({thing: request.body.todoItem.trim(), completed: false})
        .then(result => {
        // alerts via the console that the item has been added
        // once added, the page returns to the main page with the list of items
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// with a PUT method we can update the items on the list to 
app.put('/markComplete', (request, response) => {
    // updates an item in your list itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // marks the item as completed
            completed: true
          }
    }, {
        // tells the item to go to the bottom of the list
        sort: { _id: -1 },
        // if you don't find something, don't automatically assign something new
        upsert: false
    })
    // console logging that it's been marked complete, and also responding back to the client in JSON saying it's been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})


// with a PUT method we can update the items on the list to 
app.put('/markUnComplete', (request, response) => {
    // updates an item in your list itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // marks the item as incompleted
            completed: false
          }
    }, {
            // tells the item to go to the bottom of the list
        sort: { _id: -1 },
        // if you don't find something, don't automatically assign something new
        upsert: false
    })
        .then(result => {
        // console logging that it's been marked complete, and also responding back to the client in JSON saying it's been marked Incomplete
        console.log('Marked Incomplete')
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})


// responding to a DELETE request
app.delete('/deleteItem', (request, response) => {
    console.log(`request`, request.body)
    // deletes the item from the itemFromJS object
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
        .then(result => {
        // console logging that it's been deleted, and also responding back to the client in JSON saying it's been deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


// tells the server which port to use, either from the .env file, or the hard-coded value at the beginning
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})