const express = require('express')
// app is the server express built 
const app = express()
// everywhere we see app it is calling express //
const MongoClient = require('mongodb').MongoClient
// this connects the server to the database 
const PORT = 2121
// local port
require('dotenv').config()
//.env reads my secrets file 


let db,
//db is the database- empty until connection 
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    //dbconnectionstr is is the secret .env string
    //dbname is the to do database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//connect the server to mongodb 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //respond that is is connected in terminal 
        db = client.db(dbName)
        //asign the db- now holds the database
    })
    
app.set('view engine', 'ejs')
//express server to use ejs 
app.use(express.static('public'))
//a public folder for files where css and js is 
app.use(express.urlencoded({ extended: true }))
// allows the server to read data from the form 
app.use(express.json())
//allows your server to read json 


app.get('/',async (request, response)=>{
    //server to get data (read) and respond hears the get on the root //
    const todoItems = await db.collection('todos').find().toArray()
    // get the to dos out of db collection find it, convert to array store in todoItems wait for db to answer
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // counts the to do's that are not done yet 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //then render the ejs from that result in the format of items and what is left
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
    //post is to create server to create dat on to do
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //insert one to do item into the database- that is not done yet. gets its value from the form input 
    .then(result => {
        //the result of post 
        console.log('Todo Added')
        //log to console to do added
        response.redirect('/')
        //refresh root which starts get flow 
    })
    .catch(error => console.error(error))
    //catch errors//
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //put is to update. /markcomplete 
        $set: {
            completed: true
          }
          //set completed to true//
    },{
        sort: {_id: -1},
        upsert: false
        //if the document doesnt exist- do not make it 
    })
    //sort it from dewcending order  
    .then(result => {
        console.log('Marked Complete')
        //log in console complete 
        response.json('Marked Complete')
        //json response marked complete answers the fetch from the client side 
    })
    .catch(error => console.error(error))
    //error catch

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // put is like the above but this time mark it as not completed//
        $set: {
            completed: false
          }
          //mark completed as false
    },{
        sort: {_id: -1},
        upsert: false
        //descending order if the document doesnt exist dont mske it 
    })
    .then(result => {
        console.log('Marked as Not Completed')
        response.json('Marked as Not Completed')
    })
    //same as above
    .catch(error => console.error(error))
    //same as above

})

app.delete('/deleteItem', (request, response) => {
    //delete the item //
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //go to the database, find the to do that matches, grab it and delete it 
    .then(result => {
        console.log('Todo Deleted')
        //log deleted in console
        response.json('Todo Deleted')
        // json responds to do deleted from the client side 
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    //running on local OR whatever render/heroku port it is going on
    console.log(`Server running on port ${PORT}`)
    //log server is running on x port//
})