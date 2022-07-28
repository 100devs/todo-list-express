// Looks for classes and elements specified in parentheses.
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Calls deleteItem() function on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Calls markComplete() on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Calls markUnComplete() on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// async takes function from normal flow of loop to await, so it doesnt stop render
async function deleteItem(){ // async enables promise 
    const itemText = this.parentNode.childNodes[1].innerText // from this item, grab text from second child
    try{ // try this
        const response = await fetch('deleteItem', { // await till fetch is completed
            method: 'delete',   // delete method
            headers: {'Content-Type': 'application/json'}, // the json text
            body: JSON.stringify({ //
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // await response from server
        console.log(data)
        location.reload() // reload page

    }catch(err){ // catch error
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // from item grab text from second child
    try{ // attempt this
        const response = await fetch('markComplete', {
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'}, // define what type of data
            body: JSON.stringify({ // turn inserted value to json
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) // print data in log
        location.reload() // refresh page

    }catch(err){
        console.log(err) // logs error if there is one
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // wait for response
        console.log(data)
        location.reload() // refresh page

    }catch(err){
        console.log(err) // log error
    }
}