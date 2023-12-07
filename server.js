const express = require('express')                  // importing express into file, storing it in a variable 'express'
const app = express()                               // now when we put 'app', we are calling express
const MongoClient = require('mongodb').MongoClient  // importing montodb's mongoclient method and storing it in a variable MongoClient
const PORT = 2121                                   // establishing port number
require('dotenv').config()                          // require is a function used to import the package passed as param. 'dotenv' is a package used to import things from our .env file
                                                    

let db,
    dbConnectionStr = process.env.DB_STRING,    // setting our DB_STRING variable in our env file equal to 'dbConnectionStr'
    dbName = 'todo'                             // creating a variable called 'dbName' and setting it === 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // passing in two params to .connect(), our dbConnectionStr variable, and an object with 1 property that sets useUnifiedToplogy to true
    .then(client => {                                               // client is just a var name which i believe represents our response 
        console.log(`Connected to ${dbName} Database`)              // console logging a str with our dbName variable
        db = client.db(dbName)                                      // now to access our database, we just use 'db'
    })
    
app.set('view engine', 'ejs')                   // configuring our express' 'view engine' setting to 'ejs'
app.use(express.static('public'))               // using built-in express.static middleware to open static files from our 'public' directory
app.use(express.urlencoded({ extended: true })) // using built-in urlencoded middleware to parse any requests that contain URL payloads
app.use(express.json())                         // parses incoming requests with JSON payloads (meaningful data). The request is an envelope, the payload is what's inside


app.get('/',async (request, response)=>{       // this will execute whenever our server receives a 'get' request to our URL with endpoint '/'
    const todoItems = await db.collection('todos').find().toArray()                     // in our db, go to our 'todos' collection. Find() without any arguments returs a cursor (pointer to our result set) which is turned into an array by calling toArray(). Await will pause execution until. By using 'await', the rest of our function won't execute until this promise is resolved
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   // passing in a filter obj to our .countDocs method. Num of docs in our collection that meet that filter condition will be returned. Again, 'await' tells our code to pause further execution (inside this func only) until this promise is resolved
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // display our 'index.ejs' file. When we use 'items' and 'left' inside that file, we mean 'todoItems' and 'itemsLeft', respectively
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {                                                     // this would be our code if we didn't have async / await
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // executes whenever we receive 'post' request with endpoint 'addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //// goes into our 'todos', inserts item with what user typed into input field with name of 'todoItem', sets that item's completed value to false
    .then(result => {             // will fire when above code (promise) is resolved, the resolution is 'result'
        console.log('Todo Added') // console logging a str
        response.redirect('/')    // refresh page
    })
    .catch(error => console.error(error))   // log any erros
})

app.put('/markComplete', (request, response) => { // executes when 'put' request to endpoint '/markComplete' is received
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // will update our itemFromJS with the obj passed in as the second argument
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {                    // when above is finished, we will cnsole log result and respond w/ some JSON
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // console log any erros

})

app.put('/markUnComplete', (request, response) => { // exact same thing as above...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false                        // except this is our only difference
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

app.delete('/deleteItem', (request, response) => {                     // fires when delete req is made
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // goes into our db collections, finds 'todos', and deletes whatever itemFromJS is
    .then(result => {                                                  // whatever is returned from operation above, we'll console log and response with that result
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error)) // log any errors

})

app.listen(process.env.PORT || PORT, ()=>{          // establishes our servers port, our server's address
    console.log(`Server running on port ${PORT}`)   // says to use the port in our env file. if not, use the PORT variable decalred in this doc
})