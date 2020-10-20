const selected =document.querySelector(".selected");
const optionContainer = document.querySelector(".option-container");

const optionList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
    optionContainer.classList.toggle("active");
});

optionList.forEach(o => {
    o.addEventListener("click", () => {
        selected.innerHTML= o.querySelector("label").innerHTML;
        optionContainer.classList.remove("active");
    });
});