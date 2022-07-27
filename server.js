const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
//in .env our DB_STRING here connects with our mongodb ps and username
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'tester' //whatever we want our db collection to be called

    //connecting to mongodb with our db_string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //assigning global db variable to our db collection name
        db = client.db(dbName)
    })

//middleware
//setting ejs as the express app view engine (will look inside of a views folder)
app.set('view engine', 'ejs')
//making it possible to access files from public folder
app.use(express.static('public'))
// supports parsing of application/x-www-form-urlencoded post data
//If you don't add this line you won't be able to parse the body of requests with application/x-www-form-urlencoded content type
app.use(express.urlencoded({ extended: true }))
//parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json())

//async so while this awaits db parsing can continue ie app.post 
app.get('/',async (request, response)=>{
    //go to db and in todos bring back items as array
    const todoItems = await db.collection('todos').find().toArray()
    //count how many items there are in todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //get the data I requested and render in ejs 
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
//post to create or edit with route /addTodo
app.post('/addTodo', (request, response) => {
    //go to db insert word inputted from form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
    //go back to root of page when completed
        response.redirect('/')
    })
    //return this error if not
    .catch(error => console.error(error))
})

//update the item (this is coming from fetch in main.js)
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
    //descending
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
    //go to db'todos' find (value from itemFromJS)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //after updating set completed to false
        $set: {
            completed: false
          }
    },{
        //sort list item to descending (below?)
        sort: {_id: -1},
        //upsert = combo of update insert
        //if value is set to true and doc is found that match query then update 
        //if set to true and doc doesnt match then insert new doc in the collection 
        //default is false 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//delete route deleteItem
app.delete('/deleteItem', (request, response) => {
    //go to db delete the item that matches thing value
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //can see in console 
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//can store port in env so its private but process.env hosts all enviroment variables
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
