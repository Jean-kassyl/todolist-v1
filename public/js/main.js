const items = document.querySelectorAll('.item')
const checkboxes = document.querySelectorAll('.item input')
const colorsChanger = document.querySelectorAll('.colors .color-btn');
const mobileMenu = document.querySelector('.colors .mobile-menu');
const aside = document.querySelector('.aside');

const categoryForm = document.querySelector('.cat-form');
const deleteCategory = document.querySelectorAll('.delete-link')

const deleteItem = document.querySelectorAll('.item a')


let theme = localStorage.getItem('theme')

if(theme){
    if(theme === "cornflowerblue" ){
        document.body.classList.remove('crimson');
        document.body.classList.remove('black');
    }else {
        document.body.classList.remove('crimson');
        document.body.classList.remove('black');
        document.body.classList.add(theme)
    }
}

if(!items[0].classList.contains("not_todo")){
    // start of the logic to check a todo using line through
    
    checkboxes.forEach(checkbox => {
        let check = JSON.parse(localStorage.getItem(checkbox.parentElement.dataset.title)) || [] ;
        const content = checkbox.parentElement.dataset.content;

        
        if(check.length > 0){
    
           check.forEach(item_data => {
                if(item_data === content){
                  
                  checkbox.checked = true;
        
                  if(checkbox.checked){
                    //item.querySelector('input').checked = true
                    checkbox.parentElement.style.textDecoration = "line-through";
                  }else {
                    //item.querySelector('input').checked = false
                    checkbox.parentElement.style.textDecoration = "none";
                  }
                }
            })
    
        }
      
    })



    // end of the logic
} 


let list_items = [];

// created to deal with local storage
checkboxes.forEach(checkbox => {
    if(localStorage.getItem(checkbox.parentElement.dataset.title)){
        list_items = JSON.parse(localStorage.getItem(checkbox.parentElement.dataset.title))
    }
    checkbox.onchange = function(e){
        console.log()
        
        // start of the set logic
        //if(!input.checked){
        if(e.currentTarget.checked === true){
            //input.checked = true;
            checkbox.parentElement.style.textDecoration = "line-through";
            const list_item = e.currentTarget.parentElement.dataset.content
            console.log(list_item);
            
            const title = e.currentTarget.parentElement.dataset.title

            list_items.includes(list_item) || list_items.push(list_item);
            console.log(list_items, 'title', title)
            
            localStorage.setItem(title, JSON.stringify(list_items))
        }
        else {
            //input.checked = false;
            checkbox.parentElement.style.textDecoration = "none";
            const list_item = e.currentTarget.parentElement.dataset.content
            const title = e.currentTarget.parentElement.dataset.title
            if(list_items.includes(list_item)){
                let ind = list_items.indexOf(list_item)
                list_items.splice(ind, 1)
            }
            console.log(list_items, 'title', title)
            localStorage.setItem(title, JSON.stringify(list_items))
        }
       // end of the checked logic 
    }
    
})

colorsChanger.forEach(changer => {
    changer.onclick = function(e){
        let color = e.target.dataset.color;
        console.log(color);
        if(color === 'cornflowerblue'){
            document.body.classList.remove('crimson')
            document.body.classList.remove('black')
            

        }
        else {
            document.body.classList.remove('crimson')
            document.body.classList.remove('black')
            document.body.classList.toggle(color)
            localStorage.setItem('theme', color)
        }
    }
})


mobileMenu.addEventListener('click', function(){
    aside.classList.toggle('mobile');
})


// trim category data form

categoryForm.onsubmit =  function(e){
        e.preventDefault()
        const input  = categoryForm.querySelector('input');
        let str = input.value.trim()
        input.value = str

        console.log(input.value)
        e.currentTarget.submit()
}

// get rid of deleted data in the localstorage

deleteCategory.forEach(cat => {
    cat.onclick = function(e){
        const title = e.currentTarget.dataset.category
        console.log(title)
        localStorage.removeItem(title)
    }
})

// dealing with the local storage when we delete an item

deleteItem.forEach(del_link => {
    del_link.onclick = function(e){
        const title = e.currentTarget.parent.dataset.title
        const content = e.currentTarget.parent.content
        if(localStorage.getItem(title)){
            list_items = JSON.parse(localStorage.getItem(title))
        }
        let ind = list_items.indexOf()
        list_items.splice(ind, 1)
        console.log("deeleting the item", content)
        localStorage.setItem(title, JSON.stringify(list_items))
    }
})