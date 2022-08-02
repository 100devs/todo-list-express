const express = require('express') // Requires express package that we installed
const app = express() // initializing express so it runs
const MongoClient = require('mongodb').MongoClient // requiring mongo db and establishing it as a variable
const PORT = 2121 // PORT runs here
require('dotenv').config() // holds secret info that the code uses but does not belong to the code


let db, // shortened version of declaring variables (currently an empty variable)
    dbConnectionStr = process.env.DB_STRING, // this declared variable is inside of the .env file
    dbName = 'todo' // variable assignment - this is the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to the database using the connection string
    // unifiedTopology helps keeps the connection to database active. Is false by default. 
    .then(client => { // once the database is connected, do this function
        console.log(`Connected to ${dbName} Database`) // console log that we're connected to the database
        db = client.db(dbName) // connect to the database with the name we already set up
    }) // it might make sense to swap lines 15 & 16 so you connect to the db FIRST, and only console log if the db passes

app.set('view engine', 'ejs') // setting options for express app we assigned earlier
app.use(express.static('public')) // middleware - routes should go through the public folder
app.use(express.urlencoded({ extended: true })) // updating a setting to true
app.use(express.json()) // making sure data is sent back and forth as a json file


app.get('/', async (request, response) => { // do this function when the client requests the root page
    const todoItems = await db.collection('todos').find().toArray() // wait for the database to reply, then convert to an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // wait for db to reply, returning elements that match "completed: false"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send the data (todo items and items left) to the client via the index.ejs file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // creates a new todo items
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // add a new item to our todo list on the database. Extra note - it's best to "sanitize" your data before you send
        .then(result => { // now run this function
            console.log('Todo Added') // lets you know the add succeeded
            response.redirect('/') // refreshes your screen
        })
        .catch(error => console.error(error)) // uh oh something went wrong
})

app.put('/markComplete', (request, response) => { // updates a current list item to completed
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // to change this item, do this function
        $set: { // update these things in the object
            completed: true // mark it as complete
        }
    }, {
        sort: { _id: -1 }, // reorganizes the items in the database to the correct id order (-1 means descending order)
        upsert: false // if this is true, it will look for whether or not the object has the selected attributes, update if the attribute exist or create if they don't. Setting this false 
    })
        .then(result => { // now do this function
            console.log('Marked Complete') // let us know it worked
            response.json('Marked Complete') // let user know it worked
        })
        .catch(error => console.error(error)) // uh oh oopsie
})

app.put('/markUnComplete', (request, response) => { // removed the completed attribute from an existing object
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // tells the db which one to change 
        $set: {
            completed: false // oops I lied now make this false
        }
    }, {
        sort: { _id: -1 }, // sorting all the database items by id
        upsert: false // don't do upsert
    })
        .then(result => { // then do this
            console.log('Marked Incomplete') // let us know it worked
            response.json('Marked Incomplete') // let the user know it worked
        })
        .catch(error => console.error(error)) // oops I messed up again

})

app.delete('/deleteItem', (request, response) => { // delete an item
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // tells db which one has got to go
        .then(result => { // now do this function
            console.log('Todo Deleted') // tell us another one bites the dust
            response.json('Todo Deleted') // break the news to the user
        })
        .catch(error => console.error(error)) // oh uh spaghettios

})

app.listen(process.env.PORT || PORT, () => { // this is where we listen for the port, if there isn't a port declared in the .env file, it will use the second PORT option (declared above)
    console.log(`Server running on port ${PORT}`) // it's working, it's working
})