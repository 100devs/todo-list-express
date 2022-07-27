const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
//dependencies needed 

//mongoDB your ps and the name of the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


// connects MongoDB with your ps and the database name
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //the middleware ; a command for what you use to communicate with the database
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//on page load request we will response with todoItems and itemsLeft (explained in 2 lines below)
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //goes into database of named 'todo' and finds it and turns that into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //goes into database of 'todo' (i named it in Mongo) and counts how many documents are in the collections array. if there are any still present then it is false ; (because it is not completed); database - room ; collection - box ; document - item inside the box
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //the response would be at index.ejs we will get the above to show on the DOM (todoItems and itemsLeft) (under the appropriate name in index.ejs in this case items and left)

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//create (post)
app.post('/addTodo', (request, response) => { //on page addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //we will insert one 'thing' which is an todoItem. and if we add a thing then the completed will be false
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//update (put)
app.put('/markComplete', (request, response) => {  //on page markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //when complete is true and no more on left list
          }
    },{
        sort: {_id: -1}, //sorts in decesding order based on id number (MongoDB assigns id on the database so once it goes to completed it will be on the descending order based on the MongoDB id)
        upsert: false //default is false ; when true creates a new document when no document does not match query
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//on page markUncomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //gets item from index.ejs form (where you add items) and puts it in the database collection
        $set: {
            completed: false //list not completed
          }
    },{
        sort: {_id: -1}, //sorts in decesding order based on id number (MongoDB assigns id on the database so once it goes to completed it will be on the descending order based on the MongoDB id)
        upsert: false //default is false ; when true creates a new document when no document does not match query
    })
    .then(result => {
        console.log('Marked unComplete')
        response.json('Marked unComplete')
    })
    .catch(error => console.error(error))

})

//on page deleteItem
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //goes to the database of 'todo' and deletes what is on the form
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//port we are using wither our choosing or Heroku choosing
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})