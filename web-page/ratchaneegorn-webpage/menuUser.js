    
    let p1 = document.querySelector("p")
    p1.addEventListener("click", changename)

    function changename(){
        let name = prompt("enter a name")
        p1.textContent = 'logout' + name;
    }
