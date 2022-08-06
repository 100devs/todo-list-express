const express = require('express') //making it possible to use express in this file. 
const app = express() //renaming express so we don't need to type it out
const MongoClient = require('mongodb').MongoClient //Setting up MongoClient so that we can use MongoClient methods to talk to mongodb
const PORT = 2121 //setting the port, assigning it a constant
require('dotenv').config() //allows us to access variables inside the .env file


let db, // initializing a variable.
    dbConnectionStr = process.env.DB_STRING, //assiging a varriable to our db connection string.
    dbName = 'todo' //declaring the name of our database that we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string, Also passing in an additional property.
    .then(client => { //waiting for the connection and proceeding if successful
        console.log(`Connected to ${dbName} Database`) //logging confirmation of connection to the console
        db = client.db(dbName) //assigning the previously declared db varible that contains s db client factory method
    }) //close our .then method
    

    //all of this is middleware 
app.set('view engine', 'ejs') //setting ejs as the default render method
app.use(express.static('public')) //setting the default folder to look for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches content.
app.use(express.json()) //Parses JSON content


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits the todo db (all items), in array form
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the COUNT of items that are not completed (false in the completed property)
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders our EJS passing all the todoitems and the items that are uncompleted. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //close our get request

app.post('/addTodo', (request, response) => { //starts a POST method when the /addTodo route is passed in.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new items into the todos section and assigns them as uncompleted
    .then(result => { //if insert is successful, do this V
        console.log('Todo Added') //console log the action (todo item was added)
        response.redirect('/') //refresh the page so that the updated item is shown
    }) //close .then methods
    .catch(error => console.error(error)) //if an error occurs, send error message in console log
}) //close our POST request

app.put('/markComplete', (request, response) => { //starts an UPDATE request when the /markcCOmplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //grabs the todos array, looks for an item in the database that matches the name passed in
        $set: { // setting the 'complete' property to 'true' for that item
            completed: true
          }
    },{
        sort: {_id: -1},//sorting the items in descending order, based on when they were added (their id)
        upsert: false //prevents insertion if iten does not already exist
    })
    .then(result => { //if update was successful, do this
        console.log('Marked Complete') //logs the success message
        response.json('Marked Complete') //sending back some JSON to the sender
    }) //close our then
    .catch(error => console.error(error)) //catches in case of errors

}) //ending our PUT request

app.put('/markUnComplete', (request, response) => { //starting a PUT method, for the '/markUnComplete' route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes to the db and finds an item that matches the item that was passed in
        $set: {
            completed: false //sets the completed property to false for the item
          }
    },{
        sort: {_id: -1}, //sort the items in descending order
        upsert: false //preventing insertion if the item does not exist
    })
    .then(result => { //if update sucessful, do this
        console.log('Marked Complete') //logs success
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catching errors

})

app.delete('/deleteItem', (request, response) => { //starts a delete request for the route '/deleteItem'
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //goes to the db and searches for the item that matches the item passed in, if found it deletes it
    .then(result => { //if matching item is found, do this
        console.log('Todo Deleted') //log that the message was successful
        response.json('Todo Deleted') //return to sender that the delete was successful
    })
    .catch(error => console.error(error)) //catching errors

})

app.listen(process.env.PORT || PORT, ()=>{  //setting up which PORT we will be listening on. either grabs from the .env file (if it exists in there), or grabs the one made up top. 
    console.log(`Server running on port ${PORT}`) //console log the running port
})