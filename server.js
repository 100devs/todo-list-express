const express = require('express') //require is used to load different modules, express to use express
const app = express() // changing it to app to make it more readable
const MongoClient = require('mongodb').MongoClient //mogoclient to connect to db
const PORT = 2121 // our port
require('dotenv').config() // environemnt file


let db,
    dbConnectionStr = process.env.DB_STRING, //used to get the user environment and the dnstring in the env file
    dbName = 'todo' //dbname set to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // get dbconnectionstr from env and place it here
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // if succesful log this message
        db = client.db(dbName) // client is the client that is connected to the databse, .db is the interface to interact with the collection that is dbname and db variable holds the reference to the database
    })
    
app.set('view engine', 'ejs') // setting our view engine as ejs
app.use(express.static('public')) // setting public folder for static files
app.use(express.urlencoded({ extended: true })) // only parses {urlencoded} bodies and only looks at requests where the Content-Type header matches the type option. 
app.use(express.json()) //parses incoming json into object


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //fids all the documents in the cllection and puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counter for all flase comoleted items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the ejs file with data from db
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
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // post inserts one document in the collection  
    .then(result => {
        console.log('Todo Added') // if succesful logs
        response.redirect('/') // then refreshes and initiates a get request
    })
    .catch(error => console.error(error)) //  error if error
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //put or update items  by getting it from request.body
        $set: {
            completed: true // changes true from false
          }
    },{
        sort: {_id: -1}, // sorts in ascending 
        upsert: false // if item doesnt exist adds it to the doc
    })
    .then(result => {
        console.log('Marked Complete') // if succesfful log
        response.json('Marked Complete') // resolves the body text as json
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into db and updates one docu
        $set: {
            completed: false // changes the boolean
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
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete request to remove one docu from collection
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})