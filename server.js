//This loads the express module, require is similar to import in other languages
const express = require('express')//making it possible to use express in this file
// Calls the express function "express()" and puts new Express application inside 
//the app variable (to start a new Express application). It's something like you 
//are creating an object of a class. Where "express()" is just like class and 
//app is it's newly created object.
const app = express() //setting a constant and assigning it to the instance of express
//This loads the mongodb package, and we use mongoClient to talk to mongo 
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with mongoclient and talk to our db
//Sets the port as a variable so we can use that going forward
const PORT = 2121 //setting a constant to define the location where our server will be listening
//we are going to use our env files 
require('dotenv').config() //allows us to look for variables inside of the .env file

//this all connects to the database   
let db, //declare a variable called db but not assign a value
    //enviroment variables are used instead of the mongo connection string 
    //the connection string is stored in the env file 
    //this is so the mongo conection string doesn't get pushed up to github
      
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name af the database we will be usind

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongodb, and passing in our connection string also passing an additional property
    .then(client => {//waiting for the connection and proceeding if succussful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal 'connected to todo database
        //this is the actual database that we are connected to    
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then
    
//we are using ejs as our templating language 
app.set('view engine', 'ejs')//sets ejs as the default render method
//we are using our public folder to use all of our static files
app.use(express.static('public'))//sets the location for static assets
//this does what body-parser does, we look at the requests coming through 
//and allows us to get the data/ text out of the requests
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests

//we are listening for a get request from the root route 
app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, sets up req and res parameters
    //we are connecting to our database with db
    //we find the collection in our database called todos
    //find() returns all of the documents inside of the collection 
    //We then put all of those documents found into an array
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    //this gives us the number of documents that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits
    //we are passing the returned objects into the template/ejs 
    //We will not see todoItems, itemsLeft in the template 
    //we will see items and left
    response.render('index.ejs', { items: todoItems , left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining insido of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//the route comes from the action on the form 
app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    //this allows us to see all the extra unimportant (to us) stuff
    //that is in the request, vs the body 
    console.log(request)
    console.log(request.body)
    //this takes the value from inside the input with the 'name' todoItem 
    //and puts it into the mongodb database with property completed: false
    //it connects to the database finds the collection called todos
    //and then adds it
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful then do something
        console.log('Todo Added') //console log action
        //Once this is completed it refreshes the page with a get request
        //to the root, and now there will be an added item in the db
        //that will be added to the dom
        response.redirect('/') //gets rid of the /addTodo route and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST

//our fetch in main.js had a method of put
//and a route of markComplete
app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    //itemFromJS was sent from main.js and refers to the text of the
    //item that was clicked in the dom
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from  the main.js file that was clicked on
        //this will set completed to true for the clicked item
        $set: {//
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        //If upsert is true and you try to update something that is not there
        //it will create the document for you
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        //THis response is sent to main.js 
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending put


app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging succussful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending put

//our fetch in main.js had a method of delete
//and a route of deleteItem
app.delete('/deleteItem', (request, response) => {//starts a delet method when the delete route is passed
    //We go to our collection 'todos' and delete the document with
    //the 'thing' that matches the inner text of the span 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todes collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        //this responds back to client side (main.js )
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending delete
//were using our port, or once were on horoku we will use the environment variables
 
app.listen(process.env.PORT || PORT, ()=>{//setting up which port we wil be listening on - either the port from the .env file or the port variable we set 
    console.log(`Server running on port ${PORT}`) //console.log the running port
})//end the listen method