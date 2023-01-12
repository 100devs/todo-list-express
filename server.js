const express = require('express')              //using express and storing it in the variable express
const app = express()                           //using express function inside the variable ap
const MongoClient = require('mongodb').MongoClient         //using mongo by importing to the variable MongoClient
const PORT = 2121                                       //setting a custom port 2121
require('dotenv').config()                  //importing dotenv module for using environment variables


let db,
    dbConnectionStr = process.env.DB_STRING,                //  dbconnectionStr is the variable that contains the mongoconnectionstring, dbname stores the db name
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)              //conection to mongo is established
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')           //setting ejs as the view engine for rendering the views
app.use(express.static('public'))       //setting the public folder for serving static files
app.use(express.urlencoded({ extended: true }))
app.use(express.json())                                             //using express methods for various body parsing functionality


app.get('/',async (request, response)=>{                                            //listens for the / route with request type GET, used for showing main app 
    const todoItems = await db.collection('todos').find().toArray()             //stores all the documents from the todos collection in the format of an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})       //stores the count of documents with the condition of completed as false, it is used to display unfinished tasks in the app
    response.render('index.ejs', { items: todoItems, left: itemsLeft })         //respond back by rendering index.ejs, documents along with the count of documents is passed along to render and respond
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {          //listens for the /addTodo route with request type POST, used for adding a document to the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  //adds a document to the todos collection whose content is taken from the request (FROM FORM), hard coded value of completed as false as new tasks are initially incomplete
    .then(result => {           //once the promise is resolved
        console.log('Todo Added')
        response.redirect('/')                  //responds back by redirecting to the home route, there by initiating a get request
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {     //listens for the /addTodo route with request type PUT (Update), used to change the task from incomplete to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update documents whose name is taken from the request, and set its property of completed to be true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false       
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')  //respond by sending back a json, a response should be sent and client side js is waiting for it 
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {  //exact same function but just used to do the opposit of markcomplete.
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

app.delete('/deleteItem', (request, response) => {          //listens for the /deleteItem route with request type DELETE, used to delete a particular document from the collection whose name matches from the request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //listens to port hardcoded of port from env variable
    console.log(`Server running on port ${PORT}`)
})