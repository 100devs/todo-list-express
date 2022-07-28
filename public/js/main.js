const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

/*^^This code just adds some querySelectors to items with the classes '.fa-trash', '.item span', and '.item span.completed' I believe the purpose of having them set
to variables is so every class can be modified rather easily if things other than querySelectors are to be added in the future

*/
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

/*^^This cycles through every querySelector in deleteBtn and adds an eventListener to it with a click event that calls the deleteItem function

*/

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

/*^^This cycles through every querySelector in item and adds an eventListener to it with a click event that calls the markComplete function

*/

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

/*^^This cycles through every querySelector in itemCompleted and adds an eventListener to it with a click event that calls the markUnComplete function

*/

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

/*^^This is the deleteItem function called by clicking on an item with the 'fa-trash' class. It creates a variable itemText that is set to the text from the selected
list item's childNode, where the parentNode is the <ul> and the childNode is the <li> and childNode[1] is the first indexed item inside the <li>, that is, the 'thing'
key. So it sets itemText to that value, the item name and tries a fetch request that makes a request to the deleteItem directory in the server-side JS. 

It sends a myriad of information with it but what is more importand is that it sends an object with the key of 'body' with a value that includes 'itemFromJS' with its
own value of itemText. This lets the server-side JS know which item to navigate to in the collection to delete. It then creates a variable called data and sets it equal 
to response.json() which will be the same thing as the console logs in the server side, 'Todo Deleted'. The code then console logs that data and refreshes the page.

*/

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

/*^^This performs a similar fucntion to deleteItem and thus follows a similar path. It is triggered when any item with the class 'item span' is clicked, calling 
the markComplete function. This will get the name from the item in the same way as above, by reading the text in the childNode (<li>) of the parentNode (<ul>)
and sending that information inside the itemText variable in a fetch request to the markComplete directory, itemText is again set as the value for 'itemFromJS' which
tells the server which item's 'completed' key to update. The server handles the change of 'completed' from 'false' to 'true' and when the task is complete it sends
the confirming message back to the data variable which is the console.logged and the page reloads to refresh

*/

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

/*^^This performs a similar fucntion to markComplete and thus follows a similar path. It is triggered when any item with the class 'item span' and the class 'completed' is 
clicked, calling the markUnComplete function. This will get the name from the item in the same way as above, by reading the text in the childNode (<li>) of the parentNode (<ul>)
and sending that information inside the itemText variable in a fetch request to the markUnComplete directory, itemText is again set as the value for 'itemFromJS' which
tells the server which item's 'completed' key to update. The server handles the change of 'completed' from 'true' to 'false' and when the task is complete it sends
the confirming message back to the data variable which is the console.logged and the page reloads to refresh

*/
