const express = require('express') // makes it possible to use express in this file
const app = express()   // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //setting a variable for connecting to mongo database
const PORT = 2121 //constant set for location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, //declares db so it can be used globally
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our databse connection string to it
    dbName = 'todo'//declaring a variable and assigning the name of the databse we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to mongodb and passing in connection string and passing in an additional property
    .then(client => { //then method started for when mongodb returns promise if successful, and passing in client information
        console.log(`Connected to ${dbName} Database`)//log to console template literal
        db = client.db(dbName) // assigning a value to previously declared variable that contains
    })//closing then method
    
app.set('view engine', 'ejs') //sets ejs as default render
app.use(express.static('public')) //sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) //parses json content


app.get('/',async (request, response)=>{ //read request opened with parameter of '/' (root) which refreshes, async function with request and response params
    const todoItems = await db.collection('todos').find().toArray() //variable set that awaits items from database and returns them in array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //variable set that awaits the number of incomplete tasks. a function called countDocuments gets the number of non completed items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sends stuff to index.ejs with the variables just declared

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create method for adding tasks to the addTodo file in server
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert an object with two key value pairs, taking value of thing from the todoItem input form, and giving it a completed value of false since it is not done yet
    .then(result => { // then method opened with result as param
        console.log('Todo Added') //logs todo added when complete
        response.redirect('/') //refreshes to homepage to  show new item
    }) //close then
    .catch(error => console.error(error))//catches potential error and logs it
}) //closing post

app.put('/markComplete', (request, response) => { //updates when markComplete route is added in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates thing key in database of that task
        $set: {
            completed: true
          }//sets completed value to true
    },{ 
        sort: {_id: -1},
        upsert: false
    }) //prevents insertion if item doesnt already exist and moves it to the bottom of the list
    .then(result => { //then opened
        console.log('Marked Complete') //logs action
        response.json('Marked Complete') //sends response to sender
    }) //closeing then
    .catch(error => console.error(error)) //catch error

}) //close put

app.put('/markUnComplete', (request, response) => { //put with markUncomplete route to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find item that was clikced
        $set: {
            completed: false
          }//set completed value to false
    },{
        sort: {_id: -1},
        upsert: false
    })//prevents insertion if doesnt exist
    .then(result => {//then opened
        console.log('Marked Complete') //logs action
        response.json('Marked Complete')// send response back to sender
    })//close then
    .catch(error => console.error(error))//catch error
})//close put

app.delete('/deleteItem', (request, response) => { //delete mthod if deleteItem route is entered
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //finds item clicked
    .then(result => { //then opened
        console.log('Todo Deleted')//action logged
        response.json('Todo Deleted')//sends response back to sender
    })//close then
    .catch(error => console.error(error))//catch error

})// close delete

app.listen(process.env.PORT || PORT, ()=>{ //listen on port that works (env file) or PORT variable declared
    console.log(`Server running on port ${PORT}`) //logs action
}) //closes listen