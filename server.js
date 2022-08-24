const express = require('express') //allows for use of express in this file.
const app = express()//set const assigned to instance of express.
const MongoClient = require('mongodb').MongoClient//allows methods associated with MongoClient and to talk to our DB.
const PORT = 2121//const to define PORT location.
require('dotenv').config()//allows us to look for variables inside of the .env file.


let db,//declare a variable called db without an assigned value.
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our db connection string to it.
    dbName = 'todo'//declares variable dbName and assigns it the name of the db we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and passing in our connection string. also passing in an additional property.
    .then(client => {//waiting for connection and then passing in client information if successful.
        console.log(`Connected to ${dbName} Database`)//console log template literal.
        db = client.db(dbName)//assigning a value to previously declared db variable that contains a db client factory method.
    })//closing our .then

//middleware
app.set('view engine', 'ejs')//sets ejs as the default render method.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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