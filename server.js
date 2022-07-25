const express = require('express') // enables express module
const app = express()              // creates app variable to call express
const MongoClient = require('mongodb').MongoClient // enables mongoDB
const PORT = 2121 // configures port 2121 to be accessed
require('dotenv').config() // zero-dependency module that loads environment variables from a .env file into process.env.


let db, // db variable
    dbConnectionStr = process.env.DB_STRING, // variable your mongoDB change DB_STRING to your mongoDB URL
    dbName = 'todo' // name dbName variable to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects mongoDB
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // log that displays when mongoDB successfully connects
        db = client.db(dbName) 
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public')) // leons fav line this allows all files in the public folder to be accessed
app.use(express.urlencoded({ extended: true })) // he main objective of this method is to parse the incoming request with urlencoded payloads and is based upon the body-parser.
app.use(express.json()) // It parses incoming JSON requests and puts the parsed data in req


app.get('/',async (request, response)=>{ // get (read)
    const todoItems = await db.collection('todos').find().toArray() // read the objects in the array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // read the  objects that contain the false value for the completed property
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // displays the object in the index.ejs template
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // creates a todo object
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds the object in the db and set the completed property to the value of false
    .then(result => { // runs when object gets created
        console.log('Todo Added') // logs string "Todo added" indicating that new object was successfully created 
        response.redirect('/') // refreshes the page
    })
    .catch(error => console.error(error)) // error when object is not successfully created
})

app.put('/markComplete', (request, response) => { // update when marking a todo object as completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the request.body.itemFromJS property in the main.js
        $set: {
            completed: true // sets completed property to true
          }
    },{
        sort: {_id: -1}, // not sure removes from the /markComplete page?
        upsert: false // not sure sets upsert property to false so the object does not get re-added
    })
    .then(result => { // runs after object get the updated values
        console.log('Marked Complete')   // logs string "Marked Complete"
        response.json('Marked Complete')   // not sure 
    })
    .catch(error => console.error(error)) // error when object is not updated created

})

app.put('/markUnComplete', (request, response) => { // update when unmarking a completed a
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the request.body.itemFromJS property in the main.js
        $set: {
            completed: false // sets completed property to false
          }
    },{
        sort: {_id: -1}, // not sure removes from the /markUnComplete page?
        upsert: false // not sure sets upsert property to false so the object does not get re-added
    })
    .then(result => {
        console.log('Marked Complete') // logs string "Unmarked Complete"
        response.json('Marked Complete') // not sure
    })
    .catch(error => console.error(error)) // error when object is not updated created

})

app.delete('/deleteItem', (request, response) => { // deletes an object
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete from main.js body
    .then(result => {
        console.log('Todo Deleted')  // logs string "Todo Deleted" upon successfully delete
        response.json('Todo Deleted') // not sure
    })
    .catch(error => console.error(error)) // error when object is not delete

})

app.listen(process.env.PORT || PORT, ()=>{ // PORT is the variable or uses process.env.PORT from ,mongoDB
    console.log(`Server running on port ${PORT}`) // logs when port is successfully connected
})