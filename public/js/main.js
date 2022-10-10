const items = document.querySelectorAll('.item')
const radios = document.querySelectorAll('.item input')
const colorsChanger = document.querySelectorAll('.colors span');

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
        }
    }
})