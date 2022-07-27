//Client side JavaScript.

//Variables storing the selectors .fa-trash, .item, span and span.completed
const deleteBtn = document.querySelectorAll('.fa-trash')//grab all the trash cans.
const item = document.querySelectorAll('.item span') // grabs all spans (uncompleted items)
const itemCompleted = document.querySelectorAll('.item span.completed') // grabs all the completed items

//click event listeners for the delete, completed and uncompleted items in the to-do list

Array.from(deleteBtn).forEach((element)=>{ //add an event listener to all trash cans
    element.addEventListener('click', deleteItem) // whenever we click a trash can we will fire the deleteItem function below.
})

Array.from(item).forEach((element)=>{ // adds an event listener to all list items marked complete
    element.addEventListener('click', markComplete) //fires the markComplete function below
})

Array.from(itemCompleted).forEach((element)=>{ // adds and event listener to all list items marked uncomplete
    element.addEventListener('click', markUnComplete) // fires the markUnComplete function below
})

async function deleteItem(){ 
    const itemText = this.parentNode.childNodes[1].innerText //clicked delete/trash, goes up to the parent and grabs the child nodes and grabs the list item text. 
    try{
        const response = await fetch('deleteItem', { //the deleteItem is the route for the fetch request
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

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //clicked complete, goes up to the parent and grabs the child nodes and grabs the list item text. 
    try{
        const response = await fetch('markComplete', { //the markComplete is the route for the fetch request
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

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //clicked uncomplete, goes up to the parent and grabs the child nodes and grabs the list item text. 
    try{
        const response = await fetch('markUnComplete', { //the markUnComplete is the route for the fetch request
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