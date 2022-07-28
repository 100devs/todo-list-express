//server functionality: 
//this server works as a saveable journal for exercises, their weight, with reps and sets
//for example: a client can save their
//      exercise: 'bench press'
//      weight (in lb or kg): 150
//      reps: 10
//      sets: 4

//the exercises will be saved to a MongoDB collection for clients to come back to 

const express = require('express') //express module + methods
const app = express()
const MongoClient = require('mongodb').MongoClient //database module + methods
const PORT = 2001 
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'work-out'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true})
    .then(client => {
        console.log(`Now connected to the ${dbName} database.`)
        db = client.db(dbName)
    })


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    db.collection('exercises').find().toArray() //cannot read collection -- need to fix this issue. can it be network issues? WiFi whitelisting?
        .then( data => {
            
            res.render('index.ejs', {info: data})
        }).catch(error => console.error(error))
})

app.post('/addExercise', (req, res) => {
    console.log(req)
    db.collection('exercises').insertOne(
    req.body 
        )
        .then(result => {
           
            console.log('Exercise added successfully.')
            res.redirect('/')
        }).catch(error => console.error(error))
})

// app.put('/addUpvote', (req, res) => {
//     db.collection('exercises').updateOne(
//         {exercise: req.body.exerciseS},
//         {$set: {upvotes: req.body.upvotesS +1}},
//         {sort: {_id: -1}, upsert: true})
//     .then( result => {
//         console.log('One exercise upvoted')
//         response.json('Upvote applied')
//         }).catch( error => console.error(error))
// })


app.put('/', (req, res) => {
    db.collection('exercises')
      .updateOne(
        { _id: new ObjectId(req.body.id) },
        // { $set: { taskDescription: req.body.taskDescription } }
      )
      .then((data) => {
        return res.send(
          db.collection('exercises').findOne({ _id: new ObjectId(req.body.id) })
        )
      })
  })

app.delete('/deleteExercise', (req, res) => {
db.collection('exercises').deleteOne({
    exercise: req.body.exerciseS
})
        .then(result =>{
            console.log('Exercise Deleted')
            res.json('Exercise Deleted')
        })
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on wave ${PORT}`)
})
