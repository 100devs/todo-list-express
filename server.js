const express = require('express')  //making possible to use express in this file
const app = express()   //setting a varibale and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient  //makes it possible to use methods associated with MongoCLient and talk to our DB
const PORT = 2121 //setting a constant for out port to use
require('dotenv').config()  //allows us to look foir varaible indie of our env. file


let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,   //declaring a variable and assigning our database connection string to it 
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection in Mongo and passing in our connection string
//also passing in a an additional property
    .then(client => {  // waiting for the conection and proceding if succesful, and passing in all the client info
        console.log(`Connected to ${dbName} Database`)  //log the database connected too "todo"
        db = client.db(dbName) //reassinging db to variable that contains a db client factory method
    }) //closing our .then
 
//middleware    
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets the location for the static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content. Supports arrays and ojects
app.use(express.json()) //Parses JSON content from incoming requests



app.get('/',async (request, response)=>{    //starts a GET method when the root route uis passed in, sets up req and res parameteres
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits All items from thge todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later dislay in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering ejs file and passing though the db items and the count remaining inside of an ojbject
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {   //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //inserts a new itme into todos collection,gives it a completed value of false
    .then(result => {   //if insert is succesful do something
        console.log('Todo Added') //console.log action
        response.redirect('/')  // this refreshes the page
    })//ending the POST
    .catch(error => console.error(error)) //catching errors
})

app.put('/markComplete', (request, response) => { //starts a PUT method when the markCopmplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the dB for one item matching the name of the item passed in from the man.js file
        $set: {     
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false   //prevents insertion if item does not already exist
    })
    .then(result => {   //starts a then if the update was successful
        console.log('Marked Complete') //logging successful completion 
        response.json('Marked Complete') 
    })
    .catch(error => console.error(error)) // catch errors

})

app.put('/markUnComplete', (request, response) => { 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //listens for port
    console.log(`Server running on port ${PORT}`)
})