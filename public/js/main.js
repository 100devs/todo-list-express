//store queryselector on trash icon in deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Create an array from each delete button and add an event listener that runs deleteItem when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Create an array from each task and add an event listener that runs markComplete when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Create an array from each task and add an event listener that runs markUnComplete when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//declare async function
async function deleteItem(){
    //declare variable itemText holding text inside 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //wait for fetch to resolve then store in variable response
        const response = await fetch('deleteItem', {
            //set fetch method to delete
            method: 'delete',
            //tell the server we're sending JSON data
            headers: {'Content-Type': 'application/json'},
            //convert our data to JSON and pass into the body property
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //waits to convert data in response variable to json and log
        const data = await response.json()
        console.log(data)
        //reload the current URL
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//declare async function
async function markComplete(){
    //declare variable itemText holding text inside 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         //wait for fetch to resolve then store in variable response
        const response = await fetch('markComplete', {
            //set fetch method to delete
            method: 'put',
            //tell the server we're sending JSON data
            headers: {'Content-Type': 'application/json'},
            //DOM cannot understand JSON unless stringified
            //convert our data to JSON and pass into the body property
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //waits to convert data in response variable to json and log
        const data = await response.json()
        console.log(data)
        //reload the current URL
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//declare async function, same as above explanation
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