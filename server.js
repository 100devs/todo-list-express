// requiring  dependencies
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')  // use ejs for rendering
app.use(express.static('public')) // give express access to public file
app.use(express.urlencoded({ extended: true })) // enable express to parse form data
app.use(express.json()) // enable express json parser


app.get('/',async (request, response)=>{  // request home page
    const todoItems = await db.collection('todos').find().toArray() // finding  collection todo  and turn it into array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //  counting  uncompleted tasks 
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

app.post('/addTodo', (request, response) => {  // post request to  /addTodo  
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // insert one  task to the database
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')  // redirecting to home page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // put request to  path /markCompleted to mark the task as completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // update the referenced property 
        $set: {  
            completed: true  // set the task as completed
          }
    },{
        sort: {_id: -1}, //  sort the tasks by id from bigger to smaller
        upsert: flase // if it doesn't find any data  don't  create new one 
    })
    .then(result => { // on request  respond with a json  format of  "marked complete"
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // catching the error

})

app.put('/markUnComplete', (request, response) => {  // put request to  path /markUncomplete  to mark as uncompleted 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {  // set the task to uncompleted
            completed: false
          }
    },{
        sort: {_id: -1}, // sort the tasks by _id in descending order
        upsert: false  // if the document is not found do not create it ,  (if upsert : true create it )
    })
    .then(result => { // in the success of the request  do : this below
        console.log('Marked Complete')  // log  "marked complete into the console"
        response.json('Marked Complete') // response a json formatted "marked complete"
    })
    .catch(error => console.error(error)) // if the request failed  catch the error

})

app.delete('/deleteItem', (request, response) => {  // delete request  at  /deleteItem path 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete one document  that have the thing requested from the body
    .then(result => { // in the success of deletion 
        console.log('Todo Deleted') // log "todo deleted" in the console
        response.json('Todo Deleted')// respond with a json format that says  "Todo Deleted"
    })
    .catch(error => console.error(error)) // if an error occurred in the deletion log the error in the console

})

app.listen(process.env.PORT || PORT, ()=>{ // listen to the port of the server
    console.log(`Server running on port ${PORT}`) // when the server is running  log `Server running on port ${PORT}`
})