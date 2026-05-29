let PALAVRA_CERTA = "CARRO" //palavra sorteada
let tentativaAtual = 0 //que linha está(0 a 5)
let letraAtual = 0 //que coluna esta(0 a 4)
let jogoAtivo = true //false qnd acabar


function sortearPalavra(){ //sortear palavra aleatoria do .json vindo do app.py
    fetch('palavras.json')
        .then(response => response.json())
        .then(palavras => {
            const indiceAleatorio = Math.floor(Math.random() * palavras.length);
            const palavraSorteada = palavras[indiceAleatorio];

            console.log(palavraSorteada);
            PALAVRA_CERTA = palavraSorteada.toUpperCase()
        });
}

function inserirLetra(letra){
    
    if(!jogoAtivo) return //trava se o jogo acabou ou se a linha tiver cheia
    if(letraAtual >= 5) return

    //so aceita letras
    const apenasLetras = /^[a-zA-ZÀ-ú]$/
    if(!apenasLetras.test(letra))
        return

    //pega a celula exata da posicao atul
    const celula = document.getElementById(`celula-${tentativaAtual}-${letraAtual}`)

    //escreve a letra e marca como preenchida
    celula.textContent = letra.toUpperCase()
    celula.classList.add("preenchida")

    //proxima coluna
    letraAtual++
}

function apagarLetra(){
    if(!jogoAtivo) return
    if(letraAtual <= 0) return

    //volta
    letraAtual--
    
    const celula = document.getElementById(`celula-${tentativaAtual}-${letraAtual}`)

    //exclui a letra e deixa livre

    celula.textContent = ""
    celula.classList.remove("preenchida")

}

document.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        if(letraAtual < 5){
            mostrarAviso("Palavra incompleta!")
            return
        }

        // todasVerdes começa true
        let todasVerdes = true

        const palavraTentativa = pegarLetrasDaLinha()

        for(let i = 0; i < 5; i++){
            const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)

            if(palavraTentativa[i] == PALAVRA_CERTA[i]){
                celula.classList.add("correta")
                // não mexe no todasVerdes aqui!
            } else if(PALAVRA_CERTA.includes(palavraTentativa[i])){
                celula.classList.add("presente")
                todasVerdes = false  // errou → não ganhou
            } else {
                celula.classList.add("ausente")
                todasVerdes = false  // errou → não ganhou
            }
        }

        animarRevelacao(todasVerdes)

        if(!todasVerdes && tentativaAtual < 5){
            tentativaAtual++
            letraAtual=0
        }
    }else if(event.key == 'Backspace'){
        apagarLetra()
    }else{
        inserirLetra(event.key)
    }
})

function animarRevelacao(todasVerdes){ //passa parametro de tudo verde, que ganhou
    for(let i= 0; i<5;i++){
        const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)
        celula.style.animationDelay = `${i*150}ms`
        celula.classList.add("flip")
    }
    setTimeout(() => {
        if(todasVerdes){
            mostrarModal("Ganhou!")
        }else if(tentativaAtual == 5){
            mostrarModal("Fim do Jogo!")
        }
    }, 5 * 150 + 500)
}

function pegarLetrasDaLinha(){

    const letras = [] //array vazio

    for(let i=0; i<5; i++){ //passa pegando uma letra de cada vez
        const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)
        letras.push(celula.textContent)
    }

    return letras
}

function mostrarAviso(msg){
    const aviso = document.getElementById("aviso")
    aviso.textContent = msg //escreve a msg
    aviso.classList.add("visivel") //aparece
    setTimeout(()=>{
        aviso.classList.remove("aviso")
    }, 2000)
}

