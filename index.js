'use strict';

//our global store object which contains our data
const STORE = {
  items: [
    {id: cuid(), name: 'nice bananas', checked: false,found:false},
    {id: cuid(), name: 'extreme cheetos', checked: false,found:false},
    {id: cuid(), name: 'fruit roll up', checked: true,found:false},
    {id: cuid(), name: 'orangina', checked: false,found:false},
    {id: cuid(), name: 'potato chip', checked: true,found:false},
    {id: cuid(), name: 'bread', checked: true,found:false},
    {id: cuid(), name: 'potato', checked: false,found:false},
    {id: cuid(), name: 'asparagus', checked: true,found:false}
  ],
  checkBox: false,
  filter:'',
  searchResults:[]
    

};


//method for generating individual shopping items in the DOM, used by render function and generateshoppinglistitemsstring method
function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}"><span>${item.name}</span> <span class='edit'><i class="fas fa-edit"></i></span><input class='edit-item-input' type="text" value="${item.name}" /></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label"><i class="far fa-check-square"></i></span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label"><i class="fas fa-trash-alt"></i>
            </span>
        </button>
       
      </div>
    </li>`;
}


//method for generating the shopping list
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  var filterList = filterItemsArrayByTerm(shoppingList, STORE.filter);
  filterList = filterItemsArrayByChecked(filterList);
  const items = filterList.map((item) => generateItemElement(item));
  return items.join('');
}



//filter methods
//sets global filter
function setStoreFilter(filter){
  STORE.filter = filter.toLowerCase();
}

//filters array given argument, returns filtered array or if no filter argument, returns array
function filterItemsArrayByTerm(items, filter){
  if(filter){
    return items.filter(i => i.name.toLowerCase().includes(filter));
  }else{
    return items;
  }
}

//same concept as above for checked items
function filterItemsArrayByChecked(items){
  if(STORE.checkBox){
    return items.filter(item => !item.checked);
  }else{
    return items;
  }
}

//helper methods
//method that sets checked property of item 
function toggleCheckedForListItem(itemId) {
  const item = findItemById(itemId);
  item.checked = !item.checked;
}


//add new item to the STORE !!
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
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

//function that sets global checkbox display state to opposite value (acts as a toggle)
function changeCheckBoxState() {
  STORE.checkBox = !STORE.checkBox;
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemId) {
  const itemIndex = STORE.items.findIndex(i => i.id === itemId);
  STORE.items.splice(itemIndex, 1);
}


//George Frideric Handel
//Handler for checking if option for hiding checked items is enabled
function handleHideCheckedItems() {
  $('#checkbox-hide').change(function() {
    changeCheckBoxState();
    console.log('checked!');
    renderShoppingList();
  });
}

//event handler for adding item to shopping list via input form
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();  //prevent default form input processing
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

//event handler for searching for item in our STORE via input form
function handleItemSearch(){
  $('#js-shopping-list-search').on('keyup', '.js-shopping-search-entry', function(e){
    // event.preventDefault();
    const filter = $('.js-shopping-search-entry').val();
    console.log(filter);
    setStoreFilter(filter);
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

//Handler to trigger item edit mode
function handleEditItemClick(){
  $('.js-shopping-list').on('click', '.edit', event => {
    console.log('`handleEditItemClick` ran');
    //bypassing global render state using the following methods because these are unrelated to global data state; simply shows the edit field to the user so they can change name
    $(event.currentTarget).hide();
    $(event.currentTarget).prev().hide(); //hide previous element
    $(event.currentTarget).next().show();  //show next element
    $(event.currentTarget).next().select();
    console.log(event.currentTarget);


  });

}

//event handler for renaming item
function handleItemRenameSubmit(){
  // mouse click outside input (blur or lose focus) will trigger this
  $('.js-shopping-list').on('blur', '.edit-item-input', event => {
    
    //if blank input then use default value
    let thisItem = event.currentTarget;
    if ($.trim(thisItem.value) == ''){
      thisItem.value = (thisItem.defaultValue ? thisItem.defaultValue : '');
    }
    else{
      $(thisItem).prev().prev().html(thisItem.value);
    }
    
    console.log(event.currentTarget);
    let targetObject = findItemById(getItemIdFromElement(event.currentTarget));
    targetObject.name = event.currentTarget.value;
    console.log(event.currentTarget.value);
    console.log(targetObject);
   
    renderShoppingList();


  });

  $('.js-shopping-list').on('keydown', '.edit-item-input', event => {
    if (event.keyCode == '13') {  //if enter key is pressed
      
      //if blank input then use default value
      let thisItem = event.currentTarget;
      if ($.trim(thisItem.value) == ''){
        thisItem.value = (thisItem.defaultValue ? thisItem.defaultValue : '');
      }
      else{
        $(thisItem).prev().prev().html(thisItem.value);
      }
      
      console.log(event.currentTarget);
      let targetObject = findItemById(getItemIdFromElement(event.currentTarget));
      targetObject.name = event.currentTarget.value;
      console.log(event.currentTarget.value);
      console.log(targetObject);
    
      renderShoppingList();
    }

  });



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


//RENDERING
function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleItemSearch();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleHideCheckedItems();
  handleDeleteItemClicked();
  handleEditItemClick();
  handleItemRenameSubmit();
     
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);