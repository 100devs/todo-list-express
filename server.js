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
    
app.set('view engine', 'ejs') // tell express to use ejs as our view engine
app.use(express.static('public')) // so we can use our client-side JS and CSS
app.use(express.urlencoded({ extended: true })) // middleware like body-parser
app.use(express.json()) // middleware to recognize request as JSON


app.get('/',async (request, response)=>{ // read root route
    const todoItems = await db.collection('todos').find().toArray() // store all tasks from db in array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count how many tasks are uncompleted and store in variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // displays ejs file as html, plugs in variables into DOM

    // I don't know why this block is commented out, maybe it's because it's basically the above code without variable assignments
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
    // End of weird somewhat-duplicated code
})

app.post('/addTodo', (request, response) => { // CREATE!
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // takes the task handed over by the client-side code and updates the db
    .then(result => { // AND THEEEENNNN
        console.log('Todo Added') // logs "Todo Added"
        response.redirect('/') // refresh page with new task added
    })
    .catch(error => console.error(error)) // logs oopsies
})

app.put('/markComplete', (request, response) => { // UPDATE!
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // takes the task handed over from client JS
        $set: { // target property
            completed: true // changes value in db
          }
    },{
        sort: {_id: -1}, // sort tasks in descending order by id
        upsert: false // no, we will not create a new document if we can't find one
    })
    .then(result => {
        console.log('Marked Complete') // logs "Marked Complete"
        response.json('Marked Complete') // sends response to client code
    })
    .catch(error => console.error(error)) // *sigh*

})

app.put('/markUnComplete', (request, response) => { // UPDATE!
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // takes task from client-side JS
        $set: { // target property
            completed: false // updates db
          }
    },{
        sort: {_id: -1}, // sort tasks in descending order by id
        upsert: false // mongoDB docs are disrespecc, just sayin'
    })
    .then(result => {
        console.log('Marked Complete') // why tho?
        response.json('Marked Complete') // too funny
    })
    .catch(error => console.error(error)) // not good

})

app.delete('/deleteItem', (request, response) => { // DELAYTAY!
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // takes task from client-side code and yeets it from db
    .then(result => {
        console.log('Todo Deleted') // logs "Todo Deleted"
        response.json('Todo Deleted') // sends responds to client code
    })
    .catch(error => console.error(error)) // you can catch errors or you can catch these hands

})

app.listen(process.env.PORT || PORT, ()=>{ // tells the server where to run
    console.log(`Server running on port ${PORT}`) // yay, we did it
}) // kinda sad you don't use semicolons