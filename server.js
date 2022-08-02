const express = require('express')//making it possible to use express in this file
const app = express()//saving this instance of this express to a constant variable called 'app'
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB

const PORT = 2121//setting a globa constant variable to define the location where our server will be listening
require('dotenv').config() //allows us to access variables inside the .env file


let db, // declaring a variable called db but not assinging it a value, it is global so it can be accessed anywhere
    dbConnectionStr = process.env.DB_STRING,  //declaring a variable and assigning our database connection string to it.
    dbName = 'todo' //declaring a variable and assigning the name of the database we eill be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// Creating a connection to MongoDB, and passing in our connection string, plus passing in an additional property.(MongoClient.connect is essentially a promise)
    .then(client => {//if the connection above is successful, proceed to pass in all the client info.
        console.log(`Connected to ${dbName} Database`)//Log to the console a template literal 'connected to todo Database
        db = client.db(dbName)//assigning a value to the previously declared 'db' variable db client factory method.
    })//Closing the .then
//middleware ( helps us facilate our communication for our requests)    
app.set('view engine', 'ejs')  //sets ejs as the default render
app.use(express.static('public'))//sets the location for static assets.
app.use(express.urlencoded({ extended: true }))//Tells express to decode and encode URLs where the header matches the content.Supports arrays and objects.
app.use(express.json())//Parses JSON content from incoming requests.


app.get('/',async (request, response)=>{  //A read request(GET metod), the first argument is the route, loading the page for the first time or refreshing the page would trigger it to be fired.Sets up the request and response parameters.
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the todos collection(find() means all)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//seta a variable and awaits the number of uncompleted items to later display in ejs.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the 'index.ejs' file and passing throught the the db items and the count remaining inside of the object.


    //  Using clasic promise syntax to perform the same as above.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
     .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//stats a POST method when the add route is passed in (the  was declared directly in the form)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into the todos collection, (the post is coming from the form, that has an input name of 'todoItem'.We are setting completed as false. )
    .then(result => {  //promise syntax. If insert is successful, do something
        console.log('Todo Added')//Console log action
        response.redirect('/') //redirect to the the route
    })//close the .then
    .catch(error => console.error(error))//If there is an error catch it here and print it out
})//ending the POST

app.put('/markComplete', (request, response) => { //starting a PUT method when the markComplete rout is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Look in the database for sone item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true//set the completed vstatue to true
          }
    },{
        sort: {_id: -1},//Moves item to the bottom of the list
        upsert: false  //Prevents insertion if item does not already exists
    })
    .then(result => {//Starts a .then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//Sends a response back to the server.
    })
    .catch(error => console.error(error))//catching errors

})//Ending the PUT

app.put('/markUnComplete', (request, response) => {//Starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching thename of the item passed in 
        $set: {
            completed: false//set the completed status of the item to false.
          }
    },{
        sort: {_id: -1},//Moves item to the bottom of the list
        upsert: false  //Prevents insertion if the item does note already exist
    })
    .then(result => {//Starts a .then if the update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the server
    })
    .catch(error => console.error(error))//Catching and logging an error if one occured

})//ends the PUT

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//Looks inside the todos collection for the ONE item that has a name matching name from our JS file
    .then(result => {//Starts a .then if the delete was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//Sending a response back to the server
    })
    .catch(error => console.error(error))//Catching and logging errors.

})//Ending delete

app.listen(process.env.PORT || PORT, ()=>{//specifying which port we will be listening on - either the port form the .env file or the veriable we set.
    console.log(`Server running on port ${PORT}`)//Console.log the running port.
})//end the listen method.