const deleteBtn = document.querySelectorAll('.fa-trash') //looks for all elements in the dom that have the class fa-trash and stores them in the constant deleteBtn
const item = document.querySelectorAll('.item span') //looks for all elements in the dom that have the class item and looks for spans within this class and stores them in the constant item
const itemCompleted = document.querySelectorAll('.item span.completed') //looks for all elements in the dom that have the class item and looks for spans within that have the class completed and stores them in the constant itemCompleted

Array.from(deleteBtn).forEach((element)=>{   // makes an array from the elements that are stored in the constant deleteBtn and loops through them
    element.addEventListener('click', deleteItem)  // to every element in the array an eventlistener is added that listens to a click and runs the function deleteItem after a click  
})

Array.from(item).forEach((element)=>{ // makes an array from the elements that are stored in the constant item and loops through them
    element.addEventListener('click', markComplete) // to every element in the array (uncompleted tasks) an eventlistener is added that listens to a click and runs the function markComplete after a click 
})

Array.from(itemCompleted).forEach((element)=>{ // makes an array from the elements that are stored in the constant itemCompleted and loops through them
    element.addEventListener('click', markUnComplete) // to every element in the array (completed tasks) an eventlistener that listens to a click and runs the function markUnComplete after a click 
})

async function deleteItem(){  // creates an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText  // declares a constant itemText and stores the text of 
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