const express = require('express') // requires express
const app = express() // calls express and stores it in a variable 'app'
const MongoClient = require('mongodb').MongoClient //gives access to mongodb
const PORT = 2121 // variable for port in case it needs to be changed
require('dotenv').config() //required for .env to store sensitive data


let db, // declares db
    dbConnectionStr = process.env.DB_STRING, // declares connection string. stores variable in env string
    dbName = 'todo' // declares the database name in mongo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // awaits mongo. connects mongodb
    .then(client => {
        console.log(`Connected to ${dbName} Database`) 
        db = client.db(dbName) // connects to db within mongo
    })
    
app.set('view engine', 'ejs') // sets up view engine to ejs
app.use(express.static('public')) // able to use public folder for static files
app.use(express.urlencoded({ extended: true })) // able to parse incoming request bodies that are url encoded
app.use(express.json()) // able to use json requests with express


app.get('/',async (request, response)=>{ // get request. root directory
    const todoItems = await db.collection('todos').find().toArray() //awaits the todo collection within the db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // awaits another collection. marks it as not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the index ejs file. names of the items is todoItems and the items left are itemsLeft. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // post request. api endpoint  is addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // takes name from form and assigns it to thing. it inserts that one thing into the collection on mongo
    .then(result => {
        console.log('Todo Added') // console notification
        response.redirect('/') // redirects to root
    })
    .catch(error => console.error(error)) // throws error
})

app.put('/markComplete', (request, response) => { // put (update) request. endpoint is markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // targets one and updates the thing
        $set: {
            completed: true // sets to true
          }
    },{
        sort: {_id: -1}, // sorts by id descending
        upsert: false // upsert inserts rows into db table. 
    })
    .then(result => {
        console.log('Marked Complete') // lets developer know its done
        response.json('Marked Complete') // lets user know its done
    })
    .catch(error => console.error(error))// throws error

})

app.put('/markUnComplete', (request, response) => { // put request. marks incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // targets item and updates thing
        $set: {
            completed: false // sets to false
          }
    },{
        sort: {_id: -1}, // sorts by id descending
        upsert: false // upsert inserts rows into db table. 
    })
    .then(result => {
        console.log('Marked Complete') // lets developer know its don
        response.json('Marked Complete') // lets user know its done
    })
    .catch(error => console.error(error)) // throws error

})

app.delete('/deleteItem', (request, response) => { // deletes request. endpoint is deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // targets thing and deletes the one thing
    .then(result => { 
        console.log('Todo Deleted')// lets developer know its done
        response.json('Todo Deleted') // lets user know its done
    })
    .catch(error => console.error(error))// throws error

})

app.listen(process.env.PORT || PORT, ()=>{ // listens for port
    console.log(`Server running on port ${PORT}`) // consoles port
})