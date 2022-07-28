//assign the express module to the imported module express
const express = require('express')
//create a new express application, assigned to the app variable
const app = express()
//require the mongodb module, to connect to the database
const MongoClient = require('mongodb').MongoClient
//set the port variable that will be used to listen for
const PORT = 2121
//import the dotenv module and call the config method, which reads from the .env file nearby and adds them all to process.env
require('dotenv').config()

//Declare three variables here: db, connectionstr and dbName and initialize two of them.
//dbConnectionStr holds the value of the envirnonment variable we set up in .env as DB_STRING
//dbName holds the string todo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    //Use the connect method in the mongoclient (imported from  above) and passing out db string (initialized above from dbConnectionStr)
    //
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//after connected console.log that we are connected to the 'todo' database
    .then(client => {
        //console log the name of the database that has been accesses to ensure that the process has been successful
        console.log(`Connected to ${dbName} Database`)
        //initialize the db variable to connect to the db on mongodb. From here on out we can use the db variable to access the database.
        db = client.db(dbName)
    })
//Set the templating engine to use ejs    
app.set('view engine', 'ejs')
//setting the static files location to the public folder
app.use(express.static('public'))
//Using express urlencoded to enbale express to grab data from the form element by adding it to the request body property, setting the extended optoin to true to allow for object & array support
app.use(express.urlencoded({ extended: true }))
//this allows us to be able to use express
app.use(express.json())


//This is the GET request where we can read the items in the todo list
app.get('/', async (request, response)=>{
    //access the collection called todos from connected database and find all documents as an array which we will wait for because it is a promise, assign the documents to 'todoItems'
    const todoItems = await db.collection('todos').find().toArray()
    //access the collection called todos and count the documents that did match the property: this is anything that has not been completed, await this promise and assign it to itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //tell express to tell ejs to render index.ejs with this object -which ejs will make variables
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //exact same as the async await from above but this is a promis function with a call back function.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    //if there is an error during this process the console.log the error
    // .catch(error => console.error(error))
})

//using POST request (create) to add items in the todo list
app.post('/addTodo', (request, response) => {
    //selecting our collection here and indication that we are inserting one item (obj) with the key properties "thing" and complete, assigning the calues of te todoItem
    //(taken from the body of the the request) and the boolean is false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //once the previous command has bene executed and the new todo item has been added to the database it will return a success then run this code
    .then(result => {
        //a successful add will make a console log of 'todo added' to show it has been successful
        console.log('Todo Added')
        //return the use to the original webpage, this also acts as a refresh so that the user can see the updated post 
        response.redirect('/')
    })
    //if there is an error catch it and show the error in the console for debugging
    .catch(error => console.error(error))
})
//PUT request (update) to update one item in the todo list
app.put('/markComplete', (request, response) => {
    //selecting the todos collection of our db and updating one item(object: key = thing, value = intemfromJs)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //this is what I want to do to the mongo we are suing the mongo operator comand using $set and we set the completed property to true
        $set: {
            completed: true
          }
    },{
        //using the mongo sort method to sort by id. in desending order which will be ZYX alphebetical
        sort: {_id: -1},
        //setting the upsert (insert + update) mongo method to false (whcih is the default value)
        upsert: false
    })
    //when this promise is completed, we console.log "marked as completed and the same as json"
    .then(result => {
        //console log to show that it was successful
        console.log('Marked Complete')
        //show that is was successul
        response.json('Marked Complete')
    })
    //If there is an error somewhere in this process we will console.log the error so that we can figure out what the problem was.
    .catch(error => console.error(error))

})
//PUT request (update) to update one item in the todo list
app.put('/markUnComplete', (request, response) => {
    //selecting the todos collection of our db and updating one item (object: key= thing, value = itemsFrom Js)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
          //this is what I want to do to the mongo we are suing the mongo operator comand using $set and we set the completed property to false
        $set: {
            //change or ensure that the value for the key completed is set to false
            completed: false
          }
    },{
          //using the mongo sort method to sort by id. in desending order which will be ZYX alphebetical
        sort: {_id: -1},
         //setting the upsert (insert + update) mongo method to false (whcih is the default value)
        upsert: false
    })
    //if everything goes well and the update was successful, then do this
    .then(result => {
         //when this promise is completed, we console.log "marked as completed and the same as json"
        console.log('Marked Complete')
        //this shows that the promise was completed and the update was successful
        response.json('Marked Complete')
    })
    //if there are any errors, console.log them
    .catch(error => console.error(error))

})
//Delete handler at '/deleteItem' that deletes a todo document from the collection
app.delete('/deleteItem', (request, response) => {
    //access the todos collection and call the deleteOne method that will delete one document that matches the filter and has a property of the thing that equals itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //once the item has been removed/deleted from the database, and we get the response that it was completed
    .then(result => {
        //console.log that the item from the Todo has been deleted 
        console.log('Todo Deleted')
        //the delete was successful so this shows that
        response.json('Todo Deleted')
    })
    //if there are any errors in this process, console.log the errors
    .catch(error => console.error(error))

})

//listen to the port that we established in the variable or the port that is available in the hosting environment
app.listen(process.env.PORT || PORT, ()=>{
    //when this happens and the file is running console.log which port it is running on
    console.log(`Server running on port ${PORT}`)
})