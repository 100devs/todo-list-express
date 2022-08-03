const express = require('express') // load the memory for express into a function 
const app = express() //create an express app for multi-express drifting
const MongoClient = require('mongodb').MongoClient //load memory from MongoDB
const PORT = 2121 //which port on the local host to use
require('dotenv').config() //module that loads environment files


let db, //creating a variable to hold a database
    dbConnectionStr = process.env.DB_STRING, //creates a variable with the database key so it's less ugly
    dbName = 'todo' //this is the database's name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //run the function of connecting the database, smooths shit out
    .then(client => { //once it's connected, take the client aaaaaand..........
        console.log(`Connected to ${dbName} Database`) //console log if that shit's connected; if not
        db = client.db(dbName) //that's the database voilaaaa
    })
    
app.set('view engine', 'ejs') //it's the default engine 
app.use(express.static('public')) //root directory from where you serve static assets - that other folder with stuff in it ppl see
app.use(express.urlencoded({ extended: true })) //you can make fancy query strings
app.use(express.json()) // lets you de/code JSON from/into query strings


app.get('/',async (request, response)=>{ //an asynchronous getter function that upon request, responds with........
    const todoItems = await db.collection('todos').find().toArray() //the whole collection of todos as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //items of that same collection that ain't got done yet
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //put the response together to get ready to serve
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //a create function that....
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds another item to the todos collection that needs getting done
    .then(result => { //once you've done that.....
        console.log('Todo Added') //confirm it happened correctly
        response.redirect('/') //go home roger
    })
    .catch(error => console.error(error)) //if somethingn fucks up lmk
})

app.put('/markComplete', (request, response) => { //a put function that.....
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //marks a todo item as complete
        $set: { 
            completed: true
          }
    },{
        sort: {_id: -1}, //sort the collection in descending order
        upsert: false //prioritize things left undone and/or move them to the top
    })
    .then(result => { //once ya done there....
        console.log('Marked Complete') //console log that it happened
        response.json('Marked Complete') //tell the browser that it happened / tell JSON Derulo
    })
    .catch(error => console.error(error)) //if ya fuck up say something

})

app.put('/markUnComplete', (request, response) => { //a put function that.....
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //marks a todo item as INcomplete
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, //sort 
        upsert: false //sort by undone
    })
    .then(result => { //and then...
        console.log('Marked Complete') //lmk at the console
        response.json('Marked Complete') //lmk at the browser
    })
    .catch(error => console.error(error)) //lmk if you need help

})

app.delete('/deleteItem', (request, response) => { //a delete function that....
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //removes a todo list item!
    .then(result => { //and then...
        console.log('Todo Deleted') //hmu console
        response.json('Todo Deleted') //hmu browser
    })
    .catch(error => console.error(error)) //call me if you get lost

})

app.listen(process.env.PORT || PORT, ()=>{ //specify which port you want all this to run on
    console.log(`Server running on port ${PORT}`) //console log that it's running there or somewhere
})
