const express = require('express') //import express
const app = express() //define to use express
const MongoClient = require('mongodb').MongoClient 
const PORT = 2121 //Port to use in accessing server (locally or if no other port given)
require('dotenv').config() //use doten for storing env and loading environmental variables


let db,//initializing db variable
    dbConnectionStr = process.env.DB_STRING, //initializing variable to connection string
    dbName = 'todo' //initializing variable dbName to "todo"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connecting to database (mongodb)
    .then(client => {//with a successfull connection do something
        console.log(`Connected to ${dbName} Database`) //console logs when successfully connected
        db = client.db(dbName)//reinitializing variable db to "client.db(dbName)"
    })//closing .then
    
app.set('view engine', 'ejs')//setting templating language to ejs (render method)
app.use(express.static('public'))//static asset location
app.use(express.urlencoded({ extended: true }))//express decode and encode URL
app.use(express.json())//with incoming requests parses json


app.get('/',async (request, response)=>{//get async for "/" path
    const todoItems = await db.collection('todos').find().toArray() //initializing todoItems to response of async await function as a array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //initializing itemsLeft to get incomplete todos
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//render the previously initilized variables
    // db.collection('todos').find().toArray() //same as above but uses callbacks instead of async await (slower than above code "callback hell")
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))//cathcing errors in the above commented code
})

app.post('/addTodo', (request, response) => { //Post request to database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//add one item to database collection
    .then(result => {// on successful insertion do following
        console.log('Todo Added')//logs "todo added" if executed
        response.redirect('/')//redirect to rerender
    })//close .then
    .catch(error => console.error(error))//catch in the event of errors
})//close post

app.put('/markComplete', (request, response) => {//put request on "/markComplete"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update one item in database
        $set: {//setting items status to completed
            completed: true
          }
    },{
        sort: {_id: -1},//sorting items in database to the end
        upsert: false //if there is no item that equals request do not allow insertion to database
    })//close updateOne
    .then(result => {//if successful then execute following code
        console.log('Marked Complete')//console.log "Marked Complete"
        response.json('Marked Complete')//respond back to the request
    })//close .then
    .catch(error => console.error(error))//catch any errors

})//clost put

app.put('/markUnComplete', (request, response) => { //Put request for "/markUnComplete"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update a single item
        $set: {//setting item status to not complete
            completed: false
          }
    },{
        sort: {_id: -1},//sorting items in database to the end
        upsert: false //if there is no item that equals request do not allow insertion to database
    })//close update one
    .then(result => {//if successful then execute following code
        console.log('Marked Complete')//console.log "Marked Complete"
        response.json('Marked Complete')//respond back to the request
    })//close then
    .catch(error => console.error(error))//catch any errors

})//close put

app.delete('/deleteItem', (request, response) => {//delete method for "/deleteItem"
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete a single item in database
    .then(result => {//if successful then execute following code
        console.log('Todo Deleted')//console.log "Todo Deleted"
        response.json('Todo Deleted')//respond back to the request
    })//close .then 
    .catch(error => console.error(error))//catch any errors

})//close delete method

app.listen(process.env.PORT || PORT, ()=>{//setting up port where the server is listening on. if given port use that one (if available "truthy") else use given PORT variable
    console.log(`Server running on port ${PORT}`)//console.log where the server is running
})//close listen method