//MODULES
const express = require('express') //Requires that Express be imported into Node
const app = express(); //Create an Express application
const MongoClient = require('mongodb').MongoClient; //Requres that MongoClient library be imported
const PORT = 2121 //Establishes a local port on port 2121
require('dotenv').config() //Allows you to bring in hidden environment variables


let db, //Creates database
    dbConnectionStr = process.env.DB_STRING, //Sets dbConnectionsStr equal to address provided by MongoDB (DB_STRING is in the .env config file in line 5)
    dbName = 'todo' //Sets database name equal to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then
    //Defines how we connect to our Mongo DB.useUnifiedTopology helps ensure that things are returned in a clean manner.
    (client => {
        //Responding on the client side and saying...
        console.log(`Connected to ${dbName} Database`) //Will produce a message in the console if the client connected properly
        db = client.db(dbName) //Defines the database as 'todo'. Works with line 15.
    })
    
app.set('view engine', 'ejs') //Determines how we're going to use a view engine to render ejs commands for our app
app.use(express.static('public')) //Tells our app to use a folder names "public" for all of our static files
app.use(express.urlencoded({ extended: true })) //Call to middleware that cleans up how things are displayed and how our server communicates with our client
app.use(express.json()) //Tells the app to use Express's json method to take the object and turn it into a JSON string

//ROUTES
app.get('/',async (request, response)=>{
    //GET Stuff to display to users on the client side using an asynchronous function
    const todoItems = await db.collection('todos').find().toArray() //Create a constant called "todoItems" that goes into our database, create a collection called "todos", find anything in that database, and turn it into an array of objects
    const itemsLeft = await db //Creates a constant in our todos collection
        .collection('todos') //Looks at documents in the collection
        .countDocuments({completed: false}) //The countDocuments method counts the number of documents that have a completed status equal to "false" 
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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of "completed" equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this removes it from the to-do list
        upsert: false //Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        //Assuming that everything went okay and we got a result...
        console.log('Marked Complete') //console logged "Marked Complete"
        response.json('Marked Complete') //Returns response of "Marked Complete"
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => { //This route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos')//Go into todos collection
    .updateOne({thing: request.body.itemFromJS}, //Look for item from itemFromJS
        {
        $set: {
            completed: false //Undoes what we did with markComplete - changes "completed" status to "false"
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this removes it from the to-do list
        upsert: false
    })
    .then(result => {
        //Assuming that everything went okay and we got a result...
        console.log('Marked Complete') //Console logged "Marked Complete"
        response.json('Marked Complete') //Returns response of "Marked Complete" to the fetch im main.js
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.delete('/deleteItem', (request, response) => {
    //DELETE
    db.collection('todos') //Goes into your collection
    .deleteOne({thing: request.body.itemFromJS}) //Uses deleteOne method and find a thing that matches the name of the thing you click on
    .then(result => { //Assuming everything went okay...
        console.log('Todo Deleted') //Console logged "Todo Deleted"
        response.json('Todo Deleted') //Returns response of "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.listen(process.env.PORT || PORT, ()=>{
    //Tells our server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app
    console.log(`Server running on port ${PORT}`) //Console log the port number or server is running on
})