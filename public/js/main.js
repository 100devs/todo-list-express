// const holding target(s) with class of "fa-trash", aka the delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
//Target span with class "item" and store in const
const item = document.querySelectorAll('.item span')
//target span with classes "item" and "completed" and store in const
const itemCompleted = document.querySelectorAll('.item span.completed')
//create array from all values targeted with deleteBtn const and add event listener with click event to run deleteItem()
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//create array from all values targeted with item const and add event listener with click event to run markComplete()
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//create array from all values targeted with itemCompleted const and add event listener with click event to run markUncomplete()
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//async function to delete item decleration
async function deleteItem(){
    //const to hold node stuff
    const itemText = this.parentNode.childNodes[1].innerText
    //start of try/catch 
    try{
        //const to hold async result of fetch request
        const response = await fetch('deleteItem', {
            //setting fetch req method
            method: 'delete',
            //setting fetch req headers
            headers: {'Content-Type': 'application/json'},
            //setting fetch req body, using stringify to properly format json body
            body: JSON.stringify({
                //json key/value pair
              'itemFromJS': itemText
              //closing notation
            })
             //closing notation
          })
        //const to hold asyn result/response from fetch
        const data = await response.json()
        //console log response held in data const
        console.log(data)
        //reload the page
        location.reload()
    //catch errors using the catch block
    }catch(err){
        //console log the error caught
        console.log(err)
         //closing notation
    }
     //closing notation
}
//async function markComplete declaration
async function markComplete(){
    //const to hold node stuff
    const itemText = this.parentNode.childNodes[1].innerText
    //start of try/catch block
    try{
        //const to hold fetch req result
        const response = await fetch('markComplete', {
            //set fetch method
            method: 'put',
            //set fetch headers
            headers: {'Content-Type': 'application/json'},
            //set fetch body, use json stringify to ensure proper json format
            body: JSON.stringify({
                //body content
                'itemFromJS': itemText
                 //closing notation
            })
             //closing notation
          })
          //const to hold result/response
        const data = await response.json()
        //console.log response
        console.log(data)
        //reload page
        location.reload()
    //catch block
    }catch(err){
        //console log caught error
        console.log(err)
         //closing notation
    }
     //closing notation
}
//async function markUnComplete declaration
async function markUnComplete(){
    //set const to hold node stuff
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch blocks
    try{
        //const to hold fetch result
        const response = await fetch('markUnComplete', {
            //set fetch method
            method: 'put',
            //set fetch headers
            headers: {'Content-Type': 'application/json'},
            //set fetch body, using json stringify to ensure proper json format
            body: JSON.stringify({
                //fetch req body
                'itemFromJS': itemText
                 //closing notation
            })
             //closing notation
          })
        //const to hold result/response
        const data = await response.json()
        //console log response
        console.log(data)
        //reload page
        location.reload()
    //catch block
    }catch(err){
        //console.log error
        console.log(err)
         //closing notation
    }
     //closing notation
}