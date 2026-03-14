const express = require('express') 
const app = express() 
const MongoClient = require('mongodb').MongoClient 
const PORT = 2121 
require('dotenv').config() 


let db, 
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'todo' 

MongoClient.connect(dbConnectionStr) 
    .then(client => { 
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName) 
    }) 
    

app.set('view engine', 'ejs') 
app.use(express.static('public')) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 


app.get('/',async (request, response)=>{ 
    const todoItems = await db.collection('todos').find().toArray() 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false, deleted: false}) 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })   
})

app.post('/addTodo', (request, response) => { 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false, deleted: false}) 
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
        console.log('Marked Uncomplete') 
        response.json('Marked Uncomplete') 
    }) 
    .catch(error => console.error(error)) 
})

app.put('/remove', (request, response) => { 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: { 
            deleted: true 
          }
    },{
        sort: {_id: -1}, 
        upsert: false 
    })
    .then(result => { 
        console.log('Task Deleted') 
        response.json('Task Deleted') 
    }) 
    .catch(error => console.error(error)) 
})

// app.delete('/deleteItem', (request, response) => { 
//     db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
//     .then(result => { 
//         console.log('Todo Deleted') 
//         response.json('Todo Deleted') 
//     }) 
//     .catch(error => console.error(error)) 

// })

app.listen(process.env.PORT || PORT, ()=>{ 
    console.log(`Server running on port ${PORT}`) 
}) 