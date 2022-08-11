//  Imports express and stores in the variable
const express = require('express')
const app = express()

//Connects to MongoDB
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//declares db that will be initialized later, allows dbConnectionStr to be stored in an environment file that can be git ignored to not share username and password, and passes collection name as "todo"
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connects us to Mongo Atlas using promise. useUnifiedTopology option is used to remove deprecation warning.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //changes to the correct database. Defines where the database is. To be used to call specific collections from the database
        db = client.db(dbName)
    })

//Note: the express request handlers are not in the then call

//express request handler
//Middleware processing request and sending response allows us to use ejs, have access to public folder, recognize incoming request as strings or array or recognize data as json. Allows parsing requests

app.set('view engine', 'ejs') //sets ejs as default render
app.use(express.static('public')) //allows access to public folder such that assets can all be centrally located
app.use(express.urlencoded({ extended: true  //decodes and encodes URL where header matches the content. Extended supports arrays and objects
app.use(express.json()) //parse json content from incoming requests


//On refresh or loading route for first time, read request. Sets up request and response paramters
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //finds all the todo collection items storing in array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable and awaits the count of all items left to do (to later display in EJS).

//renders the ejs with items from the database
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders EJS file and passes through the db items and count remaining items left that are incomplete
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//updates one item with thing defined on ejs which corresponds to todoItem,and adds default completion status of todo item as false
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //returns confirmation message that item was added and refreshes to show item on the page (by calling the GET method)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //reloads and gets all items to display on ejs in the get method.
    })
    .catch(error => console.error(error))
})

// markComplete  parameter corresponds to the function on main.js that is the function called when . The callback arrow function updates db the specific collection  and updating specific "thing" from that collection. This thing is from main.js which is the itemText
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
      //option to update a document/record in the collection and sets completed property to true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        //does not insert when no record is available, default is also false
        upsert: false
    })
    .then(result => {
      //lets user know in console that it ran successfully. Settles the then promise by returning in json "Marked completed"
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//when the markUnComplete parameter has the callback function to update one item of itemFromJS from main.js to set the completed property to false.
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
    //sort option to  from low to high
        sort: {_id: -1},
          //option to update a document/record in the collection and sets completed property to true.
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//when the deleteItem from main.js is triggered, one item from the collection "todo" is deleted. The item is the itemFromJS that is defined in the main.js file. This corresponds to
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//express application listens on the port that is is defined in the env folder file. If non exist, it defaults to port 2121 and console logs which of the port the app is running on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
