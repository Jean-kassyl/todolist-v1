const items = document.querySelectorAll('.item')
const radios = document.querySelectorAll('.item input')

radios.forEach(radio => {
    radio.checked = false;
})

items.forEach(item => {
    item.onclick = function(e){
        let input = item.querySelector('input')
        
        if(!input.checked){
            input.checked = true;
            item.style.textDecoration = "line-through"
        }
        else {
            input.checked = false;
            item.style.textDecoration = "none"
        }
        
       // 
        //item.style.textDecoration = "line-through"
        console.log(input)
    }
})