
const express = require('express') //set express as a dependency so that it requires it. making it possible to use express in this file.
const app = express() //declare a variable call app and assign it the invokation of express.
const MongoClient = require('mongodb').MongoClient //declare a variable MongoClient allowing us to connect to MongoDB
const PORT = 2121 //setting the varible to define the location where our server will be listening.
require('dotenv').config() //allows us to look for variables inside of the .env file


let db,//decarling a variable and NOT assign it a value. You want to make it a global value so functions in local execution contexts can call it.
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it. also in the global execution context. grabbing the value of our env file and attaching it to our database string.
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connecting to MongoDB using the MongoClient and connection string?? Also passing in an extra property. establishing a promise.
    .then(client => { //if it is able to connect, then run this client code block. 
        console.log(`Connected to ${dbName} Database`)//log 'connected to dbName database
        db = client.db(dbName) //reassigning the variable db and assigning it everything that is assciated with the todo database. a db client factory method
    })// closing the .then

//middleware - helps with the communication btw the front and the back
app.set('view engine', 'ejs')//setting up ejs as our default. our render method
app.use(express.static('public'))//makes sure our code knows where to look for static assets. in publics. sets the location of the static assets.
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content. supports arrays and objects.
app.use(express.json())//parses JSON content from incoming requests


app.get('/',async (request, response)=>{//app references express. using the get (read in CRUD) method via the route root at first load or refresh. starting an async function with a request and response parameter.
    const todoItems = await db.collection('todos').find().toArray() //declaring a const variable and assigning it awaits data from the todo collection and finding the items and setting it to an array. grabbing everything.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//declare a variable call itemsLeft and store all the items in the todo collection with documents that are not complete. Getting a counter back
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs file and passing through the db items and count remaining inside the object. 

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //use post express method, which is the create in CRUD. We set the form method as /addTodo, triggered by the button in the form.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//look in the collection and find a collection call todos and insert an item into todos item. setting up new object with key of thing and completed. passing in the value of the request that is coming from the client form call todoItem, the input box. assigning the value to the key of thing. It's a brand new task so we are setting complete as false. if complete is true, the style would be striked out. 
    .then(result => { //promise syntax. using then method, if it works, invoke the result
        console.log('Todo Added') //log Todo Added
        response.redirect('/')//response with a redirect back to root directory.
    }) //closing then
    .catch(error => console.error(error))//error catching
}) //ending the post

app.put('/markComplete', (request, response) => { //use put method, which is the update in CRUD. starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database collection and update with the value of the item found in itemFromJs wich is just const itemText = this.parentNode.childNodes[1].innerText, which is the innerText from the span. make it an object, and match it to a key/property in the database. LOOK --> best to look up via the id value rather than object property. 
        $set: { //since a new object is created with the put method, this sets the status to true
            completed: true
          }
    },{
        sort: {_id: -1}, //moves the item to be bottom of the list.
        upsert: false //insert and update, set to false so it donesn't add something that doesn't already exist.
    }) //closing the object
    .then(result => { //if update was successful, invoke the result function
        console.log('Marked Complete') //log this message
        response.json('Marked Complete') //sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

}) //ending our put

app.put('/markUnComplete', (request, response) => {//use put method, which is the update in CRUD. starts a PUT method when the markUnComplete route is passed in. LOOK ---> routes are extremely different
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one tiem matching the name of the tiem passed in from the main.js file that was clicked on.
        $set: {
            completed: false //et completed to false
          }
    },{
        sort: {_id: -1},//moves the item to be bottom of the list.
        upsert: false//insert and update, set to false so it donesn't add something that doesn't already exist.
    })
    .then(result => {//if update was successful, invoke the result function
        console.log('Marked Complete')//log this message
        response.json('Marked Complete')//sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})

app.delete('/deleteItem', (request, response) => {//use delete method, which is the delete in CRUD. starts a delete method when the deleteItem route is passed in.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in the db for the one item that has a matching name from our JS file.
    .then(result => {//if delete was successful
        console.log('Todo Deleted')//log results
        response.json('Todo Deleted')//send responds back to sender
    }) //close then
    .catch(error => console.error(error))//catch error
})//end delete

app.listen(process.env.PORT || PORT, ()=>{ //also using express, you use the listen method to specify which port we will be listening on - gets the one from env file, it doesn't exist, use the variable we set
    console.log(`Server running on port ${PORT}`)//log the running port
})//close listen