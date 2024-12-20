//select all the classes labelled with fa-trash and hold them in the set var
const deleteBtn = document.querySelectorAll('.fa-trash')
//select all the classes labelled with item and that are spans and hold them in the set var
const item = document.querySelectorAll('.item span')
//select all the classes labelled with item  and that are spans with the class of completed and hold them in the set var
const itemCompleted = document.querySelectorAll('.item span.completed')

//loop through the all elements in the car of deleteBtn and for each element, add an eventlisterner with the click feature and the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//loop through the all elements in the car of item and for each element, add an eventlisterner with the click feature and the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//loop through the all elements in the car of itemCompleted and for each element, add an eventlisterner with the click feature and the markUncomplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//the function of deleteItem will grab the parentNode (the li) and look into the parentNode to the chidNode(span) and grab the text and hold it in the var of itemText.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //go to the deletItem route and set the method of delete, and set the itemText grabbed from the li and span above, set it to itemFromJS.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //hold the data from the server side into this var, console log the data recieved and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()

        //console log the error
    }catch(err){
        console.log(err)
    }
}

//the function of markComplete will grab the parentNode (the li) and look into the parentNode to the chidNode(span) and grab the text and hold it in the var of itemText.
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //go to the markComplete route and set the method of put, and set the itemText, grabbed from the li and span above, set it to itemFromJS.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //hold the data from the server side into this var, console log the data recieved and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()

        //console log the error
    }catch(err){
        console.log(err)
    }
}

//the function of markUnComplete will grab the parentNode (the li) and look into the parentNode to the chidNode(span) and grab the text and hold it in the var of itemText.
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //go to the markUnComplete route and set the method of put, and set the itemText, grabbed from the li and span above, set it to itemFromJS.
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //hold the data from the server side into this var, console log the data recieved and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()
        
        //console log the error
    }catch(err){
        console.log(err)
    }
}