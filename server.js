const express = require('express') // importing express to node
const app = express() // creates express application
const MongoClient = require('mongodb').MongoClient //requires that mongoclient databse be imported
const PORT = 2121 //specifies port number to 2121
require('dotenv').config() // allows you to bring in hidden environment variables

let db, //.env lets you set environment variables, so you can keep sensitive info (like your mongodb connection string) private but still use it in your application with process.env 
    dbConnectionStr = process.env.DB_STRING, // sets dbconnectionstr equal to address provided by mongodb
    dbName = 'todo' //declare name of db into a variable; naming db to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //defining how we can connect to our mongodb; useunifiedtopolog helps ensure that things are returned in a clean manner
    .then(client => { // responding on the client side and saying ....
        console.log(`Connected to ${dbName} Database`) // "hey, we made it! we made it to the database named 'todo!"; willy produce this message in the onsole if the client connect properly though
        db = client.db(dbName) //defines database as 'to do'
    })
    
app.set('view engine', 'ejs') // determining how we're going to use a view (template) engine to render ejs commands for our app
app.use(express.static('public')) // telling our app to use a folder that we're naming oublic for all of our statis files (css, images)
app.use(express.urlencoded({ extended: true })) // call to middleware that cleans up how things are displayed and how our server communicated with our client.
app.use(express.json()) // tells the app to use express' json method to take the object and turn it into a JSON string


app.get('/',async (request, response)=>{ //get stuff to display to users on the client side (in this case, index.ejs) using an asynchronous function
    const todoItems = await db.collection('todos').find().toArray() // create a constant called "todoItems" that goes into our database, create a collection called "todos", find anything in that database, and turn it into an array of objects
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create a constant in our todos collection; looks at documents in the collection; the .countdocumentds Method counts the number of documents
    // that have a completed status equal to "false" (you're going and counting how many to-do list items haven't been completed yet. "What is still left on the agenda")
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sends response that renders the number of documents in our collection and the number of items left (items that don't have "true" for completed) in index.js
    //sending back a response of the to-do items we still have to do to index.js)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // adds item to our database via route /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //server will go to our collection called "todos"
    // insertOne: insert one "thing" named todoItem with a status of "completed" set to "false" (ie, it puts some stuff in there)
    .then(result => { //assuming that everything went okay...
        console.log('Todo Added') // print "todo" to the console in the repl for vscode
        response.redirect('/') // refreshes index.ejs to show that new thing we added to the database on the page
    })
    .catch(error => console.error(error)) // if we weren't able to add anything to the database, we'll see an error message in the console
})

app.put('/markComplete', (request, response) => { // update: when we click something on the frontend...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //going into our todos collection, 
        $set: {
            completed: true // add status of completed equal to true to item to our collection
          }
    },{
        sort: {_id: -1}, // once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false //reduces left-to-do total by 1
    })
    .then(result => { //assuming that everything went okay and we got a result...
        console.log('Marked Complete') // console.log marked complete
        response.json('Marked Complete') // returns response of marked complete
    })
    .catch(error => console.error(error)) // if something broke, an error is logged to the console.

})

app.put('/markUnComplete', (request, response) => { // this route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into todos collection and look for item from itemFromJS
        $set: {
            completed: false // undo what we did with markComplete - changes completed status to false
          }
    },{
        sort: {_id: -1}, // once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false
    })
    .then(result => { // //assuming that everything went okay and we got a result...
        console.log('Marked Complete') // console.log marked complete
        response.json('Marked Complete') // returns response of marked complete
    })
    .catch(error => console.error(error)) // if something broke, an error is logged to the console.

})

app.delete('/deleteItem', (request, response) => { // goes into your collection and uses deleteOne method and find a thing that matches the name of the thing you clicked on
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {  //assuming that everything went okay and we got a result...
        console.log('Todo Deleted') // console.log todo deleted
        response.json('Todo Deleted')// returns response of todo deleted to the fetch in main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged to the console.

})

app.listen(process.env.PORT || PORT, ()=>{ // tells our server to listen for our connection on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app (the PORT used by HEROKU)
    console.log(`Server running on port ${PORT}`) // console.log the port number or server server is running on
})