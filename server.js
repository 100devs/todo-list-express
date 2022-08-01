const express = require('express') // making it posible to use express in this file 
const app = express()// setting a variable and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our db 
const PORT = 2121 // setting variable for our port for where the server will be listening 
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring variable called db 
    dbConnectionStr = process.env.DB_STRING, // declaring and assigning our database connection string 
    dbName = 'todo'// declaring a variable and setting it to the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongodb and passing in our connection string.also passing in additional property 
    .then(client => {// waiting on connectionand proceeding if succeful and passing in all the client info 
        console.log(`Connected to ${dbName} Database`) // logging that we are connected to our todo database
        db = client.db(dbName)//assigning value to previously declared db that contains a db client factory method 
    })// closing then 
//setting middleware
app.set('view engine', 'ejs')//sets ejs as defualt render method
app.use(express.static('public'))// tells to look at at public folder for our static assets (html,css,main.js)
app.use(express.urlencoded({ extended: true }))//tells express to decode URLs where the header matches content. supports arrays and obj
app.use(express.json())//helps us parse json content from incoming request


app.get('/',async (request, response)=>{ // starts a get method when the root route is passined in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()// sets a variable and awaits ALl items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets varibale and awaits an account of uncompleted items to display later in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// rendering an ejs file and count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
     .catch(error => console.error(error)) // catches err and logs it 
})

app.post('/addTodo', (request, response) => { // starts a post method when the addTodo route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insterts a new item into todos collections,set it to false by default 
    .then(result => { // if insert is succeful, do something
        console.log('Todo Added')// console log action
        response.redirect('/')// gets rid of the post route and sends back too root "/"
    })
    .catch(error => console.error(error))// catches err and logs if any 
})

app.put('/markComplete', (request, response) => {// starting a put method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for ione item matching the name of item passed from main.js file that was clicked on 
        $set: { //setting completed value as true 
            completed: true
          }
    },{
        sort: {_id: -1},// moves item to bottom of list 
        upsert: false // prevents insertion if item does not already exist 
    })
    .then(result => { // starts athen if update was succesful
        console.log('Marked Complete') // logging succeful connection 
        response.json('Marked Complete')// sending response back to sender 
    })
    .catch(error => console.error(error))// catching err

})

app.put('/markUnComplete', (request, response) => {// starting a put method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// look in the db for one item matching the name of item passed from main.js file that was clicked on 
        $set: {
            completed: false//setting completed value as true 
          }
    },{
        sort: {_id: -1},// moves item to bottom of list 
        upsert: false// prevents insertion if item does not already exist 
    })
    .then(result => {// starts athen if update was succesful
        console.log('Marked Complete') // logging succeful connection 
        response.json('Marked Complete')// sending response back to sender
    })
    .catch(error => console.error(error))// catches err

})

app.delete('/deleteItem', (request, response) => {// starts a deletem method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// look inside the todos collection for one item that has matching name from our js file
    .then(result => {// starts a then if delete succesful
        console.log('Todo Deleted')// looging succeful completeion
        response.json('Todo Deleted')// sending res back top sender
    })
    .catch(error => console.error(error))//catches err

})

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either on the port from .env file or port variable we set
    console.log(`Server running on port ${PORT}`)// logs port 
})// ends listening method