const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span') //the item is the span
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //gave every .item span the ability to markComplete
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)//gave every .item span the ability to markUnComplete
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //parent node == li child node == the span and then grab the text in the span
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', //delete method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText //the string in the span
            })
          })
        const data = await response.json()
        console.log(data)//logs the data in the console
        location.reload() //reload the page

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){ //starts an asynchronus function of markComplete
    const itemText = this.parentNode.childNodes[1].innerText //grabbing text on the todo
    try{
        const response = await fetch('markComplete', { //made request to markComplete
            method: 'put', //with a put request
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //adds it as a string JSON 
                'itemFromJS': itemText //itemFromJS is the text
            })
          })
        const data = await response.json()
        console.log(data)//logs the data in the console
        location.reload() //refresh the page which triggers a get request

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