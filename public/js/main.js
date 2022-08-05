const deleteBtn = document.querySelectorAll('.fa-trash') // grabs all elements with class set to "fa-trash" and assigns it to variable deleteBtn
const item = document.querySelectorAll('.item span') // grabs all span elements with a parent element that has the class set to "item" and assigns it to variable item
const itemCompleted = document.querySelectorAll('.item span.completed') // grabs all span elements with a class of completed with a parent element that has the class set to "item" and assigns it to variable itemCompleted


Array.from(deleteBtn).forEach((element)=>{ // create array from deleteBtn and go through each element
    element.addEventListener('click', deleteItem) // add event listener that waits for 'click' and then runs deleteItem function
})
Array.from(item).forEach((element)=>{ // create array from item and go through each element
    element.addEventListener('click', markComplete) // add event listener that waits for 'click' and then runs markComplete function
})
Array.from(itemCompleted).forEach((element)=>{ // create array from item and go through each element
    element.addEventListener('click', markUnComplete) // add event listener that waits for 'click' and then runs markUnComplete function
})

async function deleteItem(){ // initiates function when event listener on deleteBtn is heard
    const itemText = this.parentNode.childNodes[1].innerText // where the click is done, we look in parentNode > childNode[1] to grab the inner text and assign to variable itemText
    try{ // try statement block
        const response = await fetch('deleteItem', { // will send request to route: deleteItem on server as well as the object defined below
            method: 'delete', // method to run is delete
            headers: {'Content-Type': 'application/json'}, // what type of content will be sent
            body: JSON.stringify({ // to turn the data into json
              'itemFromJS': itemText // itemText variable passed into request's body parameters as 'itemFromJS' variable
            }) 
          }) 
        const data = await response.json() // turn response into json and set it as the data variable
        console.log(data) // console log the response
        location.reload() // refresh the window
    }catch(err){ // this catch runs if try statement above fails
        console.log(err) // console log error 
    }
}

async function markComplete(){ // initiates function when event listener on item is heard
    const itemText = this.parentNode.childNodes[1].innerText // where the click is done, we look in parentNode > childNode[1] to grab the inner text and assign to variable itemText
    try{ // try statement block
        const response = await fetch('markComplete', { // will send request to route: markComplete on server as well as the object defined below
            method: 'put', // method to run is put
            headers: {'Content-Type': 'application/json'}, // what type of content will be sent
            body: JSON.stringify({ // to turn the data into json
                'itemFromJS': itemText // itemText variable passed into request's body parameters as 'itemFromJS' variable
            })
          })
        const data = await response.json() // turn response into json and set it as the data variable
        console.log(data) // console log the response
        location.reload() // refresh the window
    }catch(err){ // this catch runs if try statement above fails
        console.log(err) // console log error 
    }
}

async function markUnComplete(){ // initiates function when event listener on itemCompleted is heard
    const itemText = this.parentNode.childNodes[1].innerText // where the click is done, we look in parentNode > childNode[1] to grab the inner text and assign to variable itemText
    try{ // try statment block
        const response = await fetch('markUnComplete', { // will send request to route: markComplete on server as well as the object defined below
            method: 'put', // method to run is put
            headers: {'Content-Type': 'application/json'}, // what type of content will be sent
            body: JSON.stringify({ // to turn the data into json
                'itemFromJS': itemText // itemText variable passed into request's body parameters as 'itemFromJS' variable
            })
          })
        const data = await response.json() // turn response into json and set it as the data variable
        console.log(data) // console log the response
        location.reload() // refresh the window
    }catch(err){ // this catch runs if try statement above fails
        console.log(err) // console log error 
    }
}