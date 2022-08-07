const express = require('express')//declare constatn to use express
const app = express() //declare variable app that will use express
const MongoClient = require('mongodb').MongoClient //declare variable MongoClient to use mongodb
const PORT = 2121 //setting constant for port assign to 2121
require('dotenv').config() //use .env file to look inside for setup variables


let db, //declare variables to connect to the database
    dbConnectionStr = process.env.DB_STRING, //db connection string, assigned in the .env file
    dbName = 'todo' //database name we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to Mongo database using assigned dbConnectionStr //second paramether not needed anymore
    .then(client => { //waiting to the connection and proceeding if successfull
        console.log(`Connected to ${dbName} Database`)// after connecting log on the console 'Connected to todo Database'
        db = client.db(dbName) //assigning a value to previously declared db variable with the db client factory method
    })//end of promise
    
// middleware
app.set('view engine', 'ejs') //sets ejs as default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //express can decode and encode URL's where header matches the content. extended:true suports array and objects
app.use(express.json()) //parses incoming JSON requests and puts the parsed data in req.


app.get('/',async (request, response)=>{ //start a get method when the root route is passed and sets request and response paramethers
    const todoItems = await db.collection('todos').find().toArray() //set a variable that awaits the returned array from all the items in the database collection 'todos'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //set a variable that holds the number of all not competed 'todos' to display in .ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing the db object with items and  count of the left not compleated items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closing GET method

app.post('/addTodo', (request, response) => { //starting POST(create)method with 'addTodo' route passed, setting req and res
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//insert into the db collection a new item object from the EJS file form input name="todoItem", that has 'completed' value false
    .then(result => { //parse the result
        console.log('Todo Added') //log on the console
        response.redirect('/') //redirect the page to home
    })//close then method
    .catch(error => console.error(error))//catch an error if there is one and log the error on the console
})//close POST method

app.put('/markComplete', (request, response) => {// start PUT (update) method when the 'markComplete' route is passed, setting request and response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update the db collection for the item name that was clicked on//best to use id
        $set: { //In MongoDB, the $set operator is used to replace the value of a field to the specified value
            completed: true //set 'completed' value to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //if item does'n already exists the false value stop its from being created
    })
    .then(result => { //starts if update success, set result
        console.log('Marked Complete')//logging to the console
        response.json('Marked Complete') //send json back with response
    })//closing then
    .catch(error => console.error(error))//catching error

})//closing put

app.put('/markUnComplete', (request, response) => {// start PUT (update) method when the 'markUnComplete' route is passed, setting request and response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update the db collection for the item name that was clicked on//best to use id
        $set: {//In MongoDB, the $set operator is used to replace the value of a field to the specified value
            completed: false //set 'completed' value to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //if item does'n already exists the false value stop its from being created
    })
    .then(result => { //starts if update success, set result
        console.log('Marked Complete')//logging to the console
        response.json('Marked Complete') //send json back with response
    })//closing then
    .catch(error => console.error(error))//catching error

})//end put

app.delete('/deleteItem', (request, response) => {// start DELETE method when the 'deleteItem' route is passed, setting request and response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look into the db collection for the item name(best to use id) that was clicked on bin icon
    .then(result => {//if delete was success start, pass result
        console.log('Todo Deleted') //log on the console message
        response.json('Todo Deleted')//send respond back 
    })//close then
    .catch(error => console.error(error))//if error catch and print error

})//end delete 

app.listen(process.env.PORT || PORT, ()=>{ //set up port server to listen on either from .env file or local port
    console.log(`Server running on port ${PORT}`)//log on the console message
})//end listen method