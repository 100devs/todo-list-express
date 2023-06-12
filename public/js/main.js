const deleteBtn = document.querySelectorAll('.fa-trash') //creates deleteBtn variable and assigns to all elements with fa-trash class
const item = document.querySelectorAll('.item span') //creates item variable and assigns to all span tags inside elements with item class
const itemCompleted = document.querySelectorAll('.item span.completed') //creates itemCompleted variable and assigns to all spans with completed class - spans are inside elements with item class

Array.from(deleteBtn).forEach((element)=>{ //creates array from selection and starts a forEach loop
    element.addEventListener('click', deleteItem)
}) //adds event listener to current item - listens for a click and then calls deleteBtn function

Array.from(item).forEach((element)=>{ //creates array from selection and starts a forEach loop
    element.addEventListener('click', markComplete)
}) //adds event listener to current item - listens for click and then calls markComplete function

Array.from(itemCompleted).forEach((element)=>{ //creates array from selection and starts a forEach loop
    element.addEventListener('click', markUnComplete)
}) //adds event listener to completed items - listens for click and then calls markUncomplete function

async function deleteItem(){ //async function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //variable that gets the text from inside of the list item
    try{
        const response = await fetch('deleteItem', { //response variable waits for fetch data from deleteItem function result
            method: 'delete', //delete CRUD method
            headers: {'Content-Type': 'application/json'}, //JSON content expected
            body: JSON.stringify({ //sets body value to stringify message content
              'itemFromJS': itemText //sets content type of body to inner text from list item
            })
          })
        const data = await response.json() //waits for JSON from response
        console.log(data) //logs result to console
        location.reload() //refreshes the page and updates

    }catch(err){ //catches errors 
        console.log(err) //logs error to console
    }
}

async function markComplete(){ //async function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //variable that gets the text from inside of the list item
    try{
        const response = await fetch('markComplete', { //response variable that gets the text from inside of the list item
            method: 'put', //put CRUD method
            headers: {'Content-Type': 'application/json'}, //JSON content expected
            body: JSON.stringify({ //sets body value to stringify message content
                'itemFromJS': itemText //sets content type of body to inner text from list item
            })
          })
        const data = await response.json() //waits for JSON from response
        console.log(data) //logs result to console
        location.reload() //refreshes the page and updates

    }catch(err){ //catches errors
        console.log(err) //logs error to console
    }
}

async function markUnComplete(){ //async function markUncomplete
    const itemText = this.parentNode.childNodes[1].innerText //variable that gets the text from inside of the list item
    try{
        const response = await fetch('markUnComplete', { //response variable that gets the text from inside of the list item
            method: 'put', //put CRUD method
            headers: {'Content-Type': 'application/json'}, //JSON content expected
            body: JSON.stringify({ //sets body value to stringify message content
                'itemFromJS': itemText //sets content type of body to inner text from list item
            })
          })
        const data = await response.json() //waits for JSON from response
        console.log(data) //logs result to console
        location.reload() //refreshes the page and updates

    }catch(err){ //catches errors
        console.log(err) //logs error to console
    }
}