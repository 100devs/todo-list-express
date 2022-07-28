const express = require('express')                                      //enable express
const app = express()                                                   //allows using "app" as a shorthand whenever calling an express function
const MongoClient = require('mongodb').MongoClient                      //enables the use of Mongodb
const PORT = 2121                                                       //creates PORT variable and assigns it to 2121. Allows us to alter the PORT easily
require('dotenv').config()                                              //enables dotenv - allows using .env file to pull specific information (like connection strings and things you dont want to share publicly)

                                                                        //declares variables related to DB
let db,                                                                 //declaires db variable
    dbConnectionStr = process.env.DB_STRING,                            //assigns dbConnectionstr to the DB connection string contained in .env file (needs to be created/copied from MongoDB)
    dbName = 'todo'                                                     //creates a dbName to name DB once connected

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })      //connects to MongoDB using connection string from .env file; uses Unified Topology so no ened to connect then commit changes
    .then(client => {                                                   //once connected, do the following
        console.log(`Connected to ${dbName} Database`)                  //console log connection with name of DB ("todo")
        db = client.db(dbName)                                          //assigns db to the MongoDB DB named "todo"
    })
    
app.set('view engine', 'ejs')                                           //allows use of "view engine" and "ejs"
app.use(express.static('public'))                                       //use "public" folder for status objects -> .js and .css
app.use(express.urlencoded({ extended: true }))                         //allow use of express urlencoder -> recognize incoming requests as strings or arrays
app.use(express.json())                                                 //allow use of express json -> recognize JSON files on GET


//Async/Await function for GET DB items
app.get('/',async (request, response)=>{                                                    //READ request for root when going to base URL:PORT
    const todoItems = await db.collection('todos').find().toArray()                         //READS all documents in the todo DB/collection and stores then as an array of objects
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})       //counts all documents in the todo DB/collection which have the key "completed" set to value "false"
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                     //renders index.html from index.ejs file, passing todoItems and itemsLeft to the ejs file
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {                                               //CREATE new task function via URL/addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})      //insert new document to the todos DB; thing value equals the todoItem from the submited request; defaults completed to false
    .then(result => {                                                                       //??    once added do the following (is result the default naming scheme or is this set somewhere????)
        console.log('Todo Added')                                                           //console log that Todo was Added
        response.redirect('/')                                                              //refresh the root foldor index.ejs
    })
    .catch(error => console.error(error))                                                   //console log errors encountered
})

app.put('/markComplete', (request, response) => {                                           //UPDATE task function via URL/markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{                     //update document from todos DB that matches item name from JSON sent by app
        $set: {                                                                             //set key value items:
            completed: true                                                                         //completed to true
          }
    },{
        sort: {_id: -1},                                                                    //resort items in descending order by ID (most recent item at the top)
        upsert: false                                                                       //will not insert new document if no match is found
    })
    .then(result => {                                                                       // once complete
        console.log('Marked Complete')                                                      // console log that task has been marked complete
        response.json('Marked Complete')                                                    //respond to the JSON file that something has been done with it
    })
    .catch(error => console.error(error))                                                   //console log any errors

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

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})