const deleteBtn = document.querySelectorAll('.fa-trash') // stores all trash can icons in a variable
const item = document.querySelectorAll('.item span') // stores all list items in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // stores all completed tasks in a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) // throws a smurf on all trash can icons

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) // throws a smurf on all list items

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) // throws a smurf on all "completed" tasks

async function deleteItem(){ // what happens when you click on a trash can
  const itemText = this.parentNode.childNodes[1].innerText; // find the task name and store it in a variable
  try { // cross your fingers
    const response = await fetch("deleteItem", {
      // make request to server-side code
      method: "delete", // tell it to delaytay
      headers: { "Content-Type": "application/json" }, // so browser knows how to render JSON
      body: JSON.stringify({ // convert object to JSON
        itemFromJS: itemText, // thing: task
      }),
    });
    const data = await response.json(); // wait for server-side code to deliver a delicious json treat
    console.log(data); // logs "Todo Deleted"
    location.reload(); // refresh the page
  } catch (err) { // oof
    console.log(err); // something went wrong
  }
}

async function markComplete(){ // what happens when you click on a task
    const itemText = this.parentNode.childNodes[1].innerText // find the task name and store it in a variable
    try{ // hold your breath
        const response = await fetch("markComplete", {
          // make request to server-side code
          method: "put", // update!
          headers: { "Content-Type": "application/json" }, // so browser knows how to render JSON
          body: JSON.stringify({ // convert object to JSON
            itemFromJS: itemText, // thing: task
          }),
        });
        const data = await response.json() // wait for server-side code to deliver a delicious json treat
        console.log(data) // logs "Marked Complete"
        location.reload() // refresh the page

    }catch(err){ // dammit
        console.log(err) // nope
    }
}

async function markUnComplete(){ // what happens when you click on a task that has already been marked out
  const itemText = this.parentNode.childNodes[1].innerText; // find the task name and store it in a variable
  try { // make a wish
    const response = await fetch("markUnComplete", { // make request to server-side code
      method: "put", // update!
      headers: { "Content-Type": "application/json" }, // so browser knows how to render JSON
      body: JSON.stringify({ // convert object to JSON
        itemFromJS: itemText, // thing: task
      }),
    });
    const data = await response.json(); // wait for server-side code to deliver a delicious json treat
    console.log(data); // logs "Marked Complete" for some reason lol am I chasing bugs too or nah oooooh it's because that's what you actually wrote in the console log statement for this function guess it happens to the best of us
    location.reload(); // refresh the page
  } catch (err) { // sheeeeeeiiiiiiiit
    console.log(err); // log your failure
  }
}