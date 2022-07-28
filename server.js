const express = require('express')
// declare the express dependency. 
const app = express()
// assigning app to express module. 
const MongoClient = require('mongodb').MongoClient
// requiring and assigning mongodb package the MongoClient variable.
const PORT = 2121
// Assign the local host port number to run the code. 
require('dotenv').config()
// the require method that hides the db string and other things that we do not want to show. 


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// declare variables that we will use later. It represents the database. 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// we are connecting to the mongodb database. 
    .then(client => {
        // We are waiting for the promise to resolve and then it's returning that we are connected to the database. 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        // client contains all the db credentials and once you are in there, it looks for the todo database that contains collections. 
    })

// middleware
app.set('view engine', 'ejs')
// allows use of ejs
app.use(express.static('public'))
// tells express to look into public folder to find the files for css, main.js
app.use(express.urlencoded({ extended: true }))
// makes handeling urls easier. 
app.use(express.json())
// return responses in json. 


app.get('/',async (request, response)=>{
    // Looking in the root file, it is the read part of CRUD. It is the request as a root, and it's asking for a callback. 
    const todoItems = await db.collection('todos').find().toArray()
    // going into the todos collection, and grabbing everhthing, and putting it into an array so that we can access it later. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Going through the items in the collections and it will count the documents in the collection that are not completed. it's adding it to the count.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // rendering the return data in the index.ejs file. 

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
    // the post method reads the /addTodo path to call the above function which is promise based. 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // taking the item the user has entered into the index.ejs as a request, then adding the item to the database. 
    .then(result => {
        console.log('Todo Added')
        // responding that the item has been added. 
        response.redirect('/')
        // refreshing the page and saying that the item has been added. 
    })
    .catch(error => console.error(error))
    // catches the error. 
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // we take the itemtext from the main.js and set that to not completed. 
        $set: {
            completed: true
          }
        // The user can change the item to completed is true. 
    },{
        sort: {_id: -1},
        // Sorting everything in collection by id. 
        upsert: false
        // not upserting. 
    })
    .then(result => {
        console.log('Marked Complete')
        // This will come through the terminal
        response.json('Marked Complete')
        // the client will see the reponse.json. 
    })
    .catch(error => console.error(error))
    // Seeing the errors that we find. 

})

app.put('/markUnComplete', (request, response) => {
    // this is the path the server will take. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // take the client request, and update it from the database. 
        $set: {
            completed: false
          }
        // setting the completed document in the database to false. 
    },{
        sort: {_id: -1},
        upsert: false
        // sort by id, maybe by the most recent. 
    })
    .then(result => {
        console.log('Marked Not Complete')
        // shows up as not complete in terminal. 
        response.json('Marked Not Complete')
        // shows up as not complete on client side. 
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // delete the json object that was requested from the main.js and then finds it in the database. 
    .then(result => {
        console.log('Todo Deleted')
        // This sends message in terminal that it was deleted. 
        response.json('Todo Deleted')
        // This sends message to client that it was deleted. 
    })
    .catch(error => console.error(error))
    // this is an error. 

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})