# "To Do" List Express
This project was forked to practice commenting each line of code to increase my own knowledge. To get the project running, the user will need to fork the code, open the terminal in their source-code editor, and follow these steps:

1. run npm init and hit enter for each prompt
2. run npm install
3. add .env file
4. add their own local PORT number to the .env file
5. add their own MongoDB connection string as DB_STRING to the .env file while making sure to name their database "todo" and collection as "todos" as the server.js will be listening for those specific names
6. run node server.js
7. search localhost:(PORT number) on their browser

## How It's Made

**Tech used:** Embedded JavaScript (EJS), CSS, & JavaScript

My learning is focused on commenting each line of code and updating the README with clear instructions for the user. 

## Optimizations
I would refactor the existing code to improve the overall functionality of the application. When the to do list is running, the use of strikethrough styling to indicate when marked off, completed tasks change back to incomplete tasks sometimes does not show before the auto-refresh. I would also improve the project's styling so that it is more accessible and appealing for the user.  

## Lessons Learned
I learned more about EJS and how it renders out client-side HTML that displays in the DOM.