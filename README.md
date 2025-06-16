# todo-list - Express App

This is a simplified CRUD app for Todo List.
It provides basic functionalities to manage to-do list items including add, delete, and update the status as complete or incomplete. The to-do list items are on a database on MongoDB Atlas for easy access.

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Node, Express, MongoDB Atlas

CRUD app created using Node, Express, MongoDB Atlas. The app functions include -- Create, Read, Update and Delete data that are on a MongoDB Atlas database using Node and Express.

## How to Use:

### Set up & Requirements to Play with it on your local machine

🔑 Clone this repo:

```clone git
git clone https://github.com/100devs/todo-list-express.git
```

🔑 To install requirements:

```
mkdir todo-list
cd todo-list
npm init
npm install express mongodb ejs dotenv --save
```

🔑 Create `.env` file and add `DB_STRING` that is a Connection String to your MongoDB.
For example,

```
echo "DB_STRING = mongodb+srv://<your-user-id>:<your-password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority" > .env
```

**For more information, check out MongoDB Docs on [Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)**

## Lessons Learned:

Learned how to create a simple API that allows users to handle data on MongoDB via creating requests to Post, Get, Put, Delete via server and render results as HTML using EJS engine.
