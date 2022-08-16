const express = require('express')  //includes express framework and saves it in constant
const app = express()  //Saves an instance of express into the app constant
const MongoClient = require('mongodb').MongoClient  //includes the mongodb client which allows us to communicate with our database on MongoDB.
const PORT = 2121  //Sets a port number to determine the location where our server will be listening and saves it in a constant variable PORT
require('dotenv').config() //Allows access of variables in .env configuration file

//declaring some variables.
let db,  //variable that will hold the database connection
    dbConnectionStr = process.env.DB_STRING, //Saves the database connection string from the .env file into a variable.
    dbName = 'todo'  //Saves the database name in a variable.

//Creating the database connection to MongoDB passing in the connection string with an additional property which supports the topology layer in the server drivers.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {  //waits for the connection to be made and return its result
        console.log(`Connected to ${dbName} Database`) //if successful log its success to the console with a template literal to display the name of the db.
        db = client.db(dbName) //Saves the connection response which is the db client in the db variable previously declared.
    }) //Closes the then of the DB Connection creation. 
    
//Middleware declarations    
app.set('view engine', 'ejs')  //sets the templating language ejs as the default render method
app.use(express.static('public')) //sets the location for storing all of the static code in the public folder
app.use(express.urlencoded({ extended: true })) //allows express to encode/decode URLS headers to match the content and support arrays and objects
app.use(express.json()) //allows express to support json parsing of content

//express GET method (read request) to retrieve data to display when the root route is passed in
app.get('/',async (request, response)=>{ //the data to be displayed will be retrieved asychronously which requires a request and response parameters.
    const todoItems = await db.collection('todos').find().toArray()  //waits for the todo items to be found/fetched from the database collection todos and puts them into an array, which is saved in a constant.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //waits for the count of uncompleted todo items and save it in a variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the index.ejs file passing to it the reponse data saved into todoItems and itemsLeft naming them items and left in the ejs
    //Classic promise handling syntax that does the same thing as the previous 3 lines.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //Close the Get method.

//express POST method (create request) to insert new data to the databse when the addTodo route is passed in
app.post('/addTodo', (request, response) => { //the data to be inserted will be added asychronously which requires a request and response parameters.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item to the todos collection in the DB passed in the request body todoItem variable (input in form) and sets its name to thing and its completed to false.
    .then(result => {  //if insert was successful
        console.log('Todo Added') //display todo added to the console
        response.redirect('/') //refresh the page by redirecting to the root route, which will reload the homepage
    }) //Close the then part of the POST method
    .catch(error => console.error(error)) //catch any errors and log them to the console
}) //Close the POST method.

//express PUT method (update request) to mark a todo as complete and update its status on the databse when the markComplete route is passed in
app.put('/markComplete', (request, response) => { //the update method will happen asychronously which requires a request and response parameters.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //selects the item to be udpated from the todos collection in the DB passed in the request body itemsFromJS variable (passed from main.js when item has been clicked on)
        $set: { 
            completed: true //sets/updates its completed attribute to true
          }
    },{
        sort: {_id: -1},  //sorts the elements by moving this item to the bottom of the list
        upsert: false    //sets the upsert to false because if the item does not exist we do not want to add it
    })
    .then(result => {   //if update was successful takes result
        console.log('Marked Complete')  //logs marked complete to the console
        response.json('Marked Complete')  //sends a json response showing success back to the client side to log it on the client side
    })
    .catch(error => console.error(error))  //catches errors and logs them to the console

}) //Close the PUT method

//express PUT method (update request) to unmark a completed todo as uncomplete and update its status on the databse when the markUnComplete route is passed in
app.put('/markUnComplete', (request, response) => { //the update method will happen asychronously which requires a request and response parameters.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //selects the item to be udpated from the todos collection in the DB passed in the request body itemsFromJS variable (passed from main.js when item has been clicked on)
        $set: {
            completed: false  //sets/updates its completed attribute to false
          }
    },{
        sort: {_id: -1}, //sorts the elements by moving this item to the bottom of the list
        upsert: false //sets the upsert to false because if the item does not exist we do not want to add it
    })
    .then(result => {  //if update was successful takes result
        console.log('Marked Complete') //logs marked complete to the console
        response.json('Marked Complete') //sends a json response showing success back to the client side to log it on the client side
    })
    .catch(error => console.error(error))  //catches errors and logs them to the console

})  //Close the PUT method

//express DELETE method (delete request) to delete a todo from the databse when the deleteItem route is passed in
app.delete('/deleteItem', (request, response) => { //the delete method will happen asychronously which requires a request and response parameters.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //selects the item to be deleted from the todos collection in the DB passed in the request body itemsFromJS variable (passed from main.js when item's trashcan icon has been clicked on)
    .then(result => { //if deletion was successful takes result
        console.log('Todo Deleted') //logs deletion success to the console
        response.json('Todo Deleted') //sends a json response showing success back to the client side to log it on the client side
    })
    .catch(error => console.error(error)) //catches errors and logs them to the console

})  //Close the DELETE method

//express server listens on the port in the .env file (or if specified by Heroku if hosted on Heroku) if it exists otherwise takes the port from the constant hardcoded.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) //logs that the server is running on the console specifying on which port via a literal template
}) //close the server listening method