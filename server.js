const express = require('express')//makes sure express is installed
const app = express()
const MongoClient = require('mongodb').MongoClient //requiring mongoclient and mongodb
const PORT = 2121 // set the server port to 2121
require('dotenv').config()//requring our env file 


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //lego brick ^!!
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //got the todo items from the database and put into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sending data to the index.ejs file, passing the array into "items"
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // /addTodo comes from action on form that makes the post request, starts post.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //find the todo collection on mongodb and we simply insert an "object" into the db with our specified property with the name of thing
    .then(result => { //
        console.log('Todo Added') //console logs "Todo Added"
        response.redirect('/') // refreshes the page
    })
    .catch(error => console.error(error)) //console logs error if error occurs
})

app.put('/markComplete', (request, response) => { //start put method
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//update the db collection of todos with the itemFromJS
        $set: {
            completed: true //sets completed in the db to true
          }
    },{
        sort: {_id: -1},
        upsert: false //if true, it will update the document for you if it cannot find what you are trying to update. for ex. get duck
    })
    .then(result => {
        console.log('Marked Complete') //console logs Marked Complete
        response.json('Marked Complete') //responds with json Marked Complete
    })
    .catch(error => console.error(error))

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