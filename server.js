//assign a variable to require express, allowing us to use it
const express = require('express')
//assign a variable to the express function 
const app = express()
//assign a variable importing mongo db
const MongoClient = require('mongodb').MongoClient
//hard coded port variable ther server can use to run the application
const PORT = 2121
//configure our ability to use the .env file 
require('dotenv').config()

//create a db variable, create and assign a variable storing the mongo db connection string in the .env file, create and assin a database name to the db in mongo db
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//connect to the mongo db cluster using the db string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { //wait for a successful db connection and pass data from the client
        console.log(`Connected to ${dbName} Database`) //log to the console the name of the database used within mongo db
        db = client.db(dbName) //assign the db variable to the database used within mongo db
    }) 

app.set('view engine', 'ejs') //set up the server to use the ejs teplate file
app.use(express.static('public')) //let express know to look in the public folder to serve up clien side files 
app.use(express.urlencoded({ extended: true })) //sets up express to be able to read urls
app.use(express.json()) //sets up express to use json files


app.get('/',async (request, response)=>{ //begin an http read method with the '/' URL as an asyncronoys method and set up request and response parameters.
    const todoItems = await db.collection('todos').find().toArray() //declare and wait to assign a constant variable grabbing data from the collection 'todos' and store in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //decale and wait to assign a constant variable storing the count of objects in the 'todos' collection that have a key value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //respond to the read request by rendering the index.ejs template file with the key preoperty set to variable todoItems and set the key of left to the variable itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //begin an http create method with the '/addTodo' route and set up request/response parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //reach into the 'todos' collection in the db and inster one record from a request form, filteting by the todoItem name and completed key 
    .then(result => { //once the todo item is succesfully inserted do the following
        console.log('Todo Added') //log to the console that a todo was added
        response.redirect('/') //respond to the client request by loading up the root directory showing the updated ejs html file
    })
    .catch(error => console.error(error)) //if an error occurs pass the error to the console
})

app.put('/markComplete', (request, response) => { //begin an http update method with the '/markComplete' route and set up request and response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //reach into the 'todos' collection and update one object when the item gets selected from the client side JS, filtering the name of the todo span
        $set: { //select a key in the object
            completed: true //change the key value to true
          }
    },{
        sort: {_id: -1}, //sort the updated object in descending order
        upsert: false //do not insert object if the object doesnt already exist
    })
    .then(result => { //once the update is successful do the following
        console.log('Marked Complete') //log to the console that the todo was marked complete
        response.json('Marked Complete') //respond to the client request with a json object letting them the to do was marked complete
    })
    .catch(error => console.error(error)) //if anything goes wrong pass the error to the console

})

app.put('/markUnComplete', (request, response) => { //begin an http update method once the /markUnComplete route is passed and set up request/response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //reach into the 'todos' collection in the db and update one object when the item is clicked in the client side JS. Filter by the name of the todo span
        $set: { //select a key in the object
            completed: false //change the complete key to false
          }
    },{
        sort: {_id: -1}, //sort the updated object in descending order
        upsert: false //do not insert object if the object doesnt already exist
    })
    .then(result => { //once the update is successful do the following
        console.log('Marked Uncomplete') //log to the console that the todo was marked again
        response.json('Marked Uncomplete') //responde to the cliens request with a json object telling them the todo was marked
    })
    .catch(error => console.error(error)) //if there is an error pass the error to the conosle

})
//we use the express method .delete() to initiate a delete request/response using the /deleteItem URL
app.delete('/deleteItem', (request, response) => {
//go into the database called todo and the collection called todos. Delete one document filtering by the this key property of 'thing' from the form body.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
//once the deletion is succesful console log a confimration of deletion 
    .then(result => {
        console.log('Todo Deleted')
//respond to the user that a todo was deleted 
        response.json('Todo Deleted')
    })
//if any errors occur log the error
    .catch(error => console.error(error))

})
//the server listens to a PORT defined in the .env file or a port declared within the server
app.listen(process.env.PORT || PORT, ()=>{
//log to the console a message indicating the port the server is running on
    console.log(`Server running on port ${PORT}`)
})