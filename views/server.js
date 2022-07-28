const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

/*
Create variables for database, database name, and connection string.
The connection string is read from a hidden file in the directory with 
the variable name of DB_STRING.
*/
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/*
Initialize a connection to the database.
Assign the returned database object to the db variable.
*/

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

/*
Middleware for using ejs, reading json, and reading files from a 
folder called public.
*/
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/*
READ the root of the page.
Get the items from the todos db collection and covert it to an array.
Get the count of documents that match the property completed: false
*/

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

/*
CREATE an object in the todos collection.
Properties are thing with the value from the form and 
completed which is false.
Once that is done refresh page back to root.
*/

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

/*
UPDATE an item
*/

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
/*
UPDATE the todos collectiomn by using an update method and changing
the completed property to false.
*/
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

/*
DELETE an item from the todos collection by using the deleteOne method and
passing the object from the request as the argument. Logs a string if the 
delete is successful.
*/
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

/*
Open and listen to the port stated in the .env file 
with the variable of PORT if it exists or the port declared in the 
PORT variable in this file.
*/
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
