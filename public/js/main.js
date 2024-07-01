const deleteBtn = document.querySelectorAll('.fa-trash') // targets all icons with trash
const item = document.querySelectorAll('.item span') // targets all spans with class item
const itemCompleted = document.querySelectorAll('.item span.completed') // targets same as above but with completed class

Array.from(deleteBtn).forEach((element)=>{ //calls deleteItem when deleteBtn is clicked
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // calls markComplete when clicked
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //calls markUnComplete when item is completed and marks it incomplete
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ // async calls deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // item's childNode's innerText
    try{
        const response = await fetch('deleteItem', { // calls fetch to delete item
            method: 'delete', // tells method
            headers: {'Content-Type': 'application/json'}, // using json
            body: JSON.stringify({ 
              'itemFromJS': itemText//tells which item to delete (itemText)
            })
          })
        const data = await response.json() // awaits response
        console.log(data) // consoles data
        location.reload() // reloads page

    }catch(err){ // throws error if caught
        console.log(err)
    }
}

async function markComplete(){ // async function to mark complete
    const itemText = this.parentNode.childNodes[1].innerText // item's childNode's innerText
    try{
        const response = await fetch('markComplete', { // calls fetch to mark complete
            method: 'put', //uses put method
            headers: {'Content-Type': 'application/json'},  // using json
            body: JSON.stringify({
                'itemFromJS': itemText //tells which item to update (itemText)
            })
          })
        const data = await response.json() // awaits response
        console.log(data) // consoles data
        location.reload() // reloads page

    }catch(err){ // throws error if caught
        console.log(err)
    }
}

async function markUnComplete(){ // async function to mark uncomplete
    const itemText = this.parentNode.childNodes[1].innerText // item's childNode's innerText
    try{ 
        const response = await fetch('markUnComplete', {// calls fetch to mark uncomplete
            method: 'put', // uses put method to update
            headers: {'Content-Type': 'application/json'}, // using json
            body: JSON.stringify({
                'itemFromJS': itemText //tells which item to update (itemText)
            })
          })
        const data = await response.json() // awaits response
        console.log(data) // consoles data
        location.reload() // reloads page


    }catch(err){ // throws error if caught
        console.log(err)
    }
}