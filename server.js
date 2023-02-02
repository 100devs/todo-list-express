const express = require('express')//makes it possible to use express in this file
const app = express()//setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//This allows us to talk to our mongo database using methods associated with MongoClient
const PORT = 2121//setting a variable to hold our port location where our server will be listening
require('dotenv').config()//lets us use the dotenv to access what we put in there


let db,//declare a variable called db but not assigning it a value yet
    dbConnectionStr = process.env.DB_STRING,//declare a variable and assign our db string to it, which is found in the .env file
    dbName = 'todo'//we declare a variable and set the name of the database that we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongdb and passing in our connection string, and then passing in an additional property useUnifiedTopology
    .then(client => {//waiting for the connection and proceeding if succesful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to console a template literal telling us that we are connected to todo database.
        db = client.db(dbName)//assigning a value to our previously declared db variable that contains a db client factory method
    })//closing our .then method
 
//middleware section helps facilitate our communication
app.set('view engine', 'ejs')//lets us use our ejs basically as the default render method
app.use(express.static('public'))//tells express to set the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URL's where the header matched the content. Supports arrays and objects
app.use(express.json())//allows us to parse json, this replaces bodyParser


app.get('/',async (request, response)=>{//express method to do a (read) get request to the '/' main  root route, then runs an async function with a req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits the todo collection in our mongo db then finds them all and returns them in an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable that gois into our collection todos from our mongodb then counts the documents that have the completed property to false then returns that number
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//we get the response that we want to send and render our ejs file which is our html and pass in the items property and the left property and their values to the two variables we set above.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))//our error handling, if there is ann weerror with the promise we console the error
})//we close the get method

app.post('/addTodo', (request, response) => {//telling express to do a post method (create) and is trigger when we go to the /addTodo route which is the action we put on the form.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//insert a new item into our todos collection in our mongo db. it is setting up an object with the thing and completed keys which is the structure of our database. things value is going into the body of the request which is the form we put in and is getting the todoItem which is what we put on the form as the name so it gets the value that was typed. then we hardcode the items completed value to false
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log the action
        response.redirect('/')//we respond to the request with a refresh to the main route to trigger the get request to update the ejs and display our new information that we get from the mongodb
    })//close our then
    .catch(error => console.error(error))//error handling to display the error if something went wrong
})//close our put(create) request

app.put('/markComplete', (request, response) => {//telling express to a put request(update) and is triggered when we go to our /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//we go into our mongo db collection todos, then use the update one method to look for the thing, which will be the itemFromJS which we created in our main.js which holds the itemText. It uses that information to look for that same match in mongoDB to update it.
        $set: {//we use the mongo method to set(update)an item in the db
            completed: true//set the completed key to have a value of true
          }//close our set method
    },{
        sort: {_id: -1}, //sorts the item the end of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//log to the console that the item was marked complete
        response.json('Marked Complete')//respond with json cause the markComplete()function is awaiting it
    })//close the then
    .catch(error => console.error(error))//error handling 

})//close the put request

app.put('/markUnComplete', (request, response) => {//create another put(update) request, this time with the route that triggers it as /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//go to our database with the todos collection then update one document that has the thing value matching what we are passing in here 
        $set: {
            completed: false//set the items completed property to have a false value
          }
    },{
        sort: {_id: -1},//sort the item
        upsert: false//prevents insertion if item does not already exst.
    })
    .then(result => {//if the update was successfull, then do this
        console.log('Marked Complete')//log to the console marked comp
        response.json('Marked Complete')//sending a response back to the sender
    })//close .then
    .catch(error => console.error(error))//error handling

})//closing the put request

app.delete('/deleteItem', (request, response) => {//create a delete request triggered when the /deleteitem route is called
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//go to the db collection called todos then call the mongodb method delete one and pass in the item we want to delete which is found in the body of the request
    .then(result => {//start a then
        console.log('Todo Deleted')//log todo deleted to the console
        response.json('Todo Deleted')//sending a response back to the sender
    })//close the then 
    .catch(error => console.error(error))//catching errors

})//close the delete request

app.listen(process.env.PORT || PORT, ()=>{//telling express to listen to our port number or the port our hosting site gives it
    console.log(`Server running on port ${PORT}`)//log to the console our success message to know that the server is running
})