const deleteBtn = document.querySelectorAll('.fa-trash') //create deleteBtn variable that applies to every item with the trash can icon
const item = document.querySelectorAll('.item span') // create item variable that stores all spans with class of .item
const itemCompleted = document.querySelectorAll('.item span.completed') // create item variable that stores all spans with class of .item and .completed

Array.from(deleteBtn).forEach((element)=>{ //create an array from deleteBtn variable
    element.addEventListener('click', deleteItem) //add a click event listener to each item
})

Array.from(item).forEach((element)=>{ //create an array from item variable
    element.addEventListener('click', markComplete) //add a click event listener to each item
})

Array.from(itemCompleted).forEach((element)=>{//create an array from itemCompleted variable
    element.addEventListener('click', markUnComplete) //add a click event listener to each item
})


async function deleteItem(){ //create async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // get text from the span that is clicked and store in variable
    try{
        const response = await fetch('deleteItem', { // fetch request to deleteItem route
            method: 'delete',  // method type
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ // convert js value to JSON
              'itemFromJS': itemText //item being converted and sent via request to server
            })
          })
        const data = await response.json() // gets response from server as json
        console.log(data) // logs data to console
        location.reload() //reload window to re render items

    }catch(err){ //catch error
        console.log(err)
    }
}


async function markComplete(){ // function to mark item as complete
    const itemText = this.parentNode.childNodes[1].innerText // get text from span and put into variable
    try{
        const response = await fetch('markComplete', { // fetch request sent to markComplete route
            method: 'put', //method type
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({ //turn JS value into JSON object to be sent to the server
                'itemFromJS': itemText // item to be sent to mark complete route
            })
          })
        const data = await response.json() // gets response from server as json
        console.log(data) // logs data to console
        location.reload() //reload window to re render items. Item clicked will be now marked as complete (class applied via EJS)

    }catch(err){ //catch error
        console.log(err)
    }
}

async function markUnComplete(){  // function to mark item as complete
    const itemText = this.parentNode.childNodes[1].innerText // get text from span and put into variable
    try{
        const response = await fetch('markUnComplete', { // fetch request sent to markComplete route
            method: 'put', //method type
            headers: {'Content-Type': 'application/json'},  //headers
            body: JSON.stringify({ //turn JS value into JSON object to be sent to the server
                'itemFromJS': itemText // item to be sent to mark complete route
            })
          })
        const data = await response.json() // gets response from server as json
        console.log(data)  // logs data to console
        location.reload()  //reload window to re render items. Item clicked will be now marked as complete (class applied via EJS)

    }catch(err){ // catch error
        console.log(err)
    }
}

// 