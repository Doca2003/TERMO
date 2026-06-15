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

//logica do enter
function processarEnter(){
    if(letraAtual < 5){
        mostrarAviso("Palavra incompleta!")
        return
    }

    let todasVerdes = true
    const palavraTentativa = pegarLetrasDaLinha()

    for(let i = 0; i < 5; i++){
        const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)
        const tecla = document.querySelector(`[data-letra="${palavraTentativa[i]}"]`)

        if(palavraTentativa[i] == PALAVRA_CERTA[i]){
            celula.classList.add("correta")
            if(tecla)
                tecla.classList.add("correta")

        } else if(PALAVRA_CERTA.includes(palavraTentativa[i])){
            celula.classList.add("presente")
            todasVerdes = false
            if(tecla && !tecla.classList.contains("correta"))
                tecla.classList.add("presente")
        } else {
            celula.classList.add("ausente")
            todasVerdes = false
            //pega a tecla com a letra e pinta 
            if(tecla && !tecla.classList.contains("correta") && !tecla.classList.contains("presente")){
                tecla.classList.add("ausente")
            }
        }
    }

    animarRevelacao(todasVerdes)

    if(!todasVerdes && tentativaAtual < 5){
        tentativaAtual++
        letraAtual = 0
    }
}

// teclado físico
document.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        event.preventDefault() //impede enter de clicar no botao da tela
        processarEnter()//chama a função
    } else if(event.key == 'Backspace'){
        event.preventDefault()
        apagarLetra()
    } else {
        inserirLetra(event.key)
    }
})

// teclado na tela
document.querySelectorAll('.tecla').forEach(tecla => {
    tecla.addEventListener('click', () => {
        const letra = tecla.dataset.letra

        if(letra == 'ENTER'){
            processarEnter()   //mesma função
        } else if(letra == 'APAGAR'){
            apagarLetra()
        } else {
            inserirLetra(letra)
        }
    })
})

// botão reiniciar
document.getElementById('btn-reiniciar').addEventListener('click', reiniciarJogo)

function animarRevelacao(todasVerdes){ //passa parametro de tudo verde, que ganhou
    for(let i= 0; i<5;i++){
        const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)
        celula.style.animationDelay = `${i*150}ms`
        celula.classList.add("flip")
    }
    setTimeout(() => {
        if(todasVerdes){
            mostrarModal(true)
        }else if(tentativaAtual == 5){
            mostrarModal(false)
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
        aviso.classList.remove("visivel")
    }, 2000)
}

function mostrarModal(ganhou){
    const modal = document.getElementById('modal')
    const title = document.getElementById('modal-titulo')
    const word = document.getElementById('modal-palavra')
    const msg = document.getElementById('modal-mensagem')

    if(ganhou){
        title.textContent = "GANHOU!"
        msg.textContent = `Você acertou em ${tentativaAtual + 1} tentativas!`
        word.textContent = "" //nao precisa mostrar a palavra
    }else{
        title.textContent = "FIM DO JOGO!"
        msg.textContent = "Não foi dessa vez!"
        word.textContent = PALAVRA_CERTA //mostra a resposta certa
    }

    modal.classList.remove('escondido') //remover a class 'escondido'
}

function reiniciarJogo(){

    //resetar variaveis de estado
    tentativaAtual = 0
    letraAtual = 0
    jogoAtivo = true


    //limpar todas as células
    for(let linha = 0; linha<6; linha++){
        for(let coluna = 0; coluna<5; coluna++){
            const celula = document.getElementById(`celula-${linha}-${coluna}`)
            celula.textContent = ""
            celula.classList.remove("correta", "presente", "ausente", "preenchida", "flip")
        }
    }

    //limpar teclas do teclado
    //retornar lista com todos os elementos q tem classe tecla
    const teclas = document.querySelectorAll(".tecla")
    //percorrer
    teclas.forEach(tecla => {
        tecla.classList.remove("correta", "presente", "ausente")
    })

    //adiciona o escondido novamente
    const modal = document.getElementById('modal')
    modal.classList.add('escondido')

    //sortear palavra nova para próxima rodada
    sortearPalavra()
}

sortearPalavra()
