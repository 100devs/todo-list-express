//Variable required for express
const express = require('express')
const app = express()
//Used to access mongodb
const MongoClient = require('mongodb').MongoClient\

//Local server port
const PORT = 2121
require('dotenv').config()

//Used to access mongodb
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Used to access mongodb
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
   
//Variable required for express
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//path that handles get requests sserver side
app.get('/',async (request, response)=>{
    //Find the document we are looking for and place them in an array and then in a variable
    const todoItems = await db.collection('todos').find().toArray()
    //Counts documents and stores in a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //Responds with index.ejs, document and how many are completed false.
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

//path that handles post requests server side
app.post('/addTodo', (request, response) => {
    //Inserts document into database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //Console logs confirmation
        console.log('Todo Added')
        //Refreash the page making a get request
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//path that handles post requests server side
app.put('/markComplete', (request, response) => {
    //Update document that matches the request text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //Once document is found change completed to true
            completed: true
          }
    },{
        //Sorty documents that match text
        sort: {_id: -1},
        //If document does not exist do not create a new one with the thing text we are searching
        upsert: false
    })
    .then(result => {
        //Console log complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//path that handles post requests server side
app.put('/markUnComplete', (request, response) => {
    //Update document that matches the request text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //Once document is found change completed to false
            completed: false
          }
    },{ //Sorty documents that match text 
        sort: {_id: -1},
        //If document does not exist do not create a new one with the thing text we are searching
        upsert: false
    })
    .then(result => {
        //Console log complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//path that handles delete on mmongodb
app.delete('/deleteItem', (request, response) => {
    //finds text in the todo database and deletes it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //Console log confirmation
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Listening on port for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})