const express = require('express') //adding express
const app = express()  //using app variable for express
const MongoClient = require('mongodb').MongoClient  //adding mongodb and assigning variable
const PORT = 2121    //port
require('dotenv').config()   //adding env file

//connecting to mongodb and asking for 'todo database name'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connect to mongodb and consoe.log connected to database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    

app.set('view engine', 'ejs') //using esc
app.use(express.static('public'))  //letting express know the public folder for js and css
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) //using json

//defines what to fetch on '/'
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //go to db> get todos>and covert to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //count number of items that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  //send the info to index.ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//defines the '/addTodo' action
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert the data to db with completed set to false
    .then(result => {
        console.log('Todo Added') //after dta is added, console log and redirect to '/', making another fetch
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//defines what happens when user marks a task as complete, updated the completed from falte to true
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

//defines the method to markk the task as incomplete. 
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

//deletes one item
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//listening to PORT 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})