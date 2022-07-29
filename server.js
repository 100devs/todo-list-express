const express = require('express') //Requiring express package that we installed
const app = express() //initializing the package so we can use it
const MongoClient = require('mongodb').MongoClient //Requiring the MongoDB and client in a variable so we can access it
const PORT = 2121 //PORT runs here (which is compatible with heroku)
require('dotenv').config() //holds secret thingies like variable keys (need to put them in heroku as environmental variables)


let db, //shorten up variables, declaring dB so there's less typing (it's empty)
    dbConnectionStr = process.env.DB_STRING, //look here for the environmental variable connection string
    dbName = 'todo' //Variable assignment 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to the database using string above
    //unifiedTopology - opt in for a new version of MongoDB connection (stays active), better performance. Keeps the connection open even when it's not being actively used. (You're a mom with a toddler(database) and keeping eyes on it. The knife the toddler just found is the data.)
    .then(client => { //after connecting then
        console.log(`Connected to ${dbName} Database`) //lets us know we connected correctly
        db = client.db(dbName) //assign the db variable from line 8 .... (octo would switch line 15 with 16. It would let us know whether the connection with the database was successful rather than thinking you're connected and there's an issue with the database)
    })
    
app.set('view engine', 'ejs') //setting the view engine to use ejs - set the options for the express app we assigned earlier
app.use(express.static('public')) //middleware (which happens after request and before response). Look in the public folder for routes that we call up
app.use(express.urlencoded({ extended: true })) //settings
app.use(express.json()) //more settings


app.get('/',async (request, response)=>{ //client requests the 'root' page. we send back these or error codes
    const todoItems = await db.collection('todos').find().toArray() // Wait for the database to reply. when it replies with the todos, we convert to an array and assign the array to the todo items. The await is paired with the async function above.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Waiting for database to reply; checking database collection of todos and looking for elements that match 'completed:false'.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //we have the data! Time to send the client the goods
    // db.collection('todos').find().toArray() //finding the todos and put into an array in only one connection here then filter them
    // .then(data => { //and then taking the data like line 26
    //     db.collection('todos').countDocuments({completed: false}) //finding the number of not completed tasks by counting the data that is false
    //     .then(itemsLeft => { // take that data from line 31
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //
    //     })
    // })//difference between this and the uncommented? commented only has one connection. Data gets filtered, and once it's split, we're sending only the items left. Whereas uncommented gets all the data in line 26 and then again in line 27. But we already have the data, so it'll be slower.
    // .catch(error => console.error(error)) // if we hit an error it lets us know (second half of the try/catch)
})

app.post('/addTodo', (request, response) => { //both the update and create from the CRUD. It's saying that for every post, stuff gets done to it and for every request there is a response.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //no validation! no sanitizing of inputs! not so great. add a new item/docment to our todo list on database; insert in the body of the todoItem and automatically set it to false for completed
    .then(result => { //
        console.log('Todo Added') //let us know that we successfully added a todo
        response.redirect('/') //go back to the route screen/homepage
    })
    .catch(error => console.error(error))//ut oh! here's the error we got.
})

app.put('/markComplete', (request, response) => { //PUT request to update some things on our database. (Put updates, post adds/replaces)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change the todo
        $set: { //set variable to specific value using the $set operator from mongo to change the completed key to true
            completed: true //mark it as complete/true
          }
    },{
        sort: {_id: -1},//sorting by ID in the database, and the order is set to descending (-1) (vs 1 which is ascending) Biggest id to smallest id (where biggest would be newest)
        upsert: false //update + insert = upsert; updates the rendering so you don't double add stuff 
    })
    .then(result => { //second do: marking as complete in console and sending to json
        console.log('Marked Complete') //let us know it worked by printing in console log
        response.json('Marked Complete') //lets the client know that it worked
    })
    .catch(error => console.error(error)) //if there's an error, console logging the error

})

app.put('/markUnComplete', (request, response) => { //PUT request (update) to update one item in the todo list
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //selecting the 'todos' collection from our db and updating one item (object: key = thing, value = item FromJs)
        $set: { //$ tells you it's an operator and not just a property. 
            completed: false //item not completed, so marked as false
          }
    },{
        sort: {_id: -1}, //using mongo sort method to sort by id. -1 means we're getting the latest first
        upsert: false //don't add a double
    }) //when this promise is completed, we console log 'marked as INcomplete' and send the same as json
    .then(result => { //sets up result in case we want to use it later but we don't use it now
        console.log('Marked Complete') //SHOULD BE 'MARKED INCOMPLETE'? let us know it worked
        response.json('Marked Complete') //SHOULD BE 'MARKED INCOMPLETE'? let client know it worked
    })
    .catch(error => console.error(error)) //hey fam, logging we got issues!

})

app.delete('/deleteItem', (request, response) => { //delete an item, get a response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //the thing we're deleting is the body from ItemFromJs
    .then(result => {//again, result in case we want it later
        console.log('Todo Deleted') //yay it worked - sends to server
        response.json('Todo Deleted') // yay it worked! send to client
    })
    .catch(error => console.error(error)) //oop there's an error.

})

app.listen(process.env.PORT || PORT, ()=>{ //we listen to the PORT! first thing we declared lol. First one's for heroku's set one or else (the ||) use the one we declared on line 4
    console.log(`Server running on port ${PORT}`) // //server lets us know we are connected! woop.
})