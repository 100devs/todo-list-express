//assigns variable to all .fa-trash elements
const deleteBtn = document.querySelectorAll(".fa-trash");
//assigns variable to all .item span elements
const item = document.querySelectorAll(".item span");
//assigns variable to all .item span with the class of compeleted elements
const itemCompleted = document.querySelectorAll(".item span.completed");
//create an array and loop through deleteBtns
Array.from(deleteBtn).forEach((element) => {
     // give elements a click event listener that call the deleteItem function
     element.addEventListener("click", deleteItem);
});

//create an array and loop through items
Array.from(item).forEach((element) => {
     // give elements a click event listener that call the markComplete function
     element.addEventListener("click", markComplete);
     // end of forEach loop
});

// create an array and loop through items with the class completed
Array.from(itemCompleted).forEach((element) => {
     //give elements a click event listener that call the markUnComplete function
     element.addEventListener("click", markUnComplete);
     // end of forEach loop
});

// declare deleteItem as an asynchronous function
async function deleteItem() {
     // assigns varaible to the innerText of the element clicked
     const itemText = this.parentNode.childNodes[1].innerText;
     // beginning of try block
     try {
          // assigns response that waits for the response from the deleteItem route
          const response = await fetch("deleteItem", {
               // will be a delete request
               method: "delete",
               // the content type will be json
               headers: { "Content-Type": "application/json" },
               // sends req.body and turns it into a string
               body: JSON.stringify({
                    // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
                    itemFromJS: itemText,
                    // end of body obj
               }),
               // end of fetch obj
          });
          // assigning the awaited json resposne to data variable
          const data = await response.json();
          // console.log(data)
          console.log(data);
          // reload page to show changes made
          location.reload();
          // start of catch block, will run code if error happens in try
     } catch (err) {
          // console.log the error
          console.log(err);
          //end of catch
     }
     // end of function
}

// declare markComplete as an asynchronous function
async function markComplete() {
     // assigns varaible to the innerText of the element clicked
     const itemText = this.parentNode.childNodes[1].innerText;
     // beginning of try block
     try {
          // assigns response that waits for the response from the markComplete route
          const response = await fetch("markComplete", {
               // will be a put/update request
               method: "put",
               // the content type will be json
               headers: { "Content-Type": "application/json" },
               // sends req.body and turns it into a string
               body: JSON.stringify({
                    // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
                    itemFromJS: itemText,
                    // end of body obj
               }),
               // end of fetch obj
          });
          // assigning the awaited json resposne to data variable
          const data = await response.json();
          // console.log data
          console.log(data);
          // reload page to show changes made
          location.reload();
          // start of catch block, will run code if error happens in try
     } catch (err) {
          // console.log error
          console.log(err);
          // end of catch
     }
     // end of function
}

// declare markUnComplete as an asynchronous function
async function markUnComplete() {
     // assigns varaible to the innerText of the element clicked
     const itemText = this.parentNode.childNodes[1].innerText;
     // beginning of try block
     try {
          // assigns response that waits for the response from the markComplete route
          const response = await fetch("markComplete", {
               // will be a put/update request
               method: "put",
               // the content type will be json
               headers: { "Content-Type": "application/json" },
               // sends req.body and turns it into a string
               body: JSON.stringify({
                    // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
                    itemFromJS: itemText,
                    // end of body obj
               }),
               // end of fetch obj
          });
          // assigning the awaited json resposne to data variable
          const data = await response.json();
          // console.log data
          console.log(data);
          // reload page to show changes made
          location.reload();
          // start of catch block, will run code if error happens in try
     } catch (err) {
          // console.log error
          console.log(err);
          // end of catch
     }
     // end of function
}
