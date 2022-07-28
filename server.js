const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
/**
 getting express and MongoClient, as well as the port number where we would run our server locally.

 Express lets us have the nice handlers for put, delete, and get/read requests.

 MongoClient lets us connect to the database we made or someone elese made on there(that info directly below).
 */

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    //the above let is supposed to be setting up the info for the database. The main name, then the sub(folder) things underneath the main one. This is what we would be connecting to. Don't think Leon included that info though, so right now we'd have to do that ourselves to get the app to work.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/**
 app.set sets where our view will be in this case

    app.use is used to set up middleware, magic that helps our app work smoother. 
 */


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
//this is the default load page of the app. It will load the index.ejs file.

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

/**
 our app.put is mainly using $set to update the completed property of the item.

 Somehow I think all that data is always linked to the resquest.body.itemFromJS....
 */

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
/**
 itemFromJS is just something set in the main.js function that is passed to the server.js file for the handler call. Is just the content from that todoItem such as the description text. That is what we look for when doing the .deteleOne() call. 

 We know it is the right delete one call since we are looking for an item with those direct values passed through the request.body.itemFromJS.
 */

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

//package.json: this is the page/file that helps npm know what to install
/*
server.js: this is the file that runs the server
main.js: this is the file that runs the client side
gitignore: this is the file that tells git to ignore certain files
index.ejs: this is the file that tells the server what to render.
*/