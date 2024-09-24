//find all of the elements with the class of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//find all the spans that are children of an element with the item class
const item = document.querySelectorAll('.item span')
//find all the spans with class completed that are children of an element with the item class
const itemCompleted = document.querySelectorAll('.item span.completed')

//gives every deleteBtn the ability to run deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//gives every item the ability to run markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//gives every itemCompleted the ability to run markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //go to the parentNode ang get inner text from first child
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //make fetch request to deleteItem path as a delete and convert the object holding itemText value to JSON
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //store server response
        const data = await response.json()
        //console log the server response
        console.log(data)
        //refresh the page
        location.reload()

    }catch(err){
        //console log the error
        console.log(err)
    }
}

async function markComplete(){
    //grabbing the toDo item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //make a fetch request to the markComplete path as a put and convert the object holding itemText value to JSON
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //store the server response
        const data = await response.json()
        //console log the server response
        console.log(data)
        //reload the page
        location.reload()

    }catch(err){
        //console log the error
        console.log(err)
    }
}

async function markUnComplete(){
    //grab toDo item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //make a fetch request to the markUnComplete path as a put and convert the object to JSON
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //store the server response
        const data = await response.json()
        //console log the server response
        console.log(data)
        //refresh the page
        location.reload()

    }catch(err){
        //console log the error
        console.log(err)
    }
}