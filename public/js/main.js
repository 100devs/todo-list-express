//Selecting the spans needed for search on mongodb
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Looping through each span and adding the event listener on click then calling function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Looping through each span and adding the event listener on click then calling function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Looping through each span and adding the event listener on click then calling function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//function to fetch data 
async function deleteItem(){
    //goes into the span, searches for the parent and grabs the first span's text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch server side data, calling the delete item path
        const response = await fetch('deleteItem', {
            //Fetch method
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //Turning itemText into Json format for the request
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Saving response in the data variable
        const data = await response.json()
        console.log(data)
        //Refresh page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //goes into the span, searches for the parent and grabs the first span's text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch server side data, calling the markcomplete path
        const response = await fetch('markComplete', {
            //Fetch method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //Turning itemText into Json format for the request
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //Saving response in the data variable
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//See other methods for comments.
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