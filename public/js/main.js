const deleteBtn = document.querySelectorAll('.fa-trash') /* declares the deleteBtn variable to be a nodelist of all of the trash bins from the dom */
const item = document.querySelectorAll('.item span') /* declares the item variable to be a nodelist of all of the spans that have the item class */
const itemCompleted = document.querySelectorAll('.item span.completed') /* declares a variable for all of the nodes that are of the item class that are also spans that have hte completed class */

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) /* Makes an array from the nodelist of all of the trash cans and adds a click event listener to them. runs the deleteItem function when clicked*/

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) /* Makes an array from the nodelist of all of the items and adds a click event listener to them. runs the markcomplete function when clicked */

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) /* Makes an array from the nodelist of all of the completed items and adds a click event listener to them. Runs the markUncomplete function when clicked */

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText /* this refers to the node that was clicked (out of all of the trash can nodes). It then goes to the parent node, and selects the text of the first child node, which is the todo text */
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText 
            })
          }) /* Sends data to server to run the deleteItem method*/
        const data = await response.json() /* stores server response in the data */
        console.log(data)/* console logs the response */
        location.reload()/* reloads the webpage */

    }catch(err){
        console.log(err)/* prints an error to the console log if anything goes wrong */
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText /* this refers to the node that was clicked (out of all of the trash can nodes). It then goes to the parent node, and selects the text of the first child node, which is the todo text */
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })/* Sends data to server to run the markComplete method*/
        const data = await response.json()/* stores server response in the data variable */
        console.log(data)/* console logs the response */
        location.reload()/* reloads the webpage */

    }catch(err){
        console.log(err)/* prints an error to the console log if anything goes wrong */
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
            })/* Sends data to server to run the markUnComplete method*/
          })/* Sends data to server in form of a json*/
        const data = await response.json() /* stores the server response in the data variable */
        console.log(data) /* console logs the response */
        location.reload() /* reloads the webpage */

    }catch(err){
        console.log(err) /* prints an error to the console log if anything goes wrong */
    }
}