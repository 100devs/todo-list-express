/**
 * Name: Todo List Express
 * Description: This app allows you to
 *  - Create todo tasks and store them in MongoDB
 *  - Read through a collection of todo tasks and render todos to DOM
 *  - Update completed todos, display remaining amount of tasks
 *  - Delete completed todos
 * 
 * Input a collection of todo tasks. For every completed task, click on the task, to indicate the task has been completed. To remove a task, click the trashcan icon. Increase your productivity by 10x by using Todo List Express.
 * 
 * @author Leon Noel, Brian Schnee, Erika Teal, Bianca Togonon, Alondra Mora, Lucas Winkler, Alyssha Lewin, Jacob Asper, Dana Lee, Brenden D'Souza, Sebastian Ospina, Jesse Ranon, Alexis Aguilar, Pree Robertson
 */

// select each element with class ".fa-trash"
const deleteBtn = document.querySelectorAll('.fa-trash')
// select each span within an element with class ".item"
const item = document.querySelectorAll('.item span')
// select each span with class ".completed" within an element with class ".item"
const itemCompleted = document.querySelectorAll('.item span.completed')

// add a click event to every rendered elements delete icon
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// add a click event to every rendered element's span that contains todo text
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// add a click event to every element that has a class "completed"
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

/**
 * Name: deleteItem
 * Description: makes a DELETE request to server.js, which will delete a document from our db
 */
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

/**
 * Name: markComplete
 * Description: makes a PUT request to server.js, which will set completed property of db document to false. On page render, a class "completed" will be added to spans that contain todo text. This will add a line through the text and decrease the amount of todo's "Left to do"
 */
async function markComplete(){
    // will select the innerText of the first span 
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        // make a PUT request to our server and pass our itemText in the body of our request
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        // convert the response into json
        const data = await response.json()
        console.log(data)

        // represents the current endpoint, reloads our page (which will fire a new GET request)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

/**
 * Name: markUnComplete
 * Description: makes a PUT request to server.js, which will set completed property of db document to false. This will prevent the "completed" class from being added to todo text span on page render
 */
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}