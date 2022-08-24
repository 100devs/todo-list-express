const express = require('express')
const app = express()
// using express to help us build out our API

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


app.get('/',async (request, response)=>{
       // listening for a get req on the root page.
 
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })


    db.collection('todos').find().toArray()
      // go to DB collection called todos. Mongo is made of collections inside of the collections are documents. Finds all of the collection documents that we can find. (remember those documents are really just arrays) Puts all the documents in an array 
    .then(data => {
          // passes the array thats holding all the objects into this function and puts the array in the data variable
          
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
              // pass all of the objects from the array into the EJS template under the name items
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
        //route comes from the action on the form that made the post request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
      // finds the collection todo and insert one into the database.  You are inserting an object. thing property and completed property are going to be there.You can enter any property tou want. you either hardcode it like you did compelted or grab the items from te for with the req body todoitem value
    // console.log(request)
    // console.log(request.body)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
               // response to client is to refresh and go to the home page. The refresh triggers a get req
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
              // goes to db and update the first doc that has a thing property of itemsfromJS ( see main js for put req)
    },{
        sort: {_id: -1},
            // sort from recent to oldest
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
              // responds with json to client
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
      // serve hears client req. route matches
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    // listen to the app on the port specified in the env file or use the file that Heroku chooses
    console.log(`Server running on port ${PORT}`)
})