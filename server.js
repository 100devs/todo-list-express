const express = require('express') //requiring express so we can use express methods
const app = express() //setting variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //mongoclient allows us to talk to mongodb
const PORT = 2121 //setting location where server is listening 
require('dotenv').config() //allows use to access vars inside env file


let db,//declaring a var globally 
    dbConnectionStr = process.env.DB_STRING,//declaring a var, assigning db connection string to it
    dbName = 'todo'//declaring a var, setting name of db we want to access

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//create connnection to mongodb, passing in connection string and addtnl property
    .then(client => {//waiting for connection, proceeding if successful
        console.log(`Connected to ${dbName} Database`)//logging confirmed connection to console
        db = client.db(dbName)//assigning value to prev declared db var that contains db client factory mehtod
    })//closing then 
    
//middleware, helps communication for our requests
app.set('view engine', 'ejs')//set ejs to default render
app.use(express.static('public'))//sets location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode urls where header matches content
app.use(express.json())//parse json content 

app.get('/',async (request, response)=>{ //start GET method when rootroute is passed in, set up req/res params
    const todoItems = await db.collection('todos').find().toArray() //sets var, awaits ALL items from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets var, awaits count of items that have not been completed to later display in EJS 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering index.ejs, passing object in that contains todo items and items left
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts post method when add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//insert new item into todos collection, completed is false bc we don't want it to be crossed off
    .then(result => {//ifinsert successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//redirecting to home
    })//close .then
    .catch(error => console.error(error))//catch error 
})//ending post 

app.put('/markComplete', (request, response) => {//starts put method when markcomplee route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in db for one item matching name passed in from main.js file that was clicked on 
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item doesnt already exist
    })
    .then(result => {//starts a then if update was successful  
        console.log('Marked Complete')//logging succesful completion
        response.json('Marked Complete')//sending response back to sender
    })//close then
    .catch(error => console.error(error))//catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starts put method when markuncomplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in db for one item matching name passed in from main.js file that was clicked on 
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false//prevents insertion if item doesnt already exist
    })
    .then(result => {//starts a then if update was successful  
        console.log('Marked Complete')//logging succesful completion
        response.json('Marked Complete')//sending response back to sender
    })//closing then 
    .catch(error => console.error(error))//catching errors

})//ending put

app.delete('/deleteItem', (request, response) => {//starts delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside todos collection for one item that has matching name from our JS file
    .then(result => {//if successful, starts then
        console.log('Todo Deleted')//logging succesful completion
        response.json('Todo Deleted')//sending response back to sender
    })
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//setting up which port listening on 
    console.log(`Server running on port ${PORT}`)//console log running port
})//end listen