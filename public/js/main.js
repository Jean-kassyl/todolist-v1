const items = document.querySelectorAll('.item')
const radios = document.querySelectorAll('.item input')
const colorsChanger = document.querySelectorAll('.colors .color-btn');
const mobileMenu = document.querySelector('.colors .mobile-menu');
const aside = document.querySelector('.aside');


let check = localStorage.getItem('checker') || [];



items.forEach(item => {
    const link = item.querySelector('a').href;
    if(check.length > 0){

        check.split(',').forEach(url => {
            if(link === url){
              let rad =  item.querySelector("input");
              rad.checked = true;
    
              if(rad.checked){
                item.style.textDecoration = "line-through";
              }else {
                item.style.textDecoration = "none";
              }
            }
        })

    }
  
})

let urls = []
items.forEach(item => {
    item.onclick = function(e){
        let input = item.querySelector('input')
        
        if(!input.checked){
            input.checked = true;
            item.style.textDecoration = "line-through";
            const url = e.currentTarget.children[2].href
            
            urls.includes(url) || urls.push(url);
            console.log(urls);
            
            localStorage.setItem('checker', urls)
        }
        else {
            input.checked = false;
            item.style.textDecoration = "none";
            const url = e.currentTarget.children[2].href
            if(urls.includes(url)){
                let ind = urls.indexOf(url)
                urls.splice(ind, 1)
            }
            console.log(urls)
            localStorage.setItem('checker', urls)
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


mobileMenu.addEventListener('click', function(){
    aside.classList.toggle('mobile');
})