//CLIENT-SIDE JAVASCRIPT

//using queryselectorall to select all elements containing the specified classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//selectorall returns a nodelist, so you have to use Array.from to turn the nodelists into arrays, so that then you can call the foreach method on them to then add a click event listener to each element
//the click events trigger the functions deleteitem, markcomplete and markuncomplete
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //When the trash icon is clicked, go to the parent, grab child out of the dom and send it to the server
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Making a fetch
        const response = await fetch('deleteItem', {
            //that is a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //and passing along another body
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Response from the fetch
        const data = await response.json()
        console.log(data)
        //Refresh and trigger new get request 
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