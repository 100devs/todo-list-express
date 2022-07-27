const express = require('express') // requiring express package that we installed
const app = express() // initializing teh package so we can use it
const MongoClient = require('mongodb').MongoClient // requiring the MongoDB and client in the variable so we can access it
const PORT = 2121 // PORT runs here (which is compatible with heroku)
require('dotenv').config()  // holds secret thinies like variable keys (need to put them in herokui as variables)


let db, // shorten up variables so less typing (empty)
    dbConnectionStr = process.env.DB_STRING,  // look here for the environmental variable connection string
    dbName = 'todo' // variable assignment

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to the database using string above
    // unifiedTopology - opt in for a new verison of MongoDB connection (stays active), better performance
    .then(client => {  // after connecting then do: (function)
        console.log(`Connected to ${dbName} Database`) // let us know we connected correctly
        db = client.db(dbName)  // assign the db variable from line 8
    })
    
app.set('view engine', 'ejs')  // set the options for the express app we assigned earlier
app.use(express.static('public'))  //  middleware - look in the public folder for roues we call up later; comes between the request and response
app.use(express.urlencoded({ extended: true })) // settings
app.use(express.json()) // more settings


app.get('/',async (request, response)=>{  // client requests the 'route' page ->  we send back these or errors 
    const todoItems = await db.collection('todos').find().toArray()  // wait for the database to reply; convert the documents from database into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // wait for the database to reply; grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  // show us the goods
    // db.collection('todos').find().toArray() -> find the todos, put in array only one connection here then filter them
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})  -> find the number of not completed tasks
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))  -> if we hit an error let us know (second half of the try/ catch)
})

app.post('/addTodo', (request, response) => {  // update from the CRUD or create
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // add a new item or todo list on database; insert in the body of the todoItem and automatically set it to false for completed 
    .then(result => {
        console.log('Todo Added') // let us know that we successfully added todo
        response.redirect('/')  // go back to the route screen/ homepage
    })
    .catch(error => console.error(error)) //uh oh we got an error here you go
})

app.put('/markComplete', (request, response) => { // update some parts of the documents on our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // change the todo
        $set: {
            completed: true // mark it as complete
          }
    },{
        sort: {_id: -1},  // sort by id: descending biggest to the smallest so it ends up last
        upsert: false  // update + insert
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