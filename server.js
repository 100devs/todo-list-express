const express = require('express') // brings express into the server file
const app = express() // sets a convenient constant to the express function that allows us to easily access its middleware properties.
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient to talk to our DB
const PORT = 2121 // sets a constant to define the location where the server will be listening. --aside-- defining things at the top like this makes it easy to find and change in the future
require('dotenv').config() // allows us to look for hidden variables inside of the .env file.


let db, // declares the db global variable
    dbConnectionStr = process.env.DB_STRING, // ties the dbConnectionStr global variable to the hidden DB_STRING variable defined in our .env file.
    dbName = 'todo' // declaring the mongo database name in a variable. Seems a little extra when the database name is only one character longer including the quotation mark...

MongoClient.connect(dbConnectionStr), { useUnifiedTopology: true } // using the mongoclient to connect to our cluster, passing in our string that we just defined. Also passing in the useUnifiedTopology property.
    .then(client => { // Waiting for the connection and then proceeding if successful, while passing in all the mongo client information to the client 
        console.log(`Connected to ${dbName} Database`) //  log to the console a template literal telling us which database we just connected to.
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    }) // closes our .then block.
    
app.set('view engine', 'ejs') // sets EJS as the default render method.
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to encode/decode URLS where the header matches the content. Supports arrays and objects.
app.use(express.json()) // Tells Express to prepare to parse some JSON objects from incoming requests.


app.get('/',async (request, response)=>{ // Uses the express constant to handle a GET (read) request on the root. It tells express to create an anonymous asynchronous function with request and response parameters. It then begins to define this function.
    const todoItems = await db.collection('todos').find().toArray() // sets a constant called todoItems that awaits MongoDB finding all the items in the todos collection and creating a collection from them.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a constant called itemsLeft that awaits a count of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering the index page and passing an object that contains the two constants that we just created. So, it's an object with all of the db items and a count of how many are remaining inside of the object.
    // db.collection('todos').find().toArray() // why is this all a domment?
    // .then(data => { // who knows?
    //     db.collection('todos').countDocuments({completed: false}) // it looks like it does the same thing
    //     .then(itemsLeft => { // just in a less efficient manner
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // which is the lesson, I suppose.
    //     }) // I learned a lot today.
    // }) // still learning.
    // .catch(error => console.error(error)) // can't stop won't stop learning
}) // closing the GET request response.

app.post('/addTodo', (request, response) => { // starts a POST method when the addTodo route is passed to the server -- tied to the form in the index.ejs file.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new item into the todos collection from the form body and setting it's completed property to false.
    .then(result => { // if databse insert is successful, then execute the following the code block.
        console.log('Todo Added') // Logs a success message to the console.
        response.redirect('/') // Sends you back to the home page from the /addTodo route.
    }) // ends the success code block
    .catch(error => console.error(error)) // standard error block
}) // end of post method.

app.put('/markComplete', (request, response) => { // Update, mate! Starts a put method when the markComplete route is passed to the server.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Looks in the database for one item which matches the name of the item passed in from the client-side script that was clicked on. Remember that wild parent/child node selector from main.js? Well, here it is! At long last! My greatest nemesis. (Any thing can be a thing.)
        $set: {
            completed: true // changes the item's completed status to true.
          }
    },{
        sort: {_id: -1}, // sorts the item in descending order (so at the bottom of the list.) Maybe!?!?
        upsert: false // prevents insertion if item does not already exist.
    })
    .then(result => { // Upon success of the update, do this code.
        console.log('Marked Complete') // mark the word of my success in the annals of history.
        response.json('Marked Complete') // Sends this to main.js to log in the console there... err, the annals.
    }) // closing the then statement.
    .catch(error => console.error(error)) // People need to know if things go wrong.

}) // No more updating. EVER!

app.put('/markUnComplete', (request, response) => { // More updating! The opposite of the previous route, despite also being a PUT method. It's not really the opposite. It's just got two more letters.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one itme matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // tries to move item... maybe... to the bottom?
        upsert: false // Will not insert if it doesn't exist.
    })
    .then(result => {
        console.log('Marked Complete') // server-side console log.
        response.json('Marked Complete') // client-side console log.
    })
    .catch(error => console.error(error)) // error, no computer.

}) // ending put.

app.delete('/deleteItem', (request, response) => { //starts a delete method when the deleteItem route is passed.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for one item that has a matching name to the weird selector in our main.js
    .then(result => { // starts a then block if the delete was successful.
        console.log('Todo Deleted') // logging successful deletion.
        response.json('Todo Deleted') // sending that back to the clientside.
    }) // closing that there then
    .catch(error => console.error(error)) // or maybe just sending a dang error.

})

app.listen(process.env.PORT || PORT, ()=>{ // Where is the server? Oh, yeah, I told you a million years ago. Or maybe in a different file. Either way, the server is started on  a
    console.log(`Server running on port ${PORT}`) // Which one did weeee choooose? Here's a template literal to tell everyone in the console.
}) // It's all done.