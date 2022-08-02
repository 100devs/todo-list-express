const express = require('express') // get in losers, we're using express
const app = express() // now we invoke express
const MongoClient = require('mongodb').MongoClient // that database tho
const PORT = 2121 // instantiate our port as a constant
require('dotenv').config() // so we can use super-secret variables like our database string


let db, // declare database variable
    dbConnectionStr = process.env.DB_STRING, // use super-secret variable in dotenv file
    dbName = 'todo' // declare name of collection

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // hook that ish up bih
    .then(client => { // AND THEEEEENNNNNN???
        console.log(`Connected to ${dbName} Database`) // success message logged to console
        db = client.db(dbName) // assign our database to variable
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public')) // so we can use our client-side JS and CSS
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // tells the server where to run
    console.log(`Server running on port ${PORT}`) // yay, we did it
}) // kinda sad you don't use semicolons