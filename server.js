const express = require('express')//set up express
const app = express()//set up express
const MongoClient = require('mongodb').MongoClient//set up mongodb
const PORT = 2121//set port to 2121
require('dotenv').config()//import environment variables


let db,//db variable
    dbConnectionStr = process.env.DB_STRING,//variable with the connection string we created in mongodb atlas
    dbName = 'todo'//the name we gave our db in mongodb atlas

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//how we connect to our db
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')//set up our middleware view engine
app.use(express.static('public'))//set up express
app.use(express.urlencoded({ extended: true }))//set up express
app.use(express.json())//set up express


app.get('/',async (request, response)=>{//grab the todo list items from the database when the page is hit
    const todoItems = await db.collection('todos').find().toArray()//all items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//uncompleted item count
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//show the index page and set 'items' to the todoItems array and 'left' to the itemsLeft number (count)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//server side add todo item function.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//ask db to insert new item with item text and completed = false
    .then(result => {//if it works then log that it worked
        console.log('Todo Added')
        response.redirect('/')//redirect to the index page
    })
    .catch(error => console.error(error))//console out an error if it catches one
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//ask db to update item to completed
        $set: {
            completed: true
          }
    },{ 
        sort: {_id: -1},//sort by the id field in descending (-1) order
        upsert: false //upsert (update or insert) set to false
    })
    .then(result => {//if it works then log that it worked
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//console out an error if it catches one

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},//sort by the id field in descending (-1) order
        upsert: false//upsert (update or insert) set to false
    })
    .then(result => {//if it works then log that it worked
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//console out an error if it catches one

})

// server side delete item function that deletes item from server
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//actually ask db to delete this item
    .then(result => { //if it works then log that it worked
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) //console out an error if it catches one

})

app.listen(process.env.PORT || PORT, ()=>{ //ask app to listen on specified port
    console.log(`Server running on port ${PORT}`)
})