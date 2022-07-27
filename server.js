///Require necessary modules, files, and libraries///

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()



///Connect server to database///

let db,  // declare db variable
    dbConnectionStr = process.env.DB_STRING,  // Set db connection string
    dbName = 'todo'  // Set DB name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // CONNECT TO DB

    .then(client => {  // if connected

        console.log(`Connected to ${dbName} Database`)  // Log connection confirmation
        db = client.db(dbName)  // Set db to client.db
    })
    


// set view engine to EJS
app.set('view engine', 'ejs')

// set static folder 'public'
app.use(express.static('public'))

// set body parser to parse form data
app.use(express.urlencoded({ extended: true }))

// set body parser to parse JSON data
app.use(express.json())




///GET REQUEST TO ROOT FOLDER///
app.get('/',async (request, response)=>{

    const todoItems = await db.collection('todos').find().toArray()  // get all 'todo' items from db collection

    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // get number of uncomplete items from db collection

    response.render('index.ejs', { items: todoItems, left: itemsLeft })  // render index.ejs with todo items and number of incomplete items
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})



///POST REQUEST TO 'addTodo' FOLDER///
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // insert todo item to db collection
    .then(result => {

        console.log('Todo Added')  // Log POS

        response.redirect('/')  // redirect to root folder
    })

    // error catch
    .catch(error => console.error(error))
})



///PUT('update') REQUEST TO 'markComplete' FOLDER///
app.put('/markComplete', (request, response) => {

    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // update todo item as complete in db collection
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })

    .then(result => {
        console.log('Marked Complete')  // Log completion update
        response.json('Marked Complete')  // 'Marked Complete' json response
    })

    // error catch
    .catch(error => console.error(error))

})




///PUT('update') REQUEST TO 'markUnComplete' FOLDER///
app.put('/markUnComplete', (request, response) => {

    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // update todo item as incomplete in db collection
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })

    .then(result => {
        console.log('Marked Uncomplete')  // Log incompletion update
        response.json('Marked Uncomplete')  // 'Marked Uncomplete' json response
    })
    
    // error catch
    .catch(error => console.error(error))

})



/// DELETE REQUEST to 'deleteItem' FOLDER///
app.delete('/deleteItem', (request, response) => {

    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  // access and DELETE todo item from db collection

    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })

    // error catch
    .catch(error => console.error(error))

})




///ESTABLISH SERVER///
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})