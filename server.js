// import express module and assigns it to a variable
const express = require('express')
//declare a variable to hold express function
const app = express()
//import mongodb module. .MongoClient is a new connection class since version 1.2 and assigns it to a variable
const MongoClient = require('mongodb').MongoClient
//assigns port to 2121
const PORT = 2121
//imports dotenv module
require('dotenv').config()

//intilizes db variable
let db,
    //intializes variable and assigns it from a secret file
    dbConnectionStr = process.env.DB_STRING,
    //intilizes variable and assigns it to db name
    dbName = 'todo'
//connects to mongodb by passing in the dbConnectionsStr. 
//unifiedtopology : DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //when connected 
    .then(client => {
        //display dbname to console
        console.log(`Connected to ${dbName} Database`)
        //assigns db variable to connection object and db client factory method 
        db = client.db(dbName)
    //closes promise
    })
//sets up use of ejs    
app.set('view engine', 'ejs')
//sets up middleware to create public folder that allows easy access to static files
app.use(express.static('public'))
//sets up middleware that allows put and post requests inbound array and string data to be parsed
app.use(express.urlencoded({ extended: true }))
//sets up middleware that allows put and post requests inbound JSON data to be parsed
app.use(express.json())

//sets get request for home route '/'
app.get('/',async (request, response)=>{
    // fetches array of data from todos database collection
    const todoItems = await db.collection('todos').find().toArray()
    //stores the number of documents in database that have the completed key of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //send fetch response along with items and left object to be rendered in the index file
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //COMMENTED OUT SECTION USES PROMISES INSTEAD OF ASYNC/AWAIT
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
//closes get request
})
//calls post request from /addtodo route
app.post('/addTodo', (request, response) => {
    //find database collection todos and insert two key: value pairs. A thing with a value from the request body with the name of todoItem and the key of completed with the value of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //when connected and inserted
    .then(result => {
        //display 'todo added' to console
        console.log('Todo Added')
        //call the get request on the home route
        response.redirect('/')
    //close promise
    })
    //if error display error to the console
    .catch(error => console.error(error))
//close post request
})
//creates put request on the /markComplete route
app.put('/markComplete', (request, response) => {
    // connect to database todos and use updateOne method 
    //first parameter sets what document to update. if empty picks first document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //addFields aka set adds new field to the object
        $set: {
            //change/set completed value to true
            completed: true
          //close set object
          }
    //update this object with...
    },{
        //...the sort operator. it modifies the $push operator to reorder documents stored in the array. _id:-1 means in descending order
        sort: {_id: -1},
        //if value doesn't exist don't add it
        upsert: false
    //end update operators and updateOne method
    })
    //when the put request responds from the database put the response in result
    .then(result => {
        // display marked complete to the console
        console.log('Marked Complete')
        //send response back to caller
        response.json('Marked Complete')
    //close promise
    })
    //if update fails display error to console
    .catch(error => console.error(error))
//end put request
})
//creates put request on the /markUncomplete route
app.put('/markUnComplete', (request, response) => {
    // connect to database todos and use updateOne method 
    //first parameter sets what document to update. if empty picks first document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //addFields aka set adds new field to the object
        $set: {
            //change/set completed value to false
            completed: false
          //close set object
          }
    //update this object with...
    },{
        //...the sort operator. it modifies the $push operator to reorder documents stored in the array. _id:-1 means in descending order
        sort: {_id: -1},
        //if value doesn't exist don't add it
        upsert: false
    //end update operators and updateOne method
    })
    //when the put request responds from the database put the response in result
    .then(result => {
        // display marked complete to the console
        console.log('Marked Complete')
        //send response back to caller
        response.json('Marked Complete')
    //close promise
    })
    //if update fails display error to console
    .catch(error => console.error(error))
//end put request
})
//creates delete request on the /deleteItem route
app.delete('/deleteItem', (request, response) => {
    //connects to database and preforms the deleteOne method on thing: request.body.itemFromJS object
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //when delete request responds from the database put response in result variable
    .then(result => {
        //then log 'todo completed' to the console
        console.log('Todo Deleted')
        //then send the response 'todo deleted' in JSON to the caller
        response.json('Todo Deleted')
    //end promise
    })
    //if there is an error while deleteing from the database log error to the console
    .catch(error => console.error(error))
//end delete request
})
//open a server on secret hidden port or if it cant be found regular port
app.listen(process.env.PORT || PORT, ()=>{
    //when server is running log which port to the console
    console.log(`Server running on port ${PORT}`)
//close listen request
})