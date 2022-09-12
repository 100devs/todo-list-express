//find all elements with class.fa-trash and store it
const deleteBtn = document.querySelectorAll('.fa-trash')
//find all items with item span class and store it
const item = document.querySelectorAll('.item span')
//find all elements with
const itemCompleted = document.querySelectorAll('.item span.completed')
//create array and iterate to add eventlistener on each of the items
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//iterate over  Item and add click event listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//iterate over itemcomplete and add click event listener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// delete item function 
async function deleteItem(){
    // find parent node of the clicked item then get child node's inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //fetch method to delete  using Itemtext as the body
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // resolve the fetch promise
        const data = await response.json()
        //log the response data
        console.log(data)
        //reload the page
        location.reload()
//log the error
    }catch(err){
        console.log(err)
    }
}
//mark complete function
async function markComplete(){
 //find parent node of the event then get the inner text from chuld node
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch put method on markcomplete using itemtext as body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //resolve the fetch promise
        const data = await response.json()
  //log the repoonse
        console.log(data)
        location.reload()
//log the error
    }catch(err){
        console.log(err)
    }
}
//mark incomplete function
async function markUnComplete(){
    //find the parent node of event then get innertext of the child note
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch pui request with itemtext as value in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //respolve the fetch promise
        const data = await response.json()
        console.log(data)
        location.reload()
//log the error
    }catch(err){
        console.log(err)
    }
}