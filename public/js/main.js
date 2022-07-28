// creates const to hold the delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
// create const to hold all the to do items
const item = document.querySelectorAll('.item span')
// creates const to hold only completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

// adds event listener to run the deleteItem function anytime the user clicks any delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// adds event listener to run the function markComplete on any item in the to do list the user clicks on
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// if user click a completed item, run the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// when user clicks a delete button this function is ran
async function deleteItem(){
    // gets the text of the to do item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // attempts to delete the to do item from the JSON
        const response = await fetch('deleteItem', {
            // delete will remove the item
            method: 'delete',
            // header is set so browser knows it is working with JSON
            headers: {'Content-Type': 'application/json'},
            // body of request will take item text, turn it in to JSON string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // async function need to wait for the promise to resolve
        const data = await response.json()
        // print the result to the console
        console.log(data)
        // reload this section of the list so the deleted item is no longer displayed
        location.reload()

    // if we are not able to delete it, log the error
    }catch(err){
        console.log(err)
    }
}

// this function handles marking items as completed
async function markComplete(){
    // gets text of the item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put', // put will update the existing item
            headers: {'Content-Type': 'application/json'}, // header is used to tell browser it is dealing with JSON
            body: JSON.stringify({ //converts following text into JSON
                'itemFromJS': itemText
            })
          })
          
        const data = await response.json() // when the fetch promise returns, put the value into the data const
        console.log(data) // log the data
        location.reload() // reload that part of the page

    }catch(err){ // if you can't update the item, show the error
        console.log(err)
    }
}

// mark the item as no longer complete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get text of item
    try{
        // use fetch to update the item
        // same basic prinicple as above
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