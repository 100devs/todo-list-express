const express = require('express') //establishing use of express package in this file
const app = express()//saving a constant variable to use Express
const MongoClient = require('mongodb').MongoClient//setting up method to facilitate MongoClient connection to MongoDB
const PORT = 2121//setting a constant variable for a port where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declaring a global variable called db but no value assigned yet, can use outside of function
    dbConnectionStr = process.env.DB_STRING,//declaing a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to the database and passing in our connection string, also using a property of UnifiedTopology
    .then(client => {//using a promise to establish a sequence
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//only prints if connection is successful
    }) //assign the database variable from line 8
    
app.set('view engine', 'ejs') //set theh options for the express app we assigned earlier
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //middleware- look in the public folder for routes we call up later; comes between the request and response
app.use(express.json()) //settings


app.get('/',async (request, response)=>{ //client requests the 'route' page, we send these back
    const todoItems = await db.collection('todos').find().toArray() //wait for the database to reply; convet the documents from database into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //wait for the database to reply; grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //show us what we're sending
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

(//find the todos, put in array, find the number of not completed tasks; filter them, find the number of not completed tasks; if we hit an error let us know)

app.post('/addTodo', (request, response) => { //update from the CRUD or create
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add a new item/document to our todo list on database; insert in the body of the todoItem and automatically set it to false for completed;
    .then(result => {
        console.log('Todo Added') //let us know that we sucessfully added a todo item
        response.redirect('/') //go back to the route screen/homepage
    })
    .catch(error => console.error(error)) //uh oh we got an error, here you go
})

app.put('/markComplete', (request, response) => { //update some parts of the documents on our databasee
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change the todo
        $set: {
            completed: true //mark it as complete
          }
    },{
        sort: {_id: -1}, //sort by id: descending biggest to smallest so it ends up last?
        upsert: false //update plus insert = upsert; updates the rendering so don't double add stuff
    })
    .then(result => { //second do;
        console.log('Marked Complete') //let us know it worked;
        response.json('Marked Complete') // let the client know it worked;
    })
    .catch(error => console.error(error)) //if error shove it in the console log

})

app.put('/markUnComplete', (request, response) => { //update our documents round 2;
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change this one todo
        $set: {
            completed: false //we didn't actually do this todo so its undone
          }
    },{
        sort: {_id: -1}, //sort by id; this one goes last
        upsert: false //don't add a double
    })
    .then(result => { //sets up result in case we want to use it later but we don't use it now
        console.log('Marked Incomplete') //let us know it worked
        response.json('Marked Incomplete') //let client know it worked
    })
    .catch(error => console.error(error)) //if error, show in console log

})

app.delete('/deleteItem', (request, response) => { //delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete this item
    .then(result => { //again, result in case we want it later
        console.log('Todo Deleted') //it worked - to server
        response.json('Todo Deleted') //it worked - to client
    })
    .catch(error => console.error(error)) //oh no, there's a problem

})

app.listen(process.env.PORT || PORT, ()=>{ //this is where we listen to the PORT; first one is for Heroku's set one, or else use the one we declared on line 4;
    console.log(`Server running on port ${PORT}`) //server lets us know we are connected
})