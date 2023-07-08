const express = require('express') //Express is installed and initialized
const app = express() //express is stored to use.
const MongoClient = require('mongodb').MongoClient //MongoDB is installed and initialized
const PORT = 2121 //Port # created (this server is listening on localhost:2121
require('dotenv').config() //dotenv file is read from. This contains sensitive information, most likely about the MongoDB client like password and user to link MongoDB database to the program


let db,
    dbConnectionStr = process.env.DB_STRING, //Explained above., just declared here. 
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //the server is connected to the MongoDB database using the hidden ENV files and variables stored there (dbConnectionStr and dbName).
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//all of this is middleware
app.set('view engine', 'ejs') //EJS view engine set to write content from server to DOM.
app.use(express.static('public')) //serves a static file to the server from 'public' (folder) to use.
app.use(express.urlencoded({ extended: true })) //urelencoded allows for the grabbing of the URL to find what it's looking for. Ex. https://blahblah.com/images. I only need to hear the endpoint of /images, not the
                                                // full URL, this is what urlencoded does, it grabs the "code" from the URL.
app.use(express.json()) // allows for parsing of JSON data to the request body. 


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //This sets the todoItems ul in index.ejs to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //This sets the items in todoItems which are not completed to an array of itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the todoItems and itemsLeft to the DOM in index.ejs. Changes todoItems to items and itemsLeft to left. (all are arrays)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Explained in main.js, adds a to-do item which is NOT completed to the todoItems ul.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //Explained in main.js, adds class of "completed" to an item in the todoItems ul in index.ejs.
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

app.put('/markUnComplete', (request, response) => { //Explained in main.js, removes class of "completed" from to-do list item in todoItems ul in index.ejs
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

app.delete('/deleteItem', (request, response) => { //Explained in main.js, removes to-do list item from to-do list (todoItems ul in index.ejs).
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //creates the server and makes it listen on port 2121
    console.log(`Server running on port ${PORT}`)
})
