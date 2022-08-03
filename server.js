const express = require('express') // use Express, create HTTP server, built-in Express
const app = express() //create Express application
const MongoClient = require('mongodb').MongoClient //connect MongoDB to Node.js
const PORT = 2121 //declare local port, where server will run - app will run on http://localhost:2121/
require('dotenv').config() //load dontenv and call config method. dotenv loads environment variables and store config separate from code


let db, //declare variable db
    dbConnectionStr = process.env.DB_STRING, //assign system environment (.env) with mongoDB path
    dbName = 'todo' // declare and assign value 'todo' to dbName variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create MongoDB connection to .env file, add connection string as argument
    .then(client => {//wait until there is a connection, then pass client output
        console.log(`Connected to ${dbName} Database`) //print a template with linked DB name 'Connected to todo Database'
        db = client.db(dbName) //assign database name value to db var
    })
    
app.set('view engine', 'ejs') //set view engine as ejs for rendering
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