const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// this is creating a array from the deleteBtn so every element that has the deleteBtn (the fa-trash icon) it will grab each one and add a click event listener to it
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// this function will handle the logic of deleting a item
async function deleteItem(){
    // when this (the delete button is clicked) is grabbing the the parent node first and then the child of that parent and getting the innerText of it
    const itemText = this.parentNode.childNodes[1].innerText
    // since we are working with an async function we should use the try catch method
    try{
        // the response is being stored inside of a constant
        const response = await fetch('deleteItem', { //since the fetch operation takes time, we await it . we are also fetching the deleteItem endpoint that we have inside of our api
            // when making a fetch to our api we need to specify some things such as the method we are using, the headers, and the body
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // this turns our body into a json object
            body: JSON.stringify({
                // itemFromJS is the name we will use in our api code so when we look for the reqest.body we will find this being sent over
              'itemFromJS': itemText //itemText is the value
            })
          })

        //   now we have our response inside of the data const and can use that data to do things but here we just log it.
        const data = await response.json()
        console.log(data)
        location.reload()//reload the page

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