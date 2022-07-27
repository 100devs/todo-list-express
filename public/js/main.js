const deleteBtn = document.querySelectorAll('.fa-trash')
//selects each li with a class of .item
const item = document.querySelectorAll('.item span')
//selects each li with a class of .item
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adds a click event to every rendered element and will fire markComplete async function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
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

/*
*
*/

async function markComplete(){
    //will select the innerText of the span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetching markcomplete method with put method endpoint
        const response = await fetch('markComplete', {
            //pass itemText into body of request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)

        //web api object, reloads our page (which will fire a new GET request)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


/*
* Name: markComplete
* Description: fires when an item from our todo is clicked and will make a PUT request in our server.
*/
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //will select the innerText
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