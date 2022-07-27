const express = require('express')                  // requiring express, which is our framework of choice. 
const app = express()                              // setting the app variable to call the express method which gives us fancy middlewares.
const MongoClient = require('mongodb').MongoClient // requiring mongo client so we have access to mongo db methods and functionality.
const PORT = 2121                                   // our port of choice for the developing environment, production environment will set the port chosen by server host.
require('dotenv').config()                          // configuring dotenv which stores our environment variables.


let db,                                         //  declaring variable which will be assigned a variable upon connecting to database.
    dbConnectionStr = process.env.DB_STRING,    // declaring a variable and assigning it the value of our mongo URI from dotenv file.
    dbName = 'todo'                             // declaring a variable and assigning it 'todo' which represents database name.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })   // method to connect to DB, useUnifiedTopology: true is used as a best practice to ensure compatibility.
    .then(client => {                                               // mongo db connect method returns some data needed for setting up the database.
        console.log(`Connected to ${dbName} Database`)              // sting to console.log to confirm db connection.
        db = client.db(dbName)                                      // assigning db a value that'll represent database.
    })
  
app.set('view engine', 'ejs')                     // declares ejs as the template engine of choice.
app.use(express.static('public'))                 // serves the client side code in public directory. 
app.use(express.urlencoded({ extended: true }))  // ensures that the requests are comming from urls.
app.use(express.json())                          // sets the data notation of choice to json.


app.get('/',async (request, response)=>{                                                // read request route.
    const todoItems = await db.collection('todos').find().toArray()                     // converts the collection 'todos' into an array. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   // counts the number of Todos(documents) in the todos collection that aren't completed.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                 // serves up the 'index.ejs' template with items property having a value of an array(todoItems) and left property having value of itemsLeft(array).
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {                                           // create route for adding todos.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // adds a todo as a document to the db with thing as property for text of todo and completed for whether its done or not, set to false by default.
    .then(result => {                                                                   // once the above is completed do this.
        console.log('Todo Added')                                                       // to confirm the todo was added.
        response.redirect('/')                                                          // redirects client to root route or main page, otherwise it'll buffer endlesslly expecting a response.
    })
    .catch(error => console.error(error))                                               // in case there's an error, we wanna log it.
})

app.put('/markComplete', (request, response) => {                         // update route for marking todos complete.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{   // looks for the content of the todo we click on in the db and then uses updateOne method to update according to the parameters and queries below.
        $set: {                                                           // when you want to change a value.
            completed: true                                               // sets completed to true.
          }
    },{
        sort: {_id: -1},  // sorts the documents. -1 sorts in descending order.
        upsert: false    //  upsert, if set to true, adds a new todo if it can't find the one referenced.
    })
    .then(result => {
        console.log('Marked Complete')    // console.logs just for development confirmation.
        response.json('Marked Complete')    // sends a message to client side js, because it's expecting something back.
    })
    .catch(error => console.error(error))   // in case there's an error. 

})

app.put('/markUnComplete', (request, response) => {                       // update route for marking todos incomplete.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{   // looks for the content of the todo we click on in the db and then uses updateOne method to update according to the parameters and queries below.
        $set: {                                                           // when you want to change a value.
            completed: false                                              // sets completed to false.
          }
    },{
        sort: {_id: -1},    // sorts the documents. -1 sorts in descending order.
        upsert: false     //  upsert, if set to true, adds a new todo if it can't find the one referenced.
    })
    .then(result => {
        console.log('Marked Complete')     // console.logs just for development confirmation.
        response.json('Marked Complete')   // sends a message to client side js, because it's expecting something back.
    })
    .catch(error => console.error(error)) // in case there's an error.

})

app.delete('/deleteItem', (request, response) => {                        // delete route for deleting todos.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})   // looks for the content of the todo we click on in the db and then uses deleteOne method to deelaytay the referenced document. 
    .then(result => {                                                   // once the above is completed do this.
        console.log('Todo Deleted')                                     // logs message to confirm deelaytation.
        response.json('Todo Deleted')                                   // sends something back to client side js; it' expecting something back.
    })
    .catch(error => console.error(error))                               // in case there's an error. 

})

app.listen(process.env.PORT || PORT, ()=>{         // listen initiates server by using the PORT in the .env file which will be provided by server, or if non is provided, will use the PORT value in this file 2121.
    console.log(`Server running on port ${PORT}`)  // confirms server is running and indicates its port.
})