//MODULES
const express = require('express') //Requires that Express be imported into Node
const app = express(); //Create an Express application
const MongoClient = require('mongodb').MongoClient; //Requres that MongoClient library be imported
const PORT = 2121 //Establishes a local port on port 2121
require('dotenv').config() //Allows you to bring in hidden environment variables


let db, //Creates database
    dbConnectionStr = process.env.DB_STRING, //Sets dbConnectionsStr equal to address provided by MongoDB (DB_STRING is in the .env config file in line 5)
    dbName = 'todo' //Sets database name equal to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {›
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of "completed" equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this removes it from the to-do list
        upsert: false //Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        //Assuming that everything went okay and we got a result...
        console.log('Marked Complete') //console logged "Marked Complete"
        response.json('Marked Complete') //Returns response of "Marked Complete"
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => { //This route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos')//Go into todos collection
    .updateOne({thing: request.body.itemFromJS}, //Look for item from itemFromJS
        {
        $set: {
            completed: false //Undoes what we did with markComplete - changes "completed" status to "false"
          }
    },{
        sort: {_id: -1}, //  
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
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})