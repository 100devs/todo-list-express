                    // activate Express framework:
const express = require('express')
                    // assign app variable to Express framework:
const app = express()
                    // activate Mongo database, and assign to MongoClient variable:
const MongoClient = require('mongodb').MongoClient
                    // assign port variable, to view app locally via localhost:
const PORT = 2121
                    // activate environment variable
require('dotenv').config()

                    // assign variables for Mongo database, connection to Mongo collection, and Mongo collection name:
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

                    // connect to the Mongo collection via dbConnectionStr variable and ensure formatting is configured correctly via useUnifiedTopology:
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
                    //     a promise function that returns confirmation of connection to Mongo collection AND assigns the Mongo database collection's documents to db variable:
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

                    // uses Express to connect the ejs file to the app:
app.set('view engine', 'ejs')
                    // lets Express know that the public folder has client-facing files:
app.use(express.static('public'))
                    // NOT SURE:
app.use(express.urlencoded({ extended: true }))
                    // activates json language with Express:
app.use(express.json())


                    // directs what files to retrieve/actions to make when user sends a request for the root file, via async function:
app.get('/',async (request, response)=>{
    
                    //     creates variable for retrieving the database collection documents in array format, when available via await:
    const todoItems = await db.collection('todos').find().toArray()
                    //     creates variable that returns the number of collection documents NOT marked completed, when available via await:
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
                    //     once the above variables' promise functions have completed, the ejs file is rendered with the functions' values included:
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
                    //     Not sure why the code through the next .catch(error...) are commented out. The database documents, in array format, are called:
    // db.collection('todos').find().toArray()
                    //     Once the database documents, in array format, are available, the individual documents that have NOT been completed are counted:
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
                    //     the documents that have NOT been completed are rendered in the index.ejs file:
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
                    //     If any errors occur during the app.get function, they are console.logged:
    // .catch(error => console.error(error))
})

                    // when user sends a request to add a ToDo item via the form on index.ejs file, the request is sent via the /addTodo path and handled by the below app.post function: 
app.post('/addTodo', (request, response) => {
                    //     the item is added to the Mongo database collection ('todos'):
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
                    //        after added, confirmation of the addition is console logged, and the ejs file is reloaded, via app.get:
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
                    //     any errors are console logged:
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
