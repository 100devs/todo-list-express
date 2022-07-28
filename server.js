const express = require('express') // enables express on the server
const app = express() // sets a variable to use express
const MongoClient = require('mongodb').MongoClient // enables mongoDB on the server
const PORT = 8000 // sets port to desired default port
require('dotenv').config() // allows use of .env files


let db, // creates the variable db
    dbConnectionStr = process.env.DB_STRING, // sets a variable to connect to mongoDB
    dbName = 'todo' // sets the database name to a variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to the mongoDB database selected above
    .then(client => { // sets variable client to match mongoDB info
        console.log(`Connected to ${dbName} Database`) // console logs connected message
        db = client.db(dbName) //  sets database to the matching databse set above
    })
    
app.set('view engine', 'ejs') // tells browser to use ejs file
app.use(express.static('public')) // directs path execution to the public folder.  for instance: css and js files
app.use(express.urlencoded({ extended: true })) // helps parse the data correctly
app.use(express.json()) // converts data into json structure


app.get('/',async (request, response)=>{ //endpoint listener 
    const todoItems = await db.collection('todos').find().toArray() // creates an array of items from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // returns number of entries in the database
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the database so ejs can read the entries properly
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // endpoint listener for addOne mongoDB
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // tells mongodb to insert document into database
    .then(result => { // stores result into a variable
        console.log('Todo Added') // console logs that the entry has been successfully added
        response.redirect('/') // reloads the page with new info 
    })
    .catch(error => console.error(error)) // if error occues, console log error
})

app.put('/markComplete', (request, response) => { // endpoint listener to mark complete 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // finds document with same name
        $set: { // sets the field value of document
            completed: true // changes value of field in document
          }
    },{
        sort: {_id: -1},  // sorts by id 
        upsert: false  // upsert will determine if you update or insert 
    })
    .then(result => {   // stores result in variable
        console.log('Marked Complete') // console logs when item is marked complete
        response.json('Marked Complete') // sends marked complete to our js file 
    })
    .catch(error => console.error(error))  // console logs error in case of error

})

app.put('/markUnComplete', (request, response) => {  // endpoint listener to mark complete 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // finds document with same name
        $set: { // sets the field value of document
            completed: false // changes value of field in document
          }
    },{
        sort: {_id: -1}, // sorts by id
        upsert: false // determines if it will update or insert
    })
    .then(result => { // stores result in variable
        console.log('Marked Complete') // console logs when item is marked complete
        response.json('Marked Complete') // sends marked as completed to our js file 
    })
    .catch(error => console.error(error)) // conssole logs error if error occues

})

app.delete('/deleteItem', (request, response) => { // endpoint for delete item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // selects document with name
    .then(result => { // stores results in variable
        console.log('Todo Deleted') // console logs that item was deleted
        response.json('Todo Deleted') // sends deleted to json file
    })
    .catch(error => console.error(error)) // conssole logs error if error occues

})

app.listen(process.env.PORT || PORT, ()=>{ // sets the port to listen to 
    console.log(`Server running on port ${PORT}`)  // console logs when connection is established
})
