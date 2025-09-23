const deleteBtn = document.querySelectorAll('.fa-trash')//variable that selects all elements with the trash can class
const item = document.querySelectorAll('.item span')//variable that selects all spans with the class item
const itemCompleted = document.querySelectorAll('.item span.completed')//selects all spans with the class item and also completed

Array.from(deleteBtn).forEach((element)=>{//creates an array from selection of deleteBtn and loops for each element
    element.addEventListener('click', deleteItem)//ads an event listener, listens for click and runs deleteItem function
})

Array.from(item).forEach((element)=>{//creates array from item variable and loop each elements
    element.addEventListener('click', markComplete)//ads event listener, listen for click and runs markComplete function
})

Array.from(itemCompleted).forEach((element)=>{//creates arr and loop all itemsCompleted
    element.addEventListener('click', markUnComplete)//ads event listener listener for click and runs function markUnComplete
})

async function deleteItem(){//declares async function
    const itemText = this.parentNode.childNodes[1].innerText//variable that holds the inner text inside the list span
    try{
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specify the content type to be JSON
            body: JSON.stringify({//specify the content type to be stringify JSON
              'itemFromJS': itemText//sets body to inner text of the list item
            })
          })
        const data = await response.json()//declares variable waiting for response with JSON
        console.log(data)//console log the response data
        location.reload()//refresh page

    }catch(err){//grab all errors
        console.log(err)//log errors to console
    }
}

async function markComplete(){//declares async function 
    const itemText = this.parentNode.childNodes[1].innerText//variable that holds the inner text inside the list span
    try{
        const response = await fetch('markComplete', {//creates a res variable that waits on a fetch to get fata from res of function markedComplete
            method: 'put',//sets the CRUD method update
            headers: {'Content-Type': 'application/json'},//specify the content type to be JSON
            body: JSON.stringify({//specify the content type to be stringify JSON
                'itemFromJS': itemText//sets body to inner text of the list item
            })
          })
        const data = await response.json()//declares variable waiting for response with JSON
        console.log(data)//console log the response data
        location.reload()//refresh page

    }catch(err){//grab all errors
        console.log(err)//log errors to console
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText//variable that holds the inner text inside the list span
    try{
        const response = await fetch('markUnComplete', {//creates a res variable that waits on a fetch to get fata from res of function markedUnComplete
            method: 'put',//sets the CRUD method update
            headers: {'Content-Type': 'application/json'},//specify the content type to be JSON
            body: JSON.stringify({//specify the content type to be stringify JSON
                'itemFromJS': itemText//sets body to inner text of the list item
            })
          })
        const data = await response.json()//declares variable waiting for response with JSON
        console.log(data)//console log the response data
        location.reload()//refresh page

    }catch(err){//grab all errors
        console.log(err)//log errors to console
    }
}