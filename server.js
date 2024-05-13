const express = require('express') // use express as the framework 
const app = express() // do all your code on top of the framework. Shorten it to app for readability
const MongoClient = require('mongodb').MongoClient // use mongodb as the database
const PORT = 2121 // use port 2121 as the local port 
require('dotenv').config() //use a .env file for your environmental variables (I didn't make one yet)


let db, // declare the variable db, create a space in memory for it.
    dbConnectionStr = process.env.DB_STRING, //store your connection string to the database in a variable. Store the actual connection string in the .env file for privacy/security (and dont upload that file to github, put it in your .gitignore)
    dbName = 'todo' // store the name of your mongodb database in a variable 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to the mongodb database using the connection string. since this is an async request (it leaves the app and waits for the db to connect, it returns a promise object)
    .then(client => { // .then is how you handle the returned promise object. the data that is returned (stored in parameter client)  represents the connection to the database
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // allows you to select which database out of the connection you are going to work with (in this case 'todo' database)
    })
    
app.set('view engine', 'ejs') // use ejs as the templating language that spits out your html. you need ejs instead of just html on it's own because you're grabbing things from the database to put in it, it's not hard coded or from your local storage.
app.use(express.static('public')) // use a public folder to put all the files inside that you want to automatically be served with every refresh. this means you don't need to make a .get() for all of them. Really an amazing line of code! You normally put your css and client side js in here. 
app.use(express.urlencoded({ extended: true })) // use this to help read each request.body that are URL encoded
app.use(express.json()) // use this to help read request.body that are in JSON format 

//What to do when the client makes a Read request
app.get('/',async (request, response)=>{ // when the client side device goes to the home page, do this async function which takes in a request (from the client side device) and sends a response.
    //It is async because the api is going to the database and that takes time and we want our program to wait. You don't want the html to render until the data has been grabbed and put into it.
    const todoItems = await db.collection('todos').find().toArray() //go to the todos database. grab everything there and put it into an array called todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // go to the the db and count every item that has a property of completed = false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //send a response that is an ejs file which you put that data into. In items, you will put todoItems. In left, you will put itemsLeft
    //Code below is same thing as above but uses just promises and not async await syntax
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//What to do when the client makes a Create request
  //Code below uses just promises and not async await syntax. I think Leon just wants to show us different ways you can do it. 
app.post('/addTodo', (request, response) => { //Create something in the database. When the /addTodo route is triggered by clicking submitting the info in the form (/addToDo is on the form), trigger a function which takes in a request and sends a response.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //go to the db, find the todos collection and insert the the thing sent along with the request (the request body) into the thing property in the db and hardcode the completed property to false (since it's a new to do and has not been completed yet)
    .then(result => { // after the thing is inserted into the db, you get back the result, which is the outcome of the resolved promise, in this case it was fulfilled and said everything went ok: the thing was inserted into the db, after you get that, run the following function (which is unnamed?)
        console.log('Todo Added') //write this in the SERVER console (not browser)
        response.redirect('/') // respond by telling the browser to refresh, aka send a get request
    })
    .catch(error => console.error(error))// if the promise is rejected, write an error in the server console (not brower)
})

//What to do when the client makes an update request
app.put('/markComplete', (request, response) => { //when you get a request from the /markComplete route in the client side js, run the following function. The request is triggered by an event listener listening for a click on a to do item. The api takes in a request and sends a response 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to the db and update the thing with this thing property value. go the request body (what was sent along with the request) to know which thing is being updated
        $set: { // update it 
            completed: true // update the completed property to true
          }
    },{
        sort: {_id: -1}, //sort the array in ascending or descending order (I forget)
        upsert: false //If the thing it was looking for in the db didn't exist, should it create it there itself? in this case no (I think)
    })
    .then(result => { //all that took time. once it's done and you get the result (the promise resolves to fulfilled), run the following function
        console.log('Marked Complete') // Say this in the server console
        response.json('Marked Complete') //respond to the client side device that the promise was resolved and the operation was successful
    })
    .catch(error => console.error(error)) //if the promise was rejected, console log the error in the server console

})

//this is an api that listens for a request on the /markUnComplete route for the client side js
app.put('/markUnComplete', (request, response) => { //the api takes in a request and a response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go to the database, find the thing that is requested to be updated
        $set: { //change something
            completed: false //change the completed property to false
          }
    },{
        sort: {_id: -1},//sort array in ascending or descending order
        upsert: false // if the item you're looking for doesn't exist, do not create it 
    })
    .then(result => { //since that all took time, wait for that to happen and then do this. take in the result, if the result is fulfilled, do this
        console.log('Marked Complete') // write in the server console that it worked
        response.json('Marked Complete') //tell the client side device that it worked
    })
    .catch(error => console.error(error))//if the promise was rejected, log the error in the server console

})

//when this api hears a delete request on the /delete item route, take in the request and response and run the following function
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go to the databse, find the thing with the value that was sent in the request body
    .then(result => { //since that took time to find the thing, wait for it. if the result was fulfilled, do the following
        console.log('Todo Deleted') // log in the browser console
        response.json('Todo Deleted') //send a response saying this
    })
    .catch(error => console.error(error)) //if the promise was rejected, log an error 

})

app.listen(process.env.PORT || PORT, ()=>{ //  Create and launch a server that listens on either the port referenced in the env file OR the port variable
    console.log(`Server running on port ${PORT}`) //if that worked, log this 
})

