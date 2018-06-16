'use strict';

//our global store object which contains our data
const STORE = {
  items: [
    {id: cuid(), name: 'cheetos', checked: true},
    {id: cuid(), name: 'fruit roll up', checked: false},
    {id: cuid(), name: 'fruits extreme', checked: false},
    {id: cuid(), name: 'potato chip', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'juice', checked: true},
    {id: cuid(), name: 'bread', checked: true},
    {id: cuid(), name: 'potato', checked: false},
    {id: cuid(), name: 'asparagus', checked: true}
  ],
  checkBox: false,
  search:false,
  searchResults:[]
    

};


//method for generating shopping items in the DOM, used by render function
function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name} <div class='edit'></div><input class='edit-item-input' type="text" value="Edit Your Item Name" /></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
       
      </div>
    </li>`;
}

//string theory
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

//render DOM state
function renderShoppingList(renderItems=STORE.items) {
  // Make a copy of STORE.items to manipulate for displaying
  let filteredItems = [ ...renderItems ];
  
  // Check checkbox property, create new filtered array with only unchecked items 
  if (STORE.checkBox === true) {
    filteredItems = filteredItems.filter(obj => {
      return obj.checked !== true;
    });
  } 
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  // We're now generating HTML from the filteredItems and not the persistent STORE.items
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
  
}

//add new item to the STORE !!
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

//event handler for adding item to shopping list via input form
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();  //prevent default form input processing
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList(STORE.items);
  });
}

//event handler for searching for item in our STORE via input form
function handleItemSearch(){
  $('#js-shopping-list-search').submit(function(event) {
    event.preventDefault(); //prevent default form input processing
    console.log('`handleItemSearch` ran');
    const searchItemName = $('.js-shopping-search-entry').val();
    console.log(searchItemName);
    searchItemInShoppingList(searchItemName);

  });
}

//search method
function searchItemInShoppingList(itemName){

  let searchArray = STORE.items.filter(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
  //STORE.searchResults = [ ...newArray ];
  console.log(searchArray);
  if(itemName !== ''){
    renderShoppingList(searchArray); //pass to render function
  } else{
    renderShoppingList();
  }
}

//method that sets checked property of item 
function toggleCheckedForListItem(itemId) {
  const item = findItemById(itemId);
  item.checked = !item.checked;
}


//get ID from item
function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-index-element')
    .data('item-id');
}


//function returns ID of item in object array
function findItemById(id) {
  return STORE.items.find(i => i.id === id);
}

//Handler for checking if option for hiding checked items is enabled
function handleHideCheckedItems() {
  $('#checkbox-hide').change(function() {
    changeCheckBoxState();
    console.log('checked!');
    renderShoppingList();
  });
 
}

//Handler for toggling check item
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemId = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}


//Handler to trigger item edit mode via clicking on the edit icon
function handleEditItemClick(){
  $('.js-shopping-list').on('click', '.edit', event => {
    console.log('`handleEditItemClick` ran');
    //show text input field to user and hide edit icon
    //using dom manipulation not via render method because this has no bearing on data, just shows the edit field
    $(event.currentTarget).hide();
    $(event.currentTarget).next().show();
    $(event.currentTarget).next().select();
    console.log(event.currentTarget);


  });

}

//event handler for the name edit input field that appears when you click on the edit icon
function handleItemRenameSubmit(){
  $('.js-shopping-list').on('blur', '.edit-item-input', event => {
       
    console.log(event.currentTarget);
    //use getter method to grab object via ID
    let targetObject = findItemById(getItemIdFromElement(event.currentTarget));
    targetObject.name = event.currentTarget.value;
    //change object name to input value
    console.log(event.currentTarget.value);
    console.log(targetObject);
   
    //rendering....
    renderShoppingList();


  });
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemId) {
  const itemIndex = STORE.items.findIndex(i => i.id === itemId);
  STORE.items.splice(itemIndex, 1);
}

//delete button handler
function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemId = getItemIdFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemId);
    // render the updated shopping list
    renderShoppingList();
  });
}

//function that sets global checkbox display state to opposite value (acts as a toggle)
function changeCheckBoxState() {
  STORE.checkBox = !STORE.checkBox;
}


//unused, will be reimplemented to sort
function handleChangeSortBy() {
  $('#js-shopping-list-sortby').change(e => {
    const sortBy = e.target.value;
    changeSortBy(sortBy);
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleHideCheckedItems();
  handleDeleteItemClicked();
  handleChangeSortBy();
  handleItemSearch();
  handleEditItemClick();
  handleItemRenameSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);