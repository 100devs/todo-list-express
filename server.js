const express = require('express')  //requiring the express module
const app = express()   //const app will be refering to the express module from now
const MongoClient = require('mongodb').MongoClient //adding mongodb
const PORT = 2121 //setting a port for the app to use
require('dotenv').config() //makes the app use the env file for keys ect..


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //this will connect us to the mongodb database using conenction string from the env
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //if successful, we console log the string
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //setting our views to use ejs    
app.use(express.static('public')) //setting our default folders to use the public folder for css and js
app.use(express.urlencoded({ extended: true }))  
app.use(express.json()) //these two lines allows us to use json requests


app.get('/',async (request, response)=>{    //here the '/' route is coded 
    const todoItems = await db.collection('todos').find().toArray() //when we go to the '/' route we will laod the todos collection in our db and put the results into an array, they are refered to as todoitems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //itemsLeft will be any entry in our db that has the completed property set to 'false', meaning, these are tasks that have not been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // we will render our ejs, inside of the ejs file, 'items' will refer to the todoItems and 'left' will refer to the itemsLeft consts we just created
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // '/addTodo' is a post, meaning it will be used to create an entry 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //this line means we are inserting a document in our db from the request.body with the title of "thing" and setting its initial completed value to 'false'
    .then(result => {
        console.log('Todo Added') //if sucessful we console log this string...
        response.redirect('/') // ...and redirect to the '/' page
    })
    .catch(error => console.error(error)) //logs any errors
})

app.put('/markComplete', (request, response) => { //we are using this to put, or, UPDATING info
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //we are finding an item from the todos db referred to as 'thing' from the request.body.itemfromJS
        $set: {
            completed: true //here we are updating its completed vlaue to 'true'
          }
    },{
        sort: {_id: -1}, //we lower the id value by 1 
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') //return strings if successful
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //another update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the item
        $set: {
            completed: false //mark it ' not complete'
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

app.delete('/deleteItem', (request, response) => { //delete route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find the item  in the db and delete it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //this line is used to run the server on the port we defined at the top of the doc
    console.log(`Server running on port ${PORT}`)
})