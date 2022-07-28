//modules 
const express = require('express') //requires that express it in node
const app = express() //creates express applications 
const MongoClient = require('mongodb').MongoClient //requires that mongo client library is imported 
const PORT = 2121 //specifies port number (currently a local port)
require('dotenv').config() //.env lets you set environment variables (so you can keep private things private) // Hide that business in .env. you can bring in hidden variables 

let db,//gives you your database 
    dbConnectionStr = process.env.DB_STRING, //sets dbconnctionstr equal to address provided by MongoDB DB_strinkg is in the .env config file in line 5
    dbName = 'todo'//sets name of database to 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //defining how we connect to our mongodatabase
    .then(client => {
        console.log(`Connected to ${dbName} Database`)// in the server console: "hey we made it! We connected to the database 'to do!"
        db = client.db(dbName) //defines database to dbName, which is 'todo'
    })
    
app.set('view engine', 'ejs') //determines how we're going to use a view (template) engine to render ejs (embedded JS) commands for our app
app.use(express.static('public')) //Tells our app to uuse a folder named public for all of our static files (ex. images and CSS files)
app.use(express.urlencoded({ extended: true }))//call to middleware that cleans up how things are deplayed and how our server commuunicates with our clinet (similar to body parser like we used before)
app.use(express.json())// tells the app to use express's json method to take the object and turn it into a JSON string

//routes 
app.get('/',async (request, response)=>{ //server is going and getting index.ejs gets stuff to display tto users on the clinet side using an async function
    const todoItems = await db.collection('todos').find().toArray() //setting a const to todoItems, looking for anythign in the database called todo items and turning those elements into an array of objects 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //determines if the item has a status of complete (count documents mether counts the number of documents that have completed statues equal to false ). 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //sending a response that renders all of this info in our index.ejs. number of items completed and items that are not completed. Counting out how many to-do list items haven'tt been completed yet. "what is still left on the adjenda"
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
    //adding an element to our database 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //server will do into our collect called todos// insert one things named todoItems with a status of "completed false"
    .then(result => { //assuming everything went okay...
        console.log('Todo Added') //print 'todo added' to the console in the repl for VS code
        response.redirect('/') //refreshes index.ejs to show that new thing we added to the database on the page 
    })
    .catch(error => console.error(error))//if we weren't able to add anything to the database, we'll see an error message in the console
})








app.put('/markComplete', (request, response) => {
    //update.. when we click something on the frontend...
    db.collection('todos')/*going to go into our todos collection*/.updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //add status of 'completed' equal to 'true' to item in our collection 
          }
    },{
        sort: {_id: -1},//once a thing is marked as completed it takes it off the todo's list and adds it to the completed list 
        upsert: false // reduces left to do by a total of 1 
    })
    .then(result => { //assuming that everything went okay and we got a result
        console.log('Marked Complete') //console log 'marked complete'
        response.json('Marked Complete') //returns response of marke complete
    })
    .catch(error => console.error(error)) //if something broke an error is logged to the console 

})

app.put('/markUnComplete', (request, response) => {//route unclicks a thing thatt your've marked as complete -- will take away complete status 
    db.collection('todos')//go into todos collection 
    .updateOne({thing: request.body.itemFromJS},//look for item from itemFromJS
        {
        $set: {
            completed: false, //undoes what we did with markComplete -- changes completed status to "false"
          }
    },{
        sort: {_id: -1}, //once a thing has been marked as uncompleted this sorts the array by sescending order by id 
        upsert: false//doesn't create a document for the todo it the item itsn't found 
    })
    .then(result => {
        console.log('Marked Complete') //console log 'marked complete' 
        response.json('Marked Complete')// if something broke, an error is logged to the console 
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //deletes 
    db.collection('todos')//goes into your collection
    .deleteOne({thing: request.body.itemFromJS})//uses deleteone method and find a tihng that matches the name of the thing you clicked on 
    .then(result => {//assuming everything went okay...
        console.log('Todo Deleted')//console logs 'todo deleted' 
        response.json('Todo Deleted')._construct// returns response of 'todo deleted' to the fetch in main.js
    })
    .catch(error => console.error(error))//if something broke, an error is logged to the console 

})

app.listen(process.env.PORT || PORT, ()=>{//tells our server to listen for connections on the PORT we definded as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app (ex. the PORT used by Heroku)
    console.log(`Server running on port ${PORT}`)
}) //console log the port number or server is running on 