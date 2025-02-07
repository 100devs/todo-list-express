# ToDo List - EJS, MongoDB, Node + Express

## Getting Started

1. Go to the [todo-list-express](https://github.com/100devs/todo-list-express) repository and click `Fork` on the top right. This is basically "Save As"ing the project to your own GitHub.
1. In your forked repository, click `Code` -> `HTTPS` -> copy the link
1. Choose a location on your local PC where you want to create a copy of these files to work on.
1. Use the terminal to access that location, and type: `git clone [paste link copied during step 2]`

Now you can work on the code. The assignment is to comment every line. Start with server.js, then move to index.ejs, main.js, and style.css if you want.

## Running the App

> Note: This technically isn't part of the assignment.

### Orginal README said: run `npm install`

- Run `npm install` from the terminal while in your repository's folder.
  - This command goes through the `package.json` file and installs all dependencies listed there so the app can work.

### Original README said: add DB_STRING to .env file

- Create a file called `.env`, and type `DB_STRING=your-MongoDB-connection-string`.
- **Note**: If you need help, follow along with this [article](https://zellwk.com/blog/crud-express-mongodb/#setting-up-mongodb-atlas) to get your connection string.
- Add your connection string to your `.env` file. It should look something like:
  - `DB_STRING=mongodb+srv://...`
  - Continue with your _full connection string_. This is sensitive information, which is why it's being stored in your `.env`, and your `.gitignore` file lists `.env` so that it is not shared to your public github repository.

1. Start the node server by running this command in a terminal within your repository folder: `node server.js`

- **Note**: If running properly, the terminal will state:
  - `Server running on port 2121`
  - `Connected to todo Database`

1. Open the application by going to `http://127.0.0.1:2121/` or `http://localhost:2121/`

- The server is running on port 2121 on your local machine, which has the address of 127.0.0.1 (or localhost) when referring to itself.

## Updates

1. added styling
1. change text at top dynamically if all tasks get completed
1. added dark/light mode toggle

### Todos

- [] update app to use list item ids instead of DOM text to make changes
- [] improve list responsiveness on tiny screens
