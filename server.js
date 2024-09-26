const express = require('express') //Allowing the code to use express
const app = express()//simplify the express function into a variable
const MongoClient = require('mongodb').MongoClient//assign the database (mongodb) to a variable
const PORT = 2121//provides a route for our code to run
require('dotenv').config()//implement dotenv used to hide private key for database and/or port #


let db,//a variable to assign t our database (db)()
    dbConnectionStr = process.env.DB_STRING,//assign route to the db file password 
    dbName = 'todo'//name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// connecting ot the mong database
    .then(client => {//promise
        console.log(`Connected to ${dbName} Database`)//confirmation connection to the database which is to show in the terminal
        db = client.db(dbName) // assignment of the database (local assignment)
    })

//SET MIDDLEWARE    
app.set('view engine', 'ejs')//creation of the index.ejs file
app.use(express.static('public'))//route for our client side files 
app.use(express.urlencoded({ extended: true }))//parses all url request 
app.use(express.json())//enable to use JSON

//CRUD Methods:
app.get('/',async (request, response)=>{//reading the homepage, client make the request and response is sent
    //const todoItems = await db.collection('todos').find().toArray()//creating variable wait for the response from db. It will find the specifics object/s and put it in an array
    //const itemsLeft = await db.collection('todos').countDocuments({completed: false})//creating variable, wait for response from db. count the documents in db and run until completed.
    //response.render('index.ejs', { items: todoItems, left: itemsLeft })//render the data to the index.ejs file via the variables. 
    db.collection('todos').find().toArray()//went to database, went to the collection, found all documents and put them in an array
    .then(data => {//we passed the ^ array to data. 
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })//passing all objects into index.ejs
        })//under the name of items. items: data is a key : value pair
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // routes the HTTP POST(create) request to the specified path ('/addTodo') with the specified callback function
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//we are adding an object to the db collection called 'todos'. the thing we want to insert into the collection is the request.body.todoItem.(completed: false) is an 'acknowledged boolean value. it is set to false, meaning the write concern is disabled
    .then(result => {//promise
        console.log('Todo Added')//if successful, we will see a message in the terminal that says, 'Todo Added'
        response.redirect('/')// this refreshes the page
    })
    .catch(error => console.error(error))//will return undefined if promise rejected
})

app.put('/markComplete', (request, response) => {// routes the HTTP PUT(update) requests to '/markComplete' with the specified callback functions.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//modifies a single document (request.body.itemFromJS) within the 'todos' collection based on the filter
        $set: {//modify with an aggregation pipeline. to replace the value of a field with a specified value
            completed: true//field1 = completed, value1 of field1 = true
          }
    },{
        sort: {_id: -1}, // sorts in descending order becuase of the -1
        upsert: false // update + insert=upsert. value is set to false so it will not update the matched document
    })
    .then(result => {//promise
        console.log('Marked Complete')//will write 'Marked Complete' to the terminal
        response.json('Marked Complete')//will response with JSON and appear as 'Marked Complete' on the ejs file
    })
    .catch(error => console.error(error))//if the promise was rejected, undefined will appear on the terminal

})

app.put('/markUnComplete', (request, response) => {// routes the HTTP PUT(update) requests to '/markUnCompete' with the specified callback functions.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//modifies a single document (request.body.itemFromJS) within the 'todos' collection
        $set: {//modify with an aggregation pipeline. to replace the value of a field with a specified value
            completed: false// our field1=completd, value1=false
          }
    },{
        sort: {_id: -1},//sorts in descending order
        upsert: false//will not update and insert the matched document
    })
    .then(result => {//promise
        console.log('Marked Complete')//will write 'Marked Complete' to the terminal
        response.json('Marked Complete')// will response with JSON and appear on the ejs file as 'Marked Complete'
    })
    .catch(error => console.error(error))// if the promise is rejected, undefined will appear in the terminal

})

app.delete('/deleteItem', (request, response) => {// function used to route the HTTP DELETE(delete) requests to the path of '/deleteItem' which is specified as parameter with the callback functions being passed as parameter
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//will remove one document from the 'todos' collection. the thing removed = request.body.itemFromJS
    .then(result => {//promise 
        console.log('Todo Deleted')//'Todo Deleted' will appear on the console
        response.json('Todo Deleted')//will reponse with JSON, 'Todo Deleted'
    })
    .catch(error => console.error(error))//if the promise is rejected, undefined will appear in the terminal

})

app.listen(process.env.PORT || PORT, ()=>{//our server will hear our request running on process.env.PORT or PORT
    console.log(`Server running on port ${PORT}`)//if our server is able to connect to the client, 'server running on port ${PORT}' will appear on the terminal
})