const express = require('express') //makes it possible to use express in the file
const app = express() //setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient  //makes it possible to use methods associated with MongoClient and talk to our DataBase
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db,  //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo'  //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our conneciton string. Also passing in an additional property.
    .then(client => {  //MongoClient.connect reutrns a promise, which allows us to use a .then. If the connection is successful then we proceed here. For this line, we're waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName)  //assigning our db value to previously declared db variable that contains a db client factory method 
    })  //closing our .then

//*** This little section is called Middleware. It helps facilitate communication. It lets you setup a pipeline from an incoming http request*** */
app.set('view engine', 'ejs') //allows you to ditch the ejs extension when making response.render calls, in other words, it sets ejs as the default render method. "view engine" means what should be used by default when giving response.render calls without an extension, basically what module/etc to use
app.use(express.static('public')) //sets the location of static assets (html, css)
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arraya and objects
app.use(express.json()) // this parses JSON content from incoming requests. We used to have to use something called bodyparser, but it is now built into express. One less thing to remember


app.get('/',async (request, response)=>{  //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()  //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {  //if insert is successful, do something
        console.log('Todo Added')  //console log agation
        response.redirect('/') //gets rid of the /addTodo route, and redirects back to the homepage
    })  //ending the .then
    .catch(error => console.error(error))  //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => {  //starts a PUT method when the markComplete route is passed in (update)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //look in the db for one item matching the name of hte item passed in from the main.js file that was clicked on
        $set: {  
            completed: true  //set completed status to true
          }
    },{
        sort: {_id: -1},   //moves item to the bottom of the list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => {  //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete')  //sending a response back to the sender
    })  //closing .then
    .catch(error => console.error(error))  //catch errors

}) //ending put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUncomplete route is passed in (update)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of hte item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1},  //moves item to the bottom of the list
        upsert: false  //prevents insertion if item does not already exist
    })
    .then(result => {  //starts a then if update was successful
        console.log('Marked Complete')  //logging successful completion
        response.json('Marked Complete')  //sending a response back to the sender
    })  //closing .then
    .catch(error => console.error(error))  //catch errors

})  //end put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //look insiode the todos collection for the ONE item that has a matching name from our JS file
    .then(result => {  //starts a then if delete was successful 
        console.log('Todo Deleted')  //logging successful completion
        response.json('Todo Deleted')  //sending a response back to the sender
    })  //closing .then
    .catch(error => console.error(error))  //catching errors

})  //ending delete

app.listen(process.env.PORT || PORT, ()=>{  //setting up which port will be listening on -- either the port from the .env or the port variable we set
    console.log(`Server running on port ${PORT}`)  //console.log the running port.
})  //close listen method