const express = require('express')  //telling the server to use the express module 
const app = express() 
const MongoClient = require('mongodb').MongoClient //telling the server to use the mongodb and .MongoClient is a node.JS module that allows you to create, connect and manipulate a mongo database using different methods
const PORT = 2121 //says PORT should be on localhost:2121
require('dotenv').config() //sets up the folder that holds your passwords and keys for example the key to mongoDB 

let db,
    dbConnectionStr = process.env.DB_STRING, //go into the .env file and find the DB_string
    dbName = 'todo' // sets variable dbName to to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // useUnifiedTopology to allow mongoDB to decide where the server should run from
    .then(client => { //this is a promise that returns the connection to the database, so we can get the data from it  
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)//client is basically what comes back from the promise, and we are naming the database connection db 
    })
    
app.set('view engine', 'ejs')//its telling the server to use ejs as the templating engine
app.use(express.static('public'))//tells the server we are using the public folder, to find html and css, instead of pointing to it
app.use(express.urlencoded({ extended: true }))//urlencoded method tells the server how to translate the charachters in the URL
app.use(express.json())//tells the server to put things in object oriented formats


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //searches through the database and adds all items to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //returns any items within the array that are not marked "completed"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders returned items in the dom
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //when the route '/addTodo' is requested by client, returns a response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => { //promise created
        console.log('Todo Added') //console logs notification that a task was added
        response.redirect('/') //auto refreshes database to show new task that was added
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //updates the to do item to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: { //$set outputs documents that contain all existing fields from the input documents and newly added fields.
            completed: true //adds the property of completed, and sets it to true
          }
    },{
        sort: {_id: -1},//sorts in descending order the numbers in the collection of the database
        upsert: false//we don't want any new documents added into the collection
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')//to let the computer know its complete
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //updates the to do item to uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //adds the property of completed, and sets it to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')  //logs to console an incorrect message that the thing is marked complete.  Probably copypasta
        response.json('Marked Complete') //sets a Promise of an incorrect message that the thing is marked complete.  Probably copypasta
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //when deleteItem is sent as part of the URL it runs this method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete the itemFromJS property of the body object
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //use our port only if Heroku doesnt have a defualt port it wants to use
    console.log(`Server running on port ${PORT}`)
}) 