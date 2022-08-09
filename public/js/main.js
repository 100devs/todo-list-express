const deleteBtn = document.querySelectorAll('.fa-trash') //create variable delete button from fontawesome
const item = document.querySelectorAll('.item span') //creates item variable from spans within the item class parent
const itemCompleted = document.querySelectorAll('.item span.completed') //creates itemCompleted variable from completed spans within the item parent

Array.from(deleteBtn).forEach((element)=>{ //create array from selection, then for each item, listen for a click, on click calls "deleteItem" function
    element.addEventListener('click', deleteItem)
})//close function

Array.from(item).forEach((element)=>{//create array from selection, then for each item, listen for a click, on click calls "markComplete" function
    element.addEventListener('click', markComplete)
})//close function

Array.from(itemCompleted).forEach((element)=>{//create array from selection, then for each item, listen for a click, on click calls "markUnComplete" function
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //create async function "deleteItem"
    const itemText = this.parentNode.childNodes[1].innerText //create variable itemText and grabbing the innerText of the specific list item
    try{//begin try/catch block
        const response = await fetch('deleteItem', { // create "response" variable that waits on a fetch to get result from deleteItem
            method: 'delete', //tells us the CRUD method is delete
            headers: {'Content-Type': 'application/json'}, //setting headers so JSON data can be read correctly
            body: JSON.stringify({ //setting headers so JSON data can be read correctly
              'itemFromJS': itemText //setting itemFromJS in the body to itemText variable from above
            })//closing things
          }) //closing more things
        const data = await response.json() //wait for the JSON response from server
        console.log(data) //console log what we get back from the server
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //catch an error
        console.log(err) //if error happens, log it to the console
    }//close catch block
}//close function

async function markComplete(){ //create asyn function markComplete
    const itemText = this.parentNode.childNodes[1].innerText//create variable itemText and grabbing the innerText of the specific list item
    try{//begin try/catch block
        const response = await fetch('markComplete', {// create "response" variable that waits on a fetch to get result from markComplete
            method: 'put', //tells us which CRUD method to use: put
            headers: {'Content-Type': 'application/json'},//setting headers so JSON data can be read correctly
            body: JSON.stringify({//setting headers so JSON data can be read correctly
                'itemFromJS': itemText//setting itemFromJS in the body to itemText variable from above
            })//close some things
          }) //close some more things
          const data = await response.json() //wait for the JSON response from server
          console.log(data) //console log what we get back from the server
          location.reload() //reloads the page to update what is displayed

        }catch(err){ //catch an error
            console.log(err) //if error happens, log it to the console
        }//close catch block
    }//close function

    //below function has almost identical syntax and functionality of above two.
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