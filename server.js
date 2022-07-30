//because all dependencies are already listed in package.json
//npm init
//npm install

const express = require('express') // making the express module availabe to use for this project
const app = express() //assigning the call to the express method to app to use later
const MongoClient = require('mongodb').MongoClient// makes the mongodb available so that we can connect to an external mongoDB database using a connection string
const PORT = 2121// assigning a constant variable to the port for the localhost that our server can connect to
require('dotenv').config()// allows us to access variables located in the .env file


let db, // declaring an empty variable of db
    dbConnectionStr = process.env.DB_STRING, //declaring and assigning a variable that will hold the mongodb connection string from the .env file
    dbName = 'todo-list'// declaring and assinging a variable to hold the database name to 'todo-list'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// connecting to our mongodb database by passing the connection string through as the first variable and passing in another property as second parameter
    .then(client => {// waiting for the connect and proceeding if the successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)// sends a message to the console that states we're connected to our database if the connection is successful
        db = client.db(dbName)//finally assigning our db variable to a value that contains a db client factory method
    })// closing our .then
    
//middleware that help open communication channels for our requests
app.set('view engine', 'ejs')// sets the view engine for our page to ejs as the default
app.use(express.static('public'))// gives us access to static files in the public folder
app.use(express.urlencoded({ extended: true }))// tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json())// Parses HSON content from incoming requests


app.get('/',async (request, response)=>{// .get is an express method. GET handles a Read request. The first argument passed should be the route of the root directory. sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()// sets a variable and awaits all items from the todos collection and turns it into an array. there are no parameters in .find() because we want to fetch all the data
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// sets a variable and awaits the count of the items in the todos collection that are NOT completed that will later be displayed in JS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// rendering EJS file and passing throught the database items and the count remaining inside an object
    //
    //the following is the classic .then promise syntax
    //(just another way to write the code above)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))
})// ends the GET method

app.post('/addTodo', (request, response) => {// .post() is another express method. POST is the CREATE. This post request only triggers when the /addTodo route is triggered. It is triggered via the form when the form's action is set to "/addTodo"
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// inserts a new thing into the 'todos' collection. tells the server to grab the item with the name='todoItem' in the body of the request and assinging it to "thing". The request and the item comes from the input in the form once it is submitted. then we set it's completed status to false because it will be a brand new task and it will not have any formatting
    .then(result => {// if insert is successful, do the following code
        console.log('Todo Added')// console log a message saying that the todo was added
        response.redirect('/')// redirecting to the root page
        //when we use the form to pass an action we are actually directed to the route that is associated with that action in the browser
        //and so we need to go back to the homepage or the route "/"
        //if you remove the redirect you won't be taken back to the homepage 
    })// ends the promise
    .catch(error => console.error(error))// catching the error and console logging it
})// ending the POST

app.put('/markComplete', (request, response) => {// PUT is an express method that UPDATES. Start a POST method when the /markComplete route is passed and triggered
    db.collection('todos').updateOne({thing: request.body.itemFromJS}/* updating one thing already in the collection todos. it says get the item called "itemFromJS" in the body of the request that comes through. look in the db for one item matching the name of the item passed in from the main.js file that was clicked*/,{
        $set: {// setting a value of an item
            completed: true//updating the item's completed status to true
          }//closing the set block
    },{//starts another parameter block 
        sort: {_id: -1}, //sorts in descending order
        upsert: false// if the value we're looking for does not exist prevents another insertion of the item
    })//ends the updateOne method
    .then(result => {//starts a then promise if update was successful
        console.log('Marked Complete')//console logs a message that says the item is complete
        response.json('Marked Complete')//sends a response that says the item is completed as json
    })// ends the promise
    .catch(error => console.error(error))// catches and throws errors and logs it to the console

})//ending PUT method

app.put('/markUnComplete', (request, response) => {// PUT is an express method that UPDATES. Start a POST method when the /markUnComplete route is passed and triggered
    db.collection('todos').updateOne({thing: request.body.itemFromJS}/* updating one thing already in the collection todos. it says get the item called "itemFromJS" in the body of the request that comes through. look in the db for one item matching the name of the item passed in from the main.js file that was clicked*/,{
        $set: {// setting a value of an item
            completed: false//updating the item's completed status to false
          }//closing the set block
    },{//ends the updateOne method
        sort: {_id: -1},//sorts in descending order
        upsert: false// if the value we're looking for does not exist prevents another insertion of the item
    })//ends the updateOne method
    .then(result => {//starts a then promise if update was successful
        console.log('Marked Not Complete')//console logs a message that says the item is uncompleted
        response.json('Marked Not Complete')//sends a response that says the item is uncompleted as json
    })// ends the promise
    .catch(error => console.error(error))// catches and throws errors and logs it to the console

})//ending PUT method

app.delete('/deleteItem', (request, response) => {// starts a DELETE mthos when the "/deleteItem is passed and triggered"
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item with the matching name from out JS file
    .then(result => {//starts then promise if delete is successful
        console.log('Todo Deleted')//logging successful delete
        response.json('Todo Deleted')//sending a response back to the sender of completed delete
    })//closing .then promise
    .catch(error => console.error(error))//catching and throwing erros

})//ending DELETE method

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on - either the port specified in the .env or from the predefined PORT variable
    console.log(`Server running on port ${PORT}`)//console lof the running port and that connection was successful
})//ends LISTEN method