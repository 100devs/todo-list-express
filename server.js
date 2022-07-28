const express = require('express')  // requires express be importing to node
const app = express() // creates an express application
const MongoClient = require('mongodb').MongoClient // requires that the mongo database be imported
const PORT = 2121  // establishes a port
require('dotenv').config() //it allows you to use the .env file contents within your server.js file.  bring in hidden environment viarables


let db, // creates database
    dbConnectionStr = process.env.DB_STRING, // assigning variable with process.env allow to access content from mongo with the DB_String which is a variable in the mongodb.  Sets dbConnectionSTR equal to address provided by MongoDB (DB_STRING) is in the .env config file in line 5)
    dbName = 'todo' //database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// defines how we connect to our MONGO DB. useUnifiedTopology helps ensure that things are returned in a clean manner
    .then(client => { // "hey we made it we connected to the database "to do"
        console.log(`Connected to ${dbName} Database`) // this message is produced when the client is connected correctly
        db = client.db(dbName) // defines the database as "todo" 
    })
    
app.set('view engine', 'ejs') // determining how were going to use a view template engine to render ejs(embedded js) commands for our app
app.use(express.static('public')) // telling our app to use the public folder with static files that can't be changed(images and css files)
app.use(express.urlencoded({ extended: true })) // call to middleware that cleans up how things are displayed and how our server communicates with our client(similar to useUnifiedTopology above).  The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.json()) // tells the app to use express's json method to take the object and turn it into a JSON


// ROUTES
app.get('/',async (request, response)=>{ // Get stuff to display to the users on the client (index.ejs which is the /) using an asynchronous function 
    const todoItems = await db.collection('todos').find().toArray() //go into our database and in the collection called "todos"and finding whatever we are looking for  and transforming the file into an array of objects. if the database doesnt exists it can create the collection // create a variable to capture an array of our documents in our colletion 'todos' db called
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // the countDocuments() method counts the number of documents that matches to the selection criteria. It returns a numeric value.  It looks like we're counting the incomplete todos (where completed:false) and assigning that number to itemsLeft. "Youre going and counting how many to-do list items havent been completed yet -- what is left on the agenda"
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Sends response that renders all of this info in index. Sending the response of not completed todo list in index.ejs from line 27. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //adding our database by adding items via route /addtodo
    db.collection('todos') // server will go to our collection called "todo"
    .insertOne({thing: request.body.todoItem, completed: 
        false}) // Insert one thing named todoItem with a status of completed set to false (i.e., it puts some stuff in there)
    .then(result => { // assuming that everything was accepted. 
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // UPDATE. when we click somethign on the front end....
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// going to go into our "todos" collection 
        $set: {
            completed: true // add status of completed equal to true to item in our collection
          }
    },{
        sort: {_id: -1}, // once a thing has been marked as completed, this sorts the array by descending order by id. 
        upsert: false // if upsert set to true, and our query didnt return matching documents, our upsert would create it.  Being false, it doesnt create it.  
    })
    .then(result => { // assuming that everything went okay and we got a result
        console.log('Marked Complete') // console log marked complete
        response.json('Marked Complete') //response.json is what is going back to our fetch in main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged to the console. 

})

app.put('/markUnComplete', (request, response) => { // this route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos') // Go into todos collection 
    .updateOne(
        {thing: request.body.itemFromJS},{ // look for item from itemFromJS
        $set: {
            completed: false // undo what we did with markComplete -- changes complete status to false
          }
    },{
        sort: {_id: -1}, // ??? once a thing has been marked as uncompleted this sorts the array by descending order by id
        upsert: false  // doesnt create a document for the todo if the item isnt found 
    })
    .then(result => { // assuming that everything went okay and we got a result...
        console.log('Marked Complete') // console log as mark complete
        response.json('Marked Complete') // returns response of marked complete to the fetch in main.js
    })
    .catch(error => console.error(error)) //if something broke, an error is logged to the console.

})

app.delete('/deleteItem', (request, response) => { // DELETE
    db.collection('todos') // goes into your collection 
    .deleteOne({thing: request.body.itemFromJS}) // uses deleteOne method and find a thing that matches the name of the thing you clicked on 
    .then(result => {  // assuming everything went okay....
        console.log('Todo Deleted') // console log todo deleted. 
        response.json('Todo Deleted') // returns response of TODO DELETED to the fetch main.js
    })
    .catch(error => console.error(error)) // if something broke, an error is logged to the console. 

})

app.listen(process.env.PORT || PORT, ()=>{ // tells our server to listen for a connection on the port or the port we define as a const earlier.  process.env.port will tell the server to listen whatever server were hosting it at aka heroku.  
    console.log(`Server running on port ${PORT}`) // once server is connected, it'll tell us what port were running on in our console. 
})