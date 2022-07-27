
// targeting all of the trash icon elems 
const deleteBtn = document.querySelectorAll('.fa-trash')

// targets <span> tags where parent has class='item'
const item = document.querySelectorAll('.item span')

// tagetting all <span> tags with the class of completed where the parent has the class of item
const itemCompleted = document.querySelectorAll('.item span.completed')


// create anm array from the queryselectorall results, 
// loop through all, and add a click event listener 
// that fires off that deleteItem function 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create anm array from the queryselectorall results, 
// loop through all, and add a click event listener 
// that fires off that markComplete function 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create anm array from the queryselectorall results, 
// loop through all, and add a click event listener 
// that fires off that markUnßComplete function 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function to delete elems
async function deleteItem(){
    // grabs 1st item inside <li> w/ class of completed and delets it
    // sets headers to expect JSON response, and the itemText var
    // contents in the body
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends DELETE request to the deleteItem endpoint, 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // waiting for JSON response and parses it => console
        const data = await response.json()
        console.log(data)
        // reloads page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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