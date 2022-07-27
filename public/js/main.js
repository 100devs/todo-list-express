const deleteBtn = document.querySelectorAll('.fa-trash')
//create deleteBtn variable that applies to every item with trash can icon
const item = document.querySelectorAll('.item span')
//create item variable that applies to every item with class of item span
const itemCompleted = document.querySelectorAll('.item span.completed') 
//create item variable that stores all items with item span and completed class

Array.from(deleteBtn).forEach((element)=>{
    //creates an array from the deleteBtn variable
    element.addEventListener('click', deleteItem) 
    //adds event listeners to each item
})

Array.from(item).forEach((element)=>{
    //creates an array from the item variable
    element.addEventListener('click', markComplete)
    //adds event listeners to each item
})

Array.from(itemCompleted).forEach((element)=>{
    //creates an array from the itemCompleted variable
    element.addEventListener('click', markUnComplete)
    //adds event listeners to each item
})

async function deleteItem(){ //async function to delete an item
    const itemText = this.parentNode.childNodes[1].innerText
    //get text from the span user clicks, store in variable
    try{
        const response = await fetch('deleteItem', {
            //make fetch request and store response in variable
            method: 'delete', //method type
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //converts js value to json string
              'itemFromJS': itemText //item being converted and sent to server
            })
          })
        const data = await response.json() //gets response from server as json
        console.log(data) //log data to console
        location.reload() //reload window to re render items

    }catch(err){ //catch errors
        console.log(err)
    }
}

async function markComplete(){ //async function to mark complete an item
    const itemText = this.parentNode.childNodes[1].innerText
    //get text from the span user clicks, store in variable
    try{
        const response = await fetch('markComplete', {
            //make fetch request and store response in variable
            method: 'put', //method type
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //converts js value to json string
                'itemFromJS': itemText //item being converted and sent to server
            })
          })
        const data = await response.json()
        //gets response from server as json
        console.log(data) //log data to console
        location.reload() //reload window to re render items

    }catch(err){ //catch errors
        console.log(err)
    }
}

async function markUnComplete(){ //async function to mark uncomplete an item
    const itemText = this.parentNode.childNodes[1].innerText
    //get text from the span user clicks, store in variable
    try{
        const response = await fetch('markUnComplete', {
            //make fetch request and store response in variable
            method: 'put', //method type
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //converts js value to json string
                'itemFromJS': itemText //item being converted and sent to server
            })
          })
        const data = await response.json()
        //gets response from server as json
        console.log(data) //log data to console
        location.reload() //reload window to re render items

    }catch(err){ //catch errors
        console.log(err)
    }
}