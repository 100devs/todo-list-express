const deleteBtn = document.querySelectorAll('.fa-trash') //create constant 'deleteBtn' to call all DOM elements with class 'fa-trash'
const item = document.querySelectorAll('.item span') //create constant 'item' to call all DOM elements with class 'item' and child 'span'
const itemCompleted = document.querySelectorAll('.item span.completed') //create constant 'itemCompleted' to call DOM elements with with class 'item' and child 'span' with class 'completed'

Array.from(deleteBtn).forEach((element)=>{ //run a for loop through an array composed of the elements called/held by 'deleteBtn'
    element.addEventListener('click', deleteItem) //add an eventListener 'click' to each item in the created array to run the function 'deleteItem'
})

Array.from(item).forEach((element)=>{ //run a for loop through an array composed of the elements called/held by 'item'
    element.addEventListener('click', markComplete) //add an eventListener 'click' to each item in the created array to run the function 'markComplete'
})

Array.from(itemCompleted).forEach((element)=>{ //run a for loop through an array composed of the elements called/held by 'itemCompleted'
    element.addEventListener('click', markUnComplete) //add an eventListener 'click' to each item in the created array to run the function 'markUnComplete'
})

async function deleteItem(){ //declare async function 'deleteItem()'
    const itemText = this.parentNode.childNodes[1].innerText //create constant 'itemText' with path to the text of entered item 'this'
    try{ // try block
        const response = await fetch('deleteItem', { //create constant 'response' to fetch and wait for results of server route 'deleteItem' and create object literal
            method: 'delete', //set method 'delete'
            headers: {'Content-Type': 'application/json'}, //create key-value pair declaring content type to JSON
            body: JSON.stringify({ //translate 'JSON' to regular javascript
              'itemFromJS': itemText //create key-value pair to call the information from 'itemText'
            })
          })
        const data = await response.json() //create constant 'data' to call and wait for the conversion to JSON
        console.log(data) //console log the above constant
        location.reload() //reload page to show change

    }catch(err){ //start catch block to log any errors from try block above in the console
        console.log(err)
    }
}

async function markComplete(){ //declare async function 'markComplete()'
    const itemText = this.parentNode.childNodes[1].innerText  //create constant 'itemText' with path to the text of entered item 'this'
    try{ // try block
        const response = await fetch('markComplete', { //create constant 'response' to fetch and wait for results of server route 'markComplete' and create object literal
            method: 'put', //set method 'put'
            headers: {'Content-Type': 'application/json'}, //create key-value pair declaring content type to JSON
            body: JSON.stringify({ //translate 'JSON' to regular javascript
                'itemFromJS': itemText //create key-value pair to call the information from 'itemText'
            })
          })
        const data = await response.json() //create constant 'data' to call and wait for the conversion to JSON
        console.log(data) //console log the above constant
        location.reload() //reload page to show change

    }catch(err){ //start catch block to log any errors from try block above in the console
        console.log(err)
    }
}

async function markUnComplete(){ //declare async function 'markUnComplete()'
    const itemText = this.parentNode.childNodes[1].innerText //create constant 'itemText' with path to the text of entered item 'this'
    try{ // try block
        const response = await fetch('markUnComplete', { //create constant 'response' to fetch and wait for results of server route 'markUnComplete' and create object literal
            method: 'put', //set method 'put'
            headers: {'Content-Type': 'application/json'}, //create key-value pair declaring content type to JSON
            body: JSON.stringify({ //translate 'JSON' to regular javascript
                'itemFromJS': itemText //create key-value pair to call the information from 'itemText'
            })
          })
        const data = await response.json() //create constant 'data' to call and wait for the conversion to JSON
        console.log(data) //console log the above constant
        location.reload() //reload page to show change

    }catch(err){ //start catch block to log any errors from try block above in the console
        console.log(err)
    }
}