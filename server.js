// this is the main express file "server.js" where all the heavy lifitng happens

const express = require('express')  // for using express magic 
const app = express()       // for using express magic 
const MongoClient = require('mongodb').MongoClient  // for using Mongo
const PORT = 2121                 // using port 2121 on local host 
require('dotenv').config()      // to use env variables


let db,
    dbConnectionStr = process.env.DB_STRING,      // using env to enable heroku to use the required port 
    dbName = 'todo'                                 // name of the data base on mongo db

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })     // this is for initializing & connecting to mongo atlas db
    .then(client => {
        console.log(`Connected to ${dbName} Database`)                  // will log the port # (2121 on local , some other value on heroku
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')                                           // to use ejs 
app.use(express.static('public'))                                       // public folder where all the files used (style.css, main.js * any other file) will reside
app.use(express.urlencoded({ extended: true }))                         
app.use(express.json())                                                 


app.get('/',async (request, response)=>{                                                   // the homepage or main route (/)
    const todoItems = await db.collection('todos').find().toArray()                         // loads the db items on to an Array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                     // ejs process it to feed to the html
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {                                                     // the post or Create function that adds things to the todolist
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})               // the insertOne() fucntion goes through the db and inserts the item specified in the DOM "request.body.todoItem"
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {                                                   // the put or update command that updates the status of todo item whether compeleted or not
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{                                  // the updateOne() fucntion goes through the db and updates the item specified in the DOM "request.body.itemFromJS"
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

app.put('/markUnComplete', (request, response) => {                                                     // the put or update command that marks the status of the item as un complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{                                   // the updateOne() fucntion goes through the db and updates the item specified in the DOM "request.body.itemFromJS" 
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

app.delete('/deleteItem', (request, response) => {                                                  // the delete function that deletes the item from the todo list
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})                              // deleteOne() function goes through the db and looks for the item specified in the DOM "request.body.itemFromJS" & deletes it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{                                                      // the listemn fucntion that listens to the user activity on the site, like clicks etc..
    console.log(`Server running on port ${PORT}`)
})
