const express = require('express') //allows express to be used
//assigns app variable to express
const app = express()
const MongoClient = require('mongodb').MongoClient
//assigns port variable for port being used
const PORT = 2120
//dotenv - a zero-dependency module that loads env variables from the .env file
//make sure to install locally: npm install dotenv --save
require('dotenv').config()

//below we assign 3 different variables using one let. db has no value yet.
let db,
    dbConnectionStr = process.env.DB_STRING, //DB_string is being pulled from .env file and assigned to 'dbConnectionStr'
    dbName = 'todo' //assigning 'todo' to dbName - the name of our database

//below: MongoClient variable to use mongodb.. ".connect" is to connect to db. (dbConnectionStr..)is our declared variable above. takes in the DB_string from our env file.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

console.log(db)
//allows us render web pages using template files. So below we are setting the view engine to EJS 
app.set('view engine', 'ejs')
app.use(express.static('public')) //this adds middleware for serving static files to your express app; makes it possible to access files from this folder via http. Public is where we are storing our style.css and js files.
app.use(express.urlencoded({ extended: true })) //a bit complicated but from what i gather, extended true allows us to parse nested JSON like objects and arrays.
app.use(express.json())//used to recognize incoming Request Objects as JSON Objects


app.get('/',async (request, response)=>{
    //const todoItems = await db.collection('todos').find().toArray()//assigning a variable that 
    //const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
         db.collection('todos').countDocuments({completed: false})
         .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
         })
     })
     .catch(error => console.error(error))
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