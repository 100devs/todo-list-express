const express = require('express') //making it possible to use express methods in this file
const app = express() //creating a variable for app and applying the express method to it when called
const MongoClient = require('mongodb').MongoClient //sets up the Mongo client so we can use it to communicate with the database
const PORT = 2121 //declares a constant variable for the port the server should run on
require('dotenv').config() //allows us to look for variables inside the .env file


let db, //declares variable named db but does not assign it a value
    dbConnectionStr = process.env.DB_STRING, //declares a variable to hold the value of the DB string hidden in the .env file
    dbName = 'todo' //declaring a variable to hold the name of the database we are going to use to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to the Mongo database and passing in our hidden connection string along with an additional property
    .then(client => { //waits for the connection and proceeds if successful
        console.log(`Connected to ${dbName} Database`) //logs to the console that the connection is successful
        db = client.db(dbName) //assigning a value to a variable declared globally that contains a db client factory method
    })

//middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content
app.use(express.json()) //parses JSON content


app.get('/',async (request, response)=>{ //express method, .get indicates this is a 'read' method in CRUD, when the root rout (/) is passed in sets up an asynch function to take in req and res params
    const todoItems = await db.collection('todos').find().toArray() //variable declaration to hold the value of the array that is returned from the todos database which will include the items in the database that we have todo
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //variable that holds the value of the items in the todos collection that have not been marked completed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells the ejs document to render the values held in the variables above to be displayed on the browser page
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //activates the post method, or Create in CRUD, when the /addTodo route is used. This then calls a function using the req and res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds a new document or item to our database with the body content added as the thing to be done and a default completed property value of false
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    }) //if successful, the console logs Todo Added and the page is refreshed to show the updated info and redirect out of the addTodo route
    .catch(error => console.error(error))
}) //if unsuccessful, the error will be logged to the console

app.put('/markComplete', (request, response) => { //starting a Put method (update in CRUD) when the markComplete route is selected
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //using the updateOne method, we are matching the todo passed through in the req body to a document in the database with a matching name
        $set: {
            completed: true //sets the completed property value to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //then block runs if successful
        console.log('Marked Complete') //sends response to console affirming action successful
        response.json('Marked Complete') //sends a response back to the sender
    })
    .catch(error => console.error(error)) //logs error to console if then block is unsuccessful
})

app.put('/markUnComplete', (request, response) => { //starts a put method when the markUnComplete route is selected
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //searches the database collection name todos and finds an item that matches to be updated
        $set: {
            completed: false //updates the completed value to false in the matching document
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    })
    .then(result => { //then block runs if successful
        console.log('Marked Complete') //sends response to console affirming action successful
        response.json('Marked Complete') //sends a response back to the sender
    })
    .catch(error => console.error(error)) //logs error to console if then block is unsuccessful

})

app.delete('/deleteItem', (request, response) => { //starts the delete method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //searches the database collection named todos for the item that matches the body of our request and removes it
    .then(result => { //then block if successfully matched/deleted
        console.log('Todo Deleted') //logs success message to console
        response.json('Todo Deleted') //sends response back to sender 
    })
    .catch(error => console.error(error)) //if then block unsuccessful, error code is logged to console

})

app.listen(process.env.PORT || PORT, ()=>{ //sets up the port our server will be listening on, either pulling from the .env file or defaulting to the port variable assigned previously
    console.log(`Server running on port ${PORT}`) //logs to console when successfully connected to port
})