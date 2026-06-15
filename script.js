let PALAVRA_CERTA = "" //palavra sorteada
let tentativaAtual = 0 //que linha está(0 a 5)
let letraAtual = 0 //que coluna esta(0 a 4)
let jogoAtivo = true //false qnd acabar
const TAMANHO_PALAVRA = 5
const MAX_TENTATIVAS = 6
let listaPalavras = []

function sortearPalavra(){ //sortear palavra aleatoria do .json vindo do app.py
    fetch('palavras.json')
        .then(response => response.json())
        .then(palavras => {
            const indiceAleatorio = Math.floor(Math.random() * palavras.length);
            const palavraSorteada = palavras[indiceAleatorio]
            PALAVRA_CERTA = palavras[indiceAleatorio].toUpperCase()

            console.log(palavraSorteada);
        });
}

function palavraExiste(tentativa){
    const palavra = tentativa.join("").toLowerCase()
    return listaPalavras.includes(palavra)
}

function contarLetras(palavra){ //contagem da palavra sorteada para decidir quais letras vao ficar amarelas
    const frequencia = {}

    for(let letra of palavra){
        frequencia[letra] = (frequencia[letra] || 0) + 1
    }
    return frequencia
}

function marcarVerdes(tentativa, frequencia){ //retorna letras na posicao correta e a frequencia
    const resultado = Array(5).fill(null)

    for(let i = 0; i<TAMANHO_PALAVRA; i++){
        if(tentativa[i] === PALAVRA_CERTA[i]){
            resultado[i] = "correta"
            frequencia[tentativa[i]]-- //consome a letra correta
        }
    }
    return resultado
}

function marcarAmarelosECinzas(tentativa, frequencia, resultado){
    for(let i = 0; i<TAMANHO_PALAVRA; i++){
        //caso ja ficou verde, passa para a proxima
        if(resultado[i] == "correta")
            continue

        const letra = tentativa[i]

        if(frequencia[letra] > 0){
            resultado[i] = "presente"

            frequencia[letra]-- //consome a letra q existe, mas esta na pos errada
        }else{
            resultado[i] = "ausente"
        }
    }

    return resultado
}

function inserirLetra(letra){
    
    if(!jogoAtivo) return //trava se o jogo acabou ou se a linha tiver cheia
    if(letraAtual >= TAMANHO_PALAVRA) return

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

function processarEnter(){

    if(!jogoAtivo)
        return

    if(letraAtual < TAMANHO_PALAVRA){
        mostrarAviso("Palavra incompleta!")
        return
    }

    const tentativa = pegarLetrasDaLinha()

    if(!palavraExiste(tentativa)){
        mostrarAviso("Palavra inválida!")

        const linha = document. getElementById(
            `linha=${tentativaAtual}`
        )

        linha.classList.add("shake")

        setTimeout(()=> {
            linha.classList.remove("shake")
        }, 400)

        return
    }

    const frequencia = contarLetras(PALAVRA_CERTA)

    let resultado = marcarVerdes(
        tentativa,
        frequencia
    )

    resultado = marcarAmarelosECinzas(
        tentativa,
        frequencia,
        resultado
    )

    // pintar células e teclado
    for(let i = 0; i < TAMANHO_PALAVRA; i++){

        const celula = document.getElementById(
            `celula-${tentativaAtual}-${i}`
        )

        const letra = tentativa[i]

        const tecla = document.querySelector(
            `[data-letra="${letra}"]`
        )

        if(resultado[i] === "correta"){

            celula.classList.add("correta")

            if(tecla){
                tecla.classList.remove(
                    "presente",
                    "ausente"
                )

                tecla.classList.add("correta")
            }

        }else if(resultado[i] === "presente"){

            celula.classList.add("presente")

            if(
                tecla &&
                !tecla.classList.contains("correta")
            ){
                tecla.classList.add("presente")
            }

        }else{

            celula.classList.add("ausente")

            if(
                tecla &&
                !tecla.classList.contains("correta") &&
                !tecla.classList.contains("presente")
            ){
                tecla.classList.add("ausente")
            }
        }
    }

    const todasVerdes = resultado.every(
        status => status === "correta"
    )

    animarRevelacao(todasVerdes)

    if(!todasVerdes && tentativaAtual < TAMANHO_PALAVRA){
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
    for(let i= 0; i<TAMANHO_PALAVRA;i++){
        const celula = document.getElementById(`celula-${tentativaAtual}-${i}`)
        celula.style.animationDelay = `${i*150}ms`
        celula.classList.add("flip")
    }
    setTimeout(() => {
        if(todasVerdes){
            mostrarModal(true)
        }else if(tentativaAtual === 5){
            mostrarModal(false)
        }
    }, 5 * 150 + 500)
}

function pegarLetrasDaLinha(){

    const letras = [] //array vazio

    for(let i=0; i<TAMANHO_PALAVRA; i++){ //passa pegando uma letra de cada vez
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
    jogoAtivo = false
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
    for(let linha = 0; linha<MAX_TENTATIVAS; linha++){
        for(let coluna = 0; coluna<TAMANHO_PALAVRA; coluna++){
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
