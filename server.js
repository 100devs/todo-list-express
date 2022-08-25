const express = require('express') //allows the use of express
const app = express() // set a variable and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoCleint and talk to our DB via mongoclient
const PORT = 2121 //setting port variable
require('dotenv').config() //allows us to look for a variable inside of the dotenv file


let db, // declare a variable but not assigning it 
    dbConnectionStr = process.env.DB_STRING, //declaring variable and assigning db string to it
    dbName = 'todo' // setting name for the database we will use

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to db and using our string to connect to it 
    .then(client => { // waiting on connection and rocedding if it works, passing client information
        console.log(`Connected to ${dbName} Database`) //log to console it connected 
        db = client.db(dbName) //assigning value to db vaariable and contains db factory variable
    }) //closing .then
    
app.set('view engine', 'ejs') //ejs as render method 
app.use(express.static('public')) //sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode url where header matches content.
app.use(express.json()) //parses jsonn content


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in. sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS document and passing in the todo items and counting the uncompleted items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  //starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert new item into the todos collection gives value of false
    .then(result => { // if insert successfull then do sumn
        console.log('Todo Added') //console log action
        response.redirect('/') // gets rid of /addtodo route and ressts to home route /
    }) //closing then 
    .catch(error => console.error(error)) //catch any error in this block
}) //end block

app.put('/markComplete', (request, response) => {   //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the DB for one item matching the name of the item passed 
        // in from the main.js file that was clicked on
        $set: { 
            completed: true //set completed status to true 
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list
        upsert: false //prevents insertion if the item does not already exist
    })
    .then(result => { //starts then if item was marked completed
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //look in the DB for one item matching the name of the item passed 
        // in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status to true 
          }
    },{
        sort: {_id: -1}, //move item to the bottom of the list
        upsert: false //prevents insertion if the item does not already exist
    })
    .then(result => { //starts then if item was marked completed
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catching errors

})

app.delete('/deleteItem', (request, response) => { //starts delete method when route delteitem is started
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  //look in the DB for one item matching the name of the item passed 
    // in from the main.js file that was clicked on
    .then(result => { //starts then if item was marked deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //catch any error

})

app.listen(process.env.PORT || PORT, ()=>{ //set up listening port either assigned port or env port set by database connection
    console.log(`Server running on port ${PORT}`) //console log completion
})