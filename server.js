// Tell the app what we need in order to work.
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//init database 
let db,
    dbConnectionStr = process.env.DB_STRING, //This means our DB_STRING is stored in our .env file and this is how we use it outside that file
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Connects to mongodb via mongoclient
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Tells express to use different components
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{ //What the server responds with if you go to 'start' of the url.
    const todoItems = await db.collection('todos').find().toArray() //finds all documents from the todos collection and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts all the documents in todos collection where completed is set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //What the server sends back to the client.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //app.post means we want to create something. In this case a new todo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //specify the collection, and that we want to insert something. 
    .then(result => {
        console.log('Todo Added')//log to see if we get here
        response.redirect('/')//reloads the page
    })
    .catch(error => console.error(error))//logs any errors if we get them
})

app.put('/markComplete', (request, response) => {//app.put means we want to update something. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//specify which object to update
        $set: {
            completed: true
          }                         //the update
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')//log for us
        response.json('Marked Complete')//reponse to the client
    })
    .catch(error => console.error(error))//logs any errors if we get them

})

app.put('/markUnComplete', (request, response) => {//app.put means we want to update something. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//specify which object to update
        $set: {
            completed: false
          }                     //the update
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')//log for us
        response.json('Marked Complete')//reponse to the client
    })
    .catch(error => console.error(error))//logs any errors if we get them

})

app.delete('/deleteItem', (request, response) => {//app.delete means we want to delete something
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//tell the database that we want to delete one item
    .then(result => {
        console.log('Todo Deleted')//log for us
        response.json('Todo Deleted')//reponse to the client
    })
    .catch(error => console.error(error))//logs any errors if we get them

})

app.listen(process.env.PORT || PORT, ()=>{ //tell the server to listen on the PORT from .env(heroku) or from the PORT in this file
    console.log(`Server running on port ${PORT}`)
})