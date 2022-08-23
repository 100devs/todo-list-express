const deleteBtn = document.querySelectorAll('.fa-trash')  //creates variable for delete button Trash Can Icon
const item = document.querySelectorAll('.item span')  //creates variable to select all the spans within the class item in the ejs file
const itemCompleted = document.querySelectorAll('.item span.completed') //creates variable for items with the class completed

Array.from(deleteBtn).forEach((element)=>{ //adds an event listener each Trash Can icon wired to deleteItem function
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //adds an event listener that marks an item complete on click
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //adds an event listener that marks an item uncomplete on click
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //declares function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //assigns a variable itemText to the innerText of the li, to the itemText constant
    try{
        const response = await fetch('deleteItem', {//uses the route deleteItem from the server.js
            method: 'delete', //uses the delete method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //puts the JSON into a string
              'itemFromJS': itemText //itemFromJS is the text in the li, which we set to itemText
            })
          })
        const data = await response.json()
        console.log(data) // log data to console
        location.reload()  //refresh

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){ //declares function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //assigns a variable itemText from the ul.li innertext
    try{
        const response = await fetch('markComplete', { //uses the route markComplete from the server.js
            method: 'put',  //uses the put method to update 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //parses the JSON into a string
                'itemFromJS': itemText //itemFromJS is given value from text in the li, which we set to temText
            })
          })
        const data = await response.json()
        console.log(data) // log data to console
        location.reload()  //refresh

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){ //declares function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //assigns a variable itemText from the ul.li innertext
    try{
        const response = await fetch('markUnComplete', { //uses the route markComplete from the server.js
            method: 'put', //uses the put method to update 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //parses the JSON into a string
                'itemFromJS': itemText //itemFromJS is given value from text in the li, which we set to temText
            })
          })
        const data = await response.json()
        console.log(data) // log data to console
        location.reload()// refresh

    }catch(err){
        console.log(err)
    }
}