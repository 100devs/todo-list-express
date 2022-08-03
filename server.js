const express = require('express') //requires express be imported into Node 
const app = express() //creates express application 
const MongoClient = require('mongodb').MongoClient //requires mongoDB client library 
const PORT = 2121   //sets variable for PORT 
require('dotenv').config() //imports and enable dotenv file for secrets


let db,//declare variable for database
    dbConnectionStr = process.env.DB_STRING,   //variable to pull in DBstring from the dotenv
    dbName = 'todo'  //these three lines initialize db variables, connectionStr refers to the connection string taken from MongoDB connection + password, third line declares the name of the db (in Mongo Atlas) to a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//tells our server to connect to the db with the connectionStr
    .then(client => {//waiting for connection and proceeding if successful, passing in client information 
        console.log(`Connected to ${dbName} Database`) //if client is able to connect then the console will print the message "connected to TODO database"
        db = client.db(dbName) //assigning a value to a previously declared db variable that contains a db client factory method 
    }) //closing the .then

 //middleware   
app.set('view engine', 'ejs')//determine how we're going to use view (template engine to render ejs (embedded JavaScript) commands 
app.use(express.static('public')) //tells our app to use a folder named public for all of our static files (images style files)
app.use(express.urlencoded({ extended: true })) //call to the middleware that cleans up how things are displayed and how our server communicates with our client, tells express to decode and encode URLs where teh header matches the content
app.use(express.json()) //parses JSON content 


app.get('/',async (request, response)=>{ //app is going to find main page '/' index.ejs 
    const todoItems = await db.collection('todos').find().toArray() //waiting to go into our db and turns data into array to use it toArray() method allocates a new in-memory array with a length equal to the size of the collection (everything that's in the collection)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the total count of all completed items marked completed:false to display in EJS 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
     .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default  
    .then(result => { //if insert is successful, do something 
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the /addTodo route and redirect back to the homepage
    })
    .catch(error => console.error(error)) //cathcing erros 
}) //ending post 

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed 
    db.collection("todos")
      .updateOne(
        { thing: request.body.itemFromJS },
        {
          //updates an item in the todos collection matching the name of the item passed in from main.js file that was clicked on
          $set: {
            completed: true, //sets completed status
          },
        },
        {
          sort: { _id: -1 }, //moves item to bottom of the list
          upsert: false, //prevents insertion if item does not already exist
        }
      )
      .then((result) => { //starts a then if update was succesful 
        console.log("Marked Complete"); //logging successful 
        response.json("Marked Complete"); //sending a response back to server
      })
      .catch((error) => console.error(error)); //catching errors 

})

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUncomplete route is passed 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list 
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete') //logging succesful completion 
        response.json('Marked Complete') //sending a response back to the sender 
    })
    .catch(error => console.error(error)) //catching errors 

}) //ending  put 

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the delete route is passed 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => {//starts a then if delete was successful 
        console.log('Todo Deleted') //logging succesful completion 
        response.json('Todo Deleted') //sending a response back to sender 
    }) //closing .then 
    .catch(error => console.error(error)) // catching errors 

}) //ending delte 

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file or the port variable we set 
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //end the listen method 