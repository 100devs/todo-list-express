const deleteBtn = document.querySelectorAll('.fa-trash') // storing the trash can button in the ejs file into the variable deleteBtn
const item = document.querySelectorAll('.item span') // storing the items in spans in the variable item
const itemCompleted = document.querySelectorAll('.item span.completed') // storing the items in the span that are also in completed classes inside the variable itemCompleted

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item and if it gets clicked on then it runs the function deleteItem
})

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)//adding an event listener to the current item and if it gets clicked on then it runs the function markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adding an event listener to the current item and if it gets clicked on then it runs the function markUncomplete
})

async function deleteItem(){ //declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText 
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
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item to extract the text value only of the specified list item
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