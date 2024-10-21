//imports express
const express = require('express')
//express assigned to app
const app = express()
//import mongo db connections
const MongoClient = require('mongodb').MongoClient
//where our app listens hard coded port
const PORT = 2121
//environment variables
require('dotenv').config()

//db information
let db,
    //connection string comes from environment
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Cluster2'

//promise to connect to db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//middleware

//setting view to ejs
app.set('view engine', 'ejs')
//routes static folder
app.use(express.static('public'))
//so express can access information from the form
app.use(express.urlencoded({ extended: true }))
//express can parse and understand json
app.use(express.json())


//tell server to listen on the root route and then asynchronously waits to get a response from mongo
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

//on the route to addtodo request body is inserting one item and then consoles and refreshs to root
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//update goes to db to update a item to completed and sort and upsert into descending order
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},//descending order
        upsert: false//no matches -> make one
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//update to not complete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false//to uncheck an item
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

//delete one item from request body
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//where our app listens
app.listen(process.env.PORT || PORT /*uses environment port or will use hardcoded port*/, ()=>{
    console.log(`Server running on port ${PORT}`)
})