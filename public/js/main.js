const deleteBtn = document.querySelectorAll('.fa-trash') //Create const var delete button with trashcan icon
const item = document.querySelectorAll('.item span') //Create const item var to store all spans .item (class)
const itemCompleted = document.querySelectorAll('.item span.completed') //create const itemCompleted var to store all spans with class of .item & span.completed

Array.from(deleteBtn).forEach((element)=>{  //create an array from deleteBtn
    element.addEventListener('click', deleteItem) //add event listener. When there is a click, deleteItem
})

Array.from(item).forEach((element)=>{ //this creates an item array
    element.addEventListener('click', markComplete) //this marks the click event complete
})

Array.from(itemCompleted).forEach((element)=>{ //this creates an item array
    element.addEventListener('click', markInComplete) //this marks the click event InComplete. I changed spelling from markUnComplete to markInComplete
})

async function deleteItem(){ //create an async delete function
    const itemText = this.parentNode.childNodes[1].innerText //declare const var to hold text from clicked span
    try{
        const response = await fetch('deleteItem', { //fetch request and store the response
            method: 'delete',  //type of method
            headers: {'Content-Type': 'application/json'}, //headers
            body: JSON.stringify({  //convert object to string-stringify it baby!
              'itemFromJS': itemText //converted item sent to server
            })
          })
        const data = await response.json() //let us (a)wait for json response from server
        console.log(data) //console log the data
        location.reload() //reload window to show all non-deleted items

    }catch(err){  //catch err - catch any errors
        console.log(err)  //log errors in the console.
    }
}

async function markComplete(){ //create am async function to markComplete
    const itemText = this.parentNode.childNodes[1].innerText  //grab text from span, then store in var itemText
    try{
        const response = await fetch('markComplete', { //(a)wait fetch req to markComplete path
            method: 'put', //this is the method type to update
            headers: {'Content-Type': 'application/json'}, //defin the type of content to show
            body: JSON.stringify({ //convert to a string
                'itemFromJS': itemText  //item sent to markComplete path
            })
          })
        const data = await response.json() //let us (a)wait for json response from server
        console.log(data) //console log the data
        location.reload() //reload page to show changes

    }catch(err){ //catch err - catch any errors
        console.log(err) //log errors in the console.
    }
}

async function markInComplete(){ // mark item as incomplete if already clicked complete. I changed spelling from markUnComplete to markInComplete
    const itemText = this.parentNode.childNodes[1].innerText //get text from span
    try{
        const response = await fetch('markInComplete', {  // send to markInComplete path. I changed spelling from markUnComplete to markInComplete
            method: 'put', //update method
            headers: {'Content-Type': 'application/json'}, //header to show content
            body: JSON.stringify({ //convert to a string
                'itemFromJS': itemText //item to sent to markInComplete path
            })
          })
        const data = await response.json() //let us (a)wait for json response from server
        console.log(data) //console log the data
        location.reload() //reload page to show changes

    }catch(err){ //catch err - catch any errors
        console.log(err) //log errors in the console.
    }
}