const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
// this line makes it so we can use the env variable in our API
require('dotenv').config()

// this helps us to connect to the database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// this sets ejs as the view engine for this project    
app.set('view engine', 'ejs')

// a special line of code loved by many,this line of code is embedded into Express and it handles all the files in the public folder and serves them up
app.use(express.static('public'))

// these two lines of code are used in the place of 'bodyparser'
// they are used to process data sent in an HTTP request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// this is a get(read) request to the root route,the user makes this request whenever the user loads the page or when the user refreshes the page. 
app.get('/',async (request, response)=>{
    // we search the db for a collection with the name 'todos' and put it in an array, collections in Mongodb are in form of an object
    const todoItems = await db.collection('todos').find().toArray()
    // search the db for a 'todos' collection and count the documents that have a completed value that is equals to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // the method render returns the rendered HTML of a view, it has a callback which is an object containing data to be used by the view(which in this case is index.ejs)
    // we respond the user with the returned HTML by the render method
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

// when a post request is made to the '/addTodo' route this function runs
// the post request is made through the form
app.post('/addTodo', (request, response) => {
    // search the db for 'todos' collection then insert one document into the collection
    // the object in the insertOne method is the document to be inserted
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if no error refresh the page (which further makes a get request because the page is refreshed)
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // if there is an error run the catch 
    .catch(error => console.error(error))
})

// when a put(update) request is made to the '/markComplete' route this function runs
// the put request is made by clicking a Todo complete 
app.put('/markComplete', (request, response) => {
    // search the db for 'todos' collection then update the Todo that you clicked
    // when a Todo is clicked the client-side javascript hears it and sends the name of the Todo clicked and with that we can search the db for that specific Todo
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // since we know the Todo that was clicked we then update the 'completed' to true
        $set: {
            completed: true
          }
    },{
        // this sorts the documents in descending order
        // '_id' is a field and is the easiest way to ensure sort consistency 
        sort: {_id: -1},
        // if no document matches the query upsert creates a new document if set to true
        upsert: false
    })
    //if no error it sends response to the client-side javascript
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if there is an error run the catch
    .catch(error => console.error(error))

})

// when a put(update) request is made to the '/markUnComplete' route this function runs
// the put request is made by clicking an already completed Todo
app.put('/markUnComplete', (request, response) => {
    // search the db for 'todos' collection then update the Todo that you clicked
    // when an already completed Todo is clicked the client-side javascript hears it and sends the name of that Todo clicked and with that we can search the db for that specific Todo
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // since we know the Todo that was clicked we then update the 'completed' to true
        $set: {
            completed: false
          }
    },{
        // this sorts the documents in descending order
        // '_id' is a field and is the easiest way to ensure sort consistency 
        sort: {_id: -1},
        // if no document matches the query upsert creates a new document if set to true
        upsert: false
    })
    //if no error it sends response to the client-side javascript
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if there is an error run the catch
    .catch(error => console.error(error))

})

// when a delete request is made to the '/deleteItem' route this function runs
// the delete request is made through the delete button
app.delete('/deleteItem', (request, response) => {
    // search the db for 'todos' collection then delete the first document that has the properties specified in the method
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if there is no error we respond to the client-side javascript
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if there is an error we run the catch
    .catch(error => console.error(error))

})

// this listens for connection on the 'PORT'
// process.env.PORT || PORT  is telling the app to listen to the port in the environment where the app would be hosted(like Heroku) but if there is none we should use the hardcoded PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})