const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable storing all tags with class .fa-trash in the  variable
const item = document.querySelectorAll('.item span') //creating a variable storing all span tags with class .item in the variable
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable storing all  spans with .completed tags within tags with class .item in the variable 

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', deleteItem) // Adding an event listener to run the deleteItem function when the tag is clicked.
}) // Ending forEach

Array.from(item).forEach((element)=>{ // Creating an array from the variable item, and calling each item in the array as an element
    element.addEventListener('click', markComplete)// Adding an event listener to run the markComplete function when the tag is clicked.
}) // Ending forEach

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', markUnComplete) // Adding an event listener to run the itemCompleted function when the tag is clicked.
}) // Ending forEach

async function deleteItem(){ // async function declared and named deleteItem, no parameters used.
    const itemText = this.parentNode.childNodes[1].innerText //declare variable and store inputted text contained in the second child node of a parent node
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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