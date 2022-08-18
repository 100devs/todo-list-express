const express = require('express')//making it possible to use express in this file
const app = express() //we are saving the call to express in a variable called app.
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and to talk to the DB
const PORT = 2121 // setting a variable to determine the port of the location where our server will be listening
require('dotenv').config()//allows us to look for variables in the .env file


let db, //declaring a global variable without assigning a variable
    dbConnectionStr = process.env.DB_STRING, //look in the env file and assign that to the DB connection string variable 
    dbName = 'todo' // declaring a variable and assigns it to the sets the name of the 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and passing connectionstr and an additional property (unified topology)
    .then(client => { //mongoClient. connct establishes a promise because we only want to console log when the connection is successful OR waiting for the connection and passing it if successful. Also accessing all of the client info
        console.log(`Connected to ${dbName} Database`) //logging to the console a temperate literal
        db = client.db(dbName)//assigning a value to previously declared variable that contains a db client factory method
    })//closing the .then

    //MIDDLEWARE - facilates communication channels for our request
app.set('view engine', 'ejs') //our sets ejs as the default render method
app.use(express.static('public')) //default location for static assets (html & css)
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode where the url matches the content. the extended is for arrays and objects
app.use(express.json()) //helps us parse JSON content

//METHODS
app.get('/',async (request, response)=>{//app refrences express.get = read and triggers with a refresh. When the root route is passed in and sets up req & res parameters
    //listening for a get request and the / tells us the root page
    const todoItems = await db.collection('todos').find().toArray()//sets a variable that awaits all the items in the todos collection and put in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable that awaits a count of uncompleted items and later displays them in the ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the ejs and passing through the db items and count of what is left in the object
    // db.collection('todos').find().toArray() //holds the connection to our db and finds the collection called todos. Inside the collection are called documents and we are saying find all the documents with .find(). The documents are objects and we use an array to hold all the objects hence why the .toArray.
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //passing the array of objects into my ejs and are given a name called items. Anywhere you see items in index.ejs, you find the array of objects. render means the html file
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //[the route /addTodo comes from the action of the form that made the post request]
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert the doc/object into the todo collection. every object will have a completed and thing propety.New todos are not completed by default hence false. if set to true, it starts out being crossed out which isn't what we want
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console logging the action
        response.redirect('/') //gets rid of the /addtodo route and takes you back to the home page.response is to refresh. when you refresh it gets you a get request.
    }) //closing the then
    .catch(error => console.error(error))//catching errors
})//closing the post method

app.put('/markComplete', (request, response) => { //starting a PUT (update) method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in the main.js clicked on
        $set: {
            completed: true //setting the completed value to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list. did not do anthing in this code
        upsert: false //a mixture of update and insert. hence set to false so that if the item doesn't exist, insertion is prevented
    })
    .then(result => {//sets a then if update was successful
        console.log('Marked Complete')//logs a successful completed action to the console
        response.json('Marked Complete')//sending a response back to the sender
    })
    .catch(error => console.error(error))//catching error

})

app.put('/markUnComplete', (request, response) => {//starting a PUT using a different route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//go to the db and find an item that matches what is clicked on
        $set: {
            completed: false//setting completed to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list. did not do anthing in this code
        upsert: false//a mixture of update and insert. hence set to false so that if the item doesn't exist, insertion is prevented
    })
    .then(result => {//sets a then if update was successful
        console.log('Marked Complete')//log the successful completed action
        response.json('Marked Complete')//sends a response back to the sender
    })
    .catch(error => console.error(error))//logs error

})

app.delete('/deleteItem', (request, response) => {//starts a delete method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//todos item that has a matching name of the passed in file
    .then(result => {//if delete was successful
        console.log('Todo Deleted')//logs the value
        response.json('Todo Deleted')//sends a response back to the sender
    })
    .catch(error => console.error(error))//catch error

})

app.listen(process.env.PORT || PORT, ()=>{//specofoes which port we will be listening on either on the .env file or on the variable PORT
    console.log(`Server running on port ${PORT}`)//console log the running port 
})