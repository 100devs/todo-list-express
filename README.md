## Description
A full stack web application that supports local account creation. Each registered user may post & store their own individual to-do tasks that describe the task, due date, & priority. Tasks may be marked as uncomplete, completed or deleted entirely. This web application is completely responsive across all device viewports.

The project is deployed here: https://salty-castle-61426.herokuapp.com/

## Demo
![demo](todomvcauthdemo.gif)

## Features
* MVC Architecture
* Local account creation using passport-local strategies
* Individual posts with additional fields describing the task.
* Accounts & Posts are stored into a database (long-term memory).
* Completely responsive across all viewports.

## Lessons learned
I have built many iterations of the to-do list. This project is my most advanced form of the to-do list.

I had FUN building this project because I took two different approaches:
I have always built responsive web pages-- this time I tried the `mobile-first` approach AND IT IS SO MUCH EASIER & I SHOULD HAVE BEEN BUILDING THIS WAY FROM THE BEGINNING. THIS WOULD HAVE SAVED ME SO MUCH TIME. WHY DID I WAIT SO LONG?!?
I used the `Materialize-CSS` framework to style my pages, and just going through the documentation & trying EVERYTHING made me eager to build. I wanted to use everything and I can't wait until my next project to test even more components!!

## Technologies
<img src="https://profilinator.rishav.dev/skills-assets/html5-original-wordmark.svg" alt="HTML5" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/css3-original-wordmark.svg" alt="CSS3" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/javascript-original.svg" alt="JavaScript" height="40" /><img src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="NodeJS" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" alt="MongoDB" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/express-original-wordmark.svg" alt="ExpressJS" height="50" />
<img src="https://img.shields.io/badge/Materialize--CSS-ee6e73?style=for-the-badge&logoColor=white" alt="MaterializeCSS"/>
<img src="https://img.shields.io/badge/Mongoose.js-8A0403?style=for-the-badge&logoColor=white" alt="MongooseJS"/>
<img src="https://profilinator.rishav.dev/skills-assets/git-scm-icon.svg" alt="Git" height="50" />

## Optimizations
* Multiple `.completed` classes invoke both `markComplete` & `markIncomplete` functions. Both functions send PUT requests.
* Edit button.
* Sorting (by priority) functionality.
* Add Passport-Google-OAuth-20 to support gmail/google account creation/login.
## OLD PROJECT README BELOW

## Description
A full stack web application that posts & stores to-do tasks. You may mark a task as completed, delete a task entirely, or mark completed tasks as uncomplete.

The (UPDATED) project is deployed here: https://salty-castle-61426.herokuapp.com/

## Demo
![demo](todolistdemo.gif)

## Features
* Executes POST, GET, PUT, and DELETE operations.
* Displays variable data using (EJS) Embedded JavaScript.

## Technologies
<img src="https://profilinator.rishav.dev/skills-assets/html5-original-wordmark.svg" alt="HTML5" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/css3-original-wordmark.svg" alt="CSS3" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/javascript-original.svg" alt="JavaScript" height="40" /><img src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="NodeJS" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" alt="MongoDB" height="50" /><img src="https://profilinator.rishav.dev/skills-assets/git-scm-icon.svg" alt="Git" height="50" />

## Optimizations
* I want to add be able to edit task text.
