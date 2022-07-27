//Declaring variables
const express = require('express') //requiring express
const app = express() //Declaring a variable app to handle all the methods that expres give us
const MongoClient = require('mongodb').MongoClient //requiring MongoDB
const PORT = 2121 //Declaring a port for our Local server
require('dotenv').config() //Setting our .env to work


let db, //Declaring the database
    dbConnectionStr = process.env.DB_STRING, //asigning the DB string from Mongo
    dbName = 'todo' //DB collection we are using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to Mongo
    .then(client => { //solving the promise after connecting to the DB
        console.log(`Connected to ${dbName} Database`) //console log to know to which DB we are connected
        db = client.db(dbName) //storing db info in a variable
    })

//middleware
app.set('view engine', 'ejs') //setting the app to use and render EJS
app.use(express.static('public'))//serve files from public folder
app.use(express.urlencoded({ extended: true })) //setting the app to use urlencoded
app.use(express.json()) //parses JSON requests 

//Setting endpoints
app.get('/',async (request, response)=>{ //Initializing the GET Method and the root ayncrhronously
    const todoItems = await db.collection('todos').find().toArray()//putting the 'todo' documents in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//count how many documents have been passed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //create a knew document to the collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert one document in the body of the collection
    .then(result => { 
        console.log('Todo Added') //show message in the console saying that the new document has been added
        response.redirect('/') //redirect to the root
    })
    .catch(error => console.error(error)) //if error, shows message in the console
})

app.put('/markComplete', (request, response) => { //Update request to mark as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update one item from the collection
        $set: {
            completed: true //set the completed property as true
          }
    },{
        sort: {_id: -1}, //sort the items
        upsert: false //if true and doc does not exist, create one and insert into database
    })
    .then(result => { //solving the promise
        console.log('Marked Complete') //log a message to know that the update has been completed
        response.json('Marked Complete') //send a response as completed
    })
    .catch(error => console.error(error)) //log error 

})

app.put('/markUnComplete', (request, response) => { //Update request to mark as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update one item from the collection
        $set: {
            completed: false //set the completed property as false
          }
    },{
        sort: {_id: -1}, //sort the items
        upsert: false //if true and doc does not exist, create one and insert into database
    })
    .then(result => { //solving the promise
        console.log('Marked Complete') //log a message to know that the update has been completed
        response.json('Marked Complete') //send a response as completed
    })
    .catch(error => console.error(error)) //log error

})

app.delete('/deleteItem', (request, response) => { //delete method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete one item from the collection
    .then(result => { //solving the promise
        console.log('Todo Deleted') //log a message to indicate that the request has been completed
        response.json('Todo Deleted') //send a response as deleted
    })
    .catch(error => console.error(error)) //log error

})
//setting the local server
app.listen(process.env.PORT || PORT, ()=>{ //process.env.PORT to run on Heroku or to listen the server on PORT
    console.log(`Server running on port ${PORT}`) //log message that the server is running correctly
})