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
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',/*async*/ (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Mark a todo as complete
app.put('/markComplete', (request, response) => {

    // FILTER: find the todo whose "thing" text matches what the browser sent us.
    //    main.js sent it as { itemFromJS: 'the text' } in the request body.
    db.collection('todos').updateOne({thing: request.body.itemFromJS}, 
        { 
        $set: {
            completed: true // set completed -> true
          }
    },
    { // prefer newest match; don’t create if missing
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // reply to the client
    })
    .catch(error => console.error(error))

})
// Mark a todo as NOT complete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne(

         // Find the doc by its text again.
        {thing: request.body.itemFromJS},{
        $set: {
            completed: false // set completed -> false
          }
    },{ // prefer newest match; don’t create if missing
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // reply to the client
    })
    .catch(error => console.error(error))

})

// Delete a todo
app.delete('/deleteItem', (request, response) => {

    // Remove exactly ONE document whose "thing" matches the text we got from the browser.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Start server (use provider’s PORT if available)
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})


