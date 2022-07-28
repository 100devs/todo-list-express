const express = require('express') // Imports express into Node
const app = express() // Makes a variable for calling express 
const MongoClient = require('mongodb').MongoClient // Imports MongoClient into Node
const PORT = 2121 // Sets the local port to 2121
require('dotenv').config() // Imports dotenv which allows you to have hidden variables


let db, // Creates database variable
    dbConnectionStr = process.env.DB_STRING, // Uses hidden variable from dotenv here named "DB_String"
    dbName = 'todo' // Assigns dbName as "todo" to name the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Tells node how to connect to Mongo. The first argument is the hidden variable key that connects to the database. The second variable is useUnifiedTopology, which helps ensure that things are returned clearly
    .then(client => { // Promise structure, after we connect, we then... 
        console.log(`Connected to ${dbName} Database`) // Console logs a message to show that we've connected to the database
        db = client.db(dbName) // Assigns db variable from line 8
    })
    
// MIDDLEWARE
app.set('view engine', 'ejs') // Determines that we will use the view engine to render ejs
app.use(express.static('public')) //Allows all static files to be placed and pulled from public without having to assign specific returns for each type of file
app.use(express.urlencoded({ extended: true })) // Similar to unifiedTopology, it cleans up how things are returned
app.use(express.json()) // Tells the app to return the object as a json string


// ROUTES
app.get('/',async (request, response)=>{ // This is the default route. When the page loads, this is how it "gets" a response and determines what to render
    const todoItems = await db.collection('todos').find().toArray() // Once the server connects with mongodb db named "todo," it will find the items in that collection and put it into an array. We assign the name of this array to be "todoItems"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Once the server connects with mongodb, it will go into the "todo" collection and then count the number of documents that have the property of "completed" set as "false." This will be used later to determine how many items are left to do in the list
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // This is the response and it will render the file named "index.ejs" along with an object containing the items from our database and the itemsLeft number that represents number of "false"-set completed items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // This is the route that fires when user adds something to the list. The "post" route titled "/addTodo" will be seen as the method later
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // Connects to the database named "todo" and adds one item. The thing it adds is going to be taken from the property "thing" and we will set the completed property to "false" by default.
    .then(result => { // And then.. after we add the new item to the list... 
        console.log('Todo Added') // Console logs a message "Todo added" so that we know the item got added
        response.redirect('/') // Refreshes the page after the item is added so that the new item shows up on the rendered list
    })
    .catch(error => console.error(error)) // If something went wrong and the item was not added successfully, we will see an error logged into the console
})

app.put('/markComplete', (request, response) => { // This is the route that fires when the user makes an update and wants to change the "complete" status from true to false and vice versa
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Connects to the database called "todo" and updates one item with a thing property that matches the item from the main.js file
        $set: { // Sets something.. 
            completed: true // The completed property will now be true (default is false)
          }
    },{
        sort: {_id: -1}, // Once the item has been set as completed, the list will be sorted in descending order by id
        upsert: false // In case the item cannot be found in the document, this will make it so a new file won't get created to match the item given
    })
    .then(result => {
        console.log('Marked Complete') // Once everything is done, console will log ("Marked Complete")
        response.json('Marked Complete') // Returns response of "Marked Complete" in main.js
    })
    .catch(error => console.error(error)) // If something went wrong, it will log this error in the console

})

app.put('/markUnComplete', (request, response) => { // This is the same as marking complete route above but the opposite effect: It will mark things incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Connects to the database called "todo" and then updates the item with the thing property that matches the item from main.js file
        $set: { // sets something... 
            completed: false // sets the completed property to false
          }
    },{
        sort: {_id: -1}, // Once the item has been set as not completed, the list will be sorted in descending order by id
        upsert: false // In case the item cannot be found in the document, this will make it so a new file won't get created to match the item given
    })
    .then(result => {
        console.log('Marked Complete') // Once everything is done, console will log ("Marked Complete")
        response.json('Marked Complete') // Returns response of "Marked Complete" in main.js
    })
    .catch(error => console.error(error)) // If something went wrong, it will log this error in the console

})

app.delete('/deleteItem', (request, response) => { // This is the route that fires when an item gets deleted
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Connects to the database called "todos" and deletes the item with the thing property that matches what is requested from main.js file
    .then(result => { // And then... 
        console.log('Todo Deleted') // Console logs that item is deleted
        response.json('Todo Deleted') // Response in main.js fetch that file is deleted
    })
    .catch(error => console.error(error)) // If something went wrong, it will log error in console

})

app.listen(process.env.PORT || PORT, ()=>{  // Tells server to either connect to local port or to use the port used by Heroku with process.env.PORT
    console.log(`Server running on port ${PORT}`) // Console logs that the connection is made to the particular port number
})