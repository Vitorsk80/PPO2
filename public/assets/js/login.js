const modal = document.getElementById("modalLogin");
const abrir = document.getElementById("abrirLogin");
const fechar = document.querySelector(".fechar");

if (modal && abrir && fechar) {

    abrir.addEventListener("click", function(e){
        e.preventDefault();
        modal.style.display = "flex";
    });

    fechar.addEventListener("click", function(){
        modal.style.display = "none";
    });

    window.addEventListener("click", function(e){
        if(e.target === modal){
            modal.style.display = "none";
        }
    });

}