//requires express
const express = require('express')
//app = express function
const app = express()
//requires the mongodb mongoclient
const MongoClient = require('mongodb').MongoClient
//sets port to 2121
const PORT = 2121
//requires configured dotenv
require('dotenv').config()

//identifies db
let db,
//sets dbconnectionstr to process.env.DB_String
    dbConnectionStr = process.env.DB_STRING,
//sets dbname to todo
    dbName = 'todo'
//mongoclient.connect function with dbconnection str and useunified topology set to true, as the values
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//client function
    .then(client => {
//logs connected to database
        console.log(`Connected to ${dbName} Database`)
    //db is set to client.db(dbname)
        db = client.db(dbName)
    })
//app is set to view engine and ejs
app.set('view engine', 'ejs')
//the app has access to the public folder using express
app.use(express.static('public'))
//apps urlencoded extended is set to true using express
app.use(express.urlencoded({ extended: true }))
///app usees expres.json
app.use(express.json())

//load / and wait for req and res
app.get('/',async (request, response)=>{
//set todoitems to db.collection('todos').find().toArray() when it loads
    const todoItems = await db.collection('todos').find().toArray()
//set itemsleft to db.collection('todos').countDocuments({completed: false}) when it loads
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
//render index.ejs and set items to todoitems and set left to itemsleft
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
    //adds item to todos list, sets completed to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //logs todo added
        console.log('Todo Added')
        //redirects to '/'
        response.redirect('/')
    })
    //catches and logs error
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    //updates item from todos list with itemfromjs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //logs marked complete
        console.log('Marked Complete')
        //responds with marked complete json
        response.json('Marked Complete')
    })
    //catches and logs errors
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
//updates the todos list with itemfromjs
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //logs marked complete
        console.log('Marked Complete')
    //responds with marked complete json
        response.json('Marked Complete')
    })
    //catches and logs error
    .catch(error => console.error(error))

})
//delete 
app.delete('/deleteItem', (request, response) => {
    //deletes itemfromjs 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
    //lopg todo deleted
        console.log('Todo Deleted')
//respond todo deleted in json
        response.json('Todo Deleted')
    })
    // catch error and log the error
    .catch(error => console.error(error))

})
//listen for process.env.PORT or PORT
app.listen(process.env.PORT || PORT, ()=>{
//log server running on port ...
    console.log(`Server running on port ${PORT}`)
})