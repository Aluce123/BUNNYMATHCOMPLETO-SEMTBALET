const Motor = Matter.Engine,
Mundo = Matter.World,
Corpos = Matter.Bodies,
SAT = Matter.SAT;

let motor;
let jogador;
let imagemfundo;
let porta;
let chave;
let estadoJogo= "inicio";
let pegouChave = false;
let moeda;
let pegouMoeda = false;
let pontuacao = 0;


let plataformas =[];

let nivelAtual = 1;

function preload(){
imagemfundo = loadImage('imagens/Sample.png')
fonte = loadFont('FONTE.ttf')
}

function setup() {
  createCanvas(windowWidth, windowHeight);

    motor = Motor.create();
    mundo = motor.world;
 
  botaoreiniciar = createButton('Começar')
  botaoreiniciar.position(width-120, height-125)
  botaoreiniciar.size(100,100);
  botaoreiniciar.style('font-size', '20px')
  botaoreiniciar.style('background-color', 'violet')
  botaoreiniciar.style('border', '2px solid purple')
  botaoreiniciar.style('border-radius', '300px')
  botaoreiniciar.style('cursor', 'pointer')
  botaoreiniciar.mousePressed(()=>{
    reiniciar();
  })

  botaoesquerda = createButton('←')
  botaoesquerda.position(width/18, height-125)
  botaoesquerda.size(100,100);
  botaoesquerda.style('font-size', '40px')
  botaoesquerda.style('background-color', 'violet')
  botaoesquerda.style('border', '2px solid purple')
  //botaoesquerda.style('border-radius', '300px')
  botaoesquerda.style('cursor', 'pointer')

botaoesquerda.mousePressed(()=>
jogador.mover(-0.08)
)

  botaodireita = createButton('→')
  botaodireita.position(width/4, height-125)
  botaodireita.size(100,100);
  botaodireita.style('font-size', '40px')
  botaodireita.style('background-color', 'violet')
  botaodireita.style('border', '2px solid purple')
  //botaodireita.style('border-radius', '300px')
  botaodireita.style('cursor', 'pointer')

  botaodireita.mousePressed(()=>
jogador.mover(0.08)
)

botaopular = createButton('⤒')
  botaopular.position(width-120, height-125)
  botaopular.size(100,100);
  botaopular.style('font-size', '20px')
  botaopular.style('background-color', 'violet')
  botaopular.style('border', '2px solid purple')
  botaopular.style('border-radius', '300px')
  botaopular.style('cursor', 'pointer')
   botaopular.mousePressed(()=>
jogador.pular()
)


  // Fazer mais plataformas!!!!

 fundo = createSprite(windowWidth/4+610, windowHeight/4-300)
 fundo.addImage(imagemfundo);
 fundo.scale = 3.5

 iniciarNivel(nivelAtual);
}


function draw() {
  background(imagemfundo);

  Motor.update(motor);
if(jogador.corpo.position.y>height-100){

  estadoJogo="perdeu"
}

if(estadoJogo==="perdeu"){
    botaodireita.hide()
  botaoesquerda.hide()
  botaopular.hide()
  background("Forestgreen")
  textFont(fonte)
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50)
    text("Você perdeu! Tente novamente.", width/2, height/2);
    textFont(fonte)
    textAlign(CENTER,CENTER );
    textSize(38)
    text("Aperte espaço para reiniciar. ", width/2, height-100);
    return;

}

else if(estadoJogo==="inicio"){
  pontuacao=0
    botaodireita.hide()
  botaoesquerda.hide()
  botaopular.hide()
  textFont(fonte)
  fill("DeepPink")
  textAlign(CENTER, CENTER)
  textSize(64)
  text("Bunny Math", width/2, height-400)
   textFont(fonte)
textAlign(CENTER,CENTER );
    fill("black")
    textSize(38)
    text("Aperte espaço para começar. ", width/2, height-330);
  botaopular.hide()
}

else if(estadoJogo==="jogando"){

 botaoreiniciar.hide()
 botaopular.show()
   botaodireita.show()
  botaoesquerda.show()

  push()

  translate(-jogador.corpo.position.x+width/2, -jogador.corpo.position.y+height/2)

  drawSprites();
  if(jogador){
  jogador.mostrar();
  }

  if(porta){
  porta.mostrar();
  }

  if(!pegouChave){
   chave.mostrar();
  }

  if(!pegouMoeda){
 moeda.mostrar();
  }

  for(let plataforma of plataformas){
    plataforma.mostrar();

    if(jogadorTocandoPlataforma(jogador, plataforma))
      jogador.resetarPulos();


  }




  verificarColisaoPorta(jogador,porta)
  verificarColisaoChave(jogador,chave)
  verificarColisaoMoeda(jogador, moeda)


pop();

fill("DeepPink")
textSize(28)
text("Nível Atual: "+ nivelAtual, width-300, height-150)

}else if(estadoJogo==="errouQuiz"){
    background("purple")
    textFont(fonte)
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50)
    text("Você errou a equação! Volte para o começo. ", width/2, height/2);
    textFont(fonte)
    textAlign(CENTER,CENTER );
    textSize(38)
    text("Aperte espaço para reiniciar. ", width/2, height-100);
  }
fill("Black")
textSize(28)
text("Pontuação: "+ pontuacao, width-300, height-100)



}
function keyPressed(){
  if(keyCode === RIGHT_ARROW){
    console.log("DIREITO OK")
    jogador.mover(0.08);

  }else if(keyCode === LEFT_ARROW){
    jogador.mover(-0.08);
  }else if(keyCode === UP_ARROW){
    jogador.pular();
  }else if(estadoJogo === "perdeu" || estadoJogo === "errouQuiz" || estadoJogo==="inicio"){
    if(key === ' '){
      reiniciar();
    }
  }
}


function jogadorTocandoPlataforma(jogador, plataforma){
  const posicaoJogador = jogador.corpo.position;
  const posicaoPlataforma = plataforma.corpo.position;


    const margem = 5;


  const tocando =


    posicaoJogador.y + jogador.altura / 2 >= posicaoPlataforma.y - plataforma.altura / 2 - margem && // jogador está em cima
    posicaoJogador.y + jogador.altura / 2 <= posicaoPlataforma.y - plataforma.altura / 2 + margem && // dentro da margem
    posicaoJogador.x + jogador.largura / 2 >= posicaoPlataforma.x - plataforma.largura / 2 && // largura esquerda
    posicaoJogador.x - jogador.largura / 2 <= posicaoPlataforma.x + plataforma.largura / 2;   // largura direita


    return tocando;
}

function verificarColisaoPorta(jogador, porta){
  const colisao =SAT.collides(jogador.corpo, porta.corpo);
  if(colisao.collided&&pegouChave===true){
    mostrarQuiz();

  }
}

function mostrarQuiz(){
if (nivelAtual==1) {
  let resposta = prompt ("Calcule o valor de x 3x-5=16 \n a)7 \n b)11 \n c)21 \n d)9 ");
if(resposta && resposta.toLowerCase() ==="a" ){
alert("Resposta correta! Indo para o próximo nível...");
estadoJogo="acertouQuiz";
nivelAtual++
iniciarNivel(nivelAtual);
console.log(nivelAtual)
pontuacao +=25
}else{
 estadoJogo="errouQuiz";
}}
 else if(nivelAtual==2){
let resposta = prompt ("Calcule o valor de x -> 2(x+4)=3x-2 \n a)-10 \n b)8 \n c)10 \n d)4 ");
if(resposta && resposta.toLowerCase() ==="c" ){
alert("Resposta correta! Indo para o próximo nível...");
estadoJogo="acertouQuiz";
nivelAtual++
iniciarNivel(nivelAtual);
console.log(nivelAtual)
pontuacao +=25
}else{
 estadoJogo="errouQuiz";
}}else if(nivelAtual==3){
let resposta = prompt ("2(3x+1)-3(6-2x)=20 \n a)18 \n b)6 \n c)3 \n d)9 ");
if(resposta && resposta.toLowerCase() ==="c" ){
alert("Resposta correta! Indo para o próximo nível...");
estadoJogo="acertouQuiz";
nivelAtual++
iniciarNivel(nivelAtual);
console.log(nivelAtual)
pontuacao +=25
}else{
 estadoJogo="errouQuiz";
}}else if(nivelAtual==4){
let resposta = prompt ("9x - 4x + 10 = 7x - 30 \n a)18 \n b)20 \n c)7 \n d)9 ");
if(resposta && resposta.toLowerCase() ==="b" ){
alert("Resposta correta! Indo para o próximo nível...");
estadoJogo="acertouQuiz";
nivelAtual++
iniciarNivel(nivelAtual);
console.log(nivelAtual)
pontuacao +=25
}else{
 estadoJogo="errouQuiz";
}}else if(nivelAtual==5){
let resposta = prompt ("(3x - 5)/2 + 4 = (2x + 7)/3 + 5 \n a)5 \n b)7 \n c)12 \n d)6  \n obs.: / é igual a fração");
if(resposta && resposta.toLowerCase() ==="d" ){
alert("Parabéns! Você conseguiu vencer! Você é o mestre da matemática!!!");
estadoJogo="acertouQuiz";
nivelAtual++
iniciarNivel(nivelAtual);
console.log(nivelAtual)
pontuacao +=25
}else{
 estadoJogo="errouQuiz";
}}
}




function reiniciar(){
  if(nivelAtual===1){
  pegouChave=false
  pegouMoeda=false
   Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
  estadoJogo="jogando";}
  else if(nivelAtual===2){
  pegouChave=false
  pegouMoeda=false
  Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
estadoJogo="jogando";}
else if(nivelAtual===3){
  pegouChave=false
  pegouMoeda=false
  Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
estadoJogo="jogando";}
else if(nivelAtual===4){
  pegouChave=false
  pegouMoeda=false
  Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
estadoJogo="jogando";}
else if(nivelAtual===5){
  pegouChave=false
  pegouMoeda=false
  Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
estadoJogo="jogando";}
//alert("jogo reiniciado!")
}

function verificarColisaoChave(jogador,chave){
  const posJogador = jogador.corpo.position;
  const posChave = chave.corpo.position;


  const distancia = dist(posJogador.x, posJogador.y, posChave.x, posChave.y)
  if(distancia<80 && !pegouChave){
    pegouChave= true;
    console.log("Pegou a chave")
    pontuacao = pontuacao + 5
      Mundo.remove(mundo, chave.corpo);
   
  }
}

function verificarColisaoMoeda(jogador,moeda){
  const posJogador = jogador.corpo.position;
  const posMoeda = moeda.corpo.position;


  const distancia = dist(posJogador.x, posJogador.y, posMoeda.x, posMoeda.y)
  if(distancia<80 && !pegouMoeda){
    pegouMoeda= true;
    console.log("Pegou a moeda")
      Mundo.remove(mundo, moeda.corpo);
    pontuacao = pontuacao +10
      
  }
}

function nivel1(){
      jogador = new Jogador (150, height - 250, 50, 50);
    porta = new Porta(1600, height -1250, 100, 100);
    chave = new Chave(1400, height -1050,70,70 )
    moeda = new Moeda(500, height -700, 50, 50);

    plataformas.push(new Plataformas(1600, height-1200, 200,20));
    plataformas.push(new Plataformas(500, height-600, 200,20));
    plataformas.push(new Plataformas(100, height-200, 200,20));
    plataformas.push(new Plataformas(1200, height-900, 200,20));
    plataformas.push(new Plataformas(900, height-400, 200,20));
    
}

function iniciarNivel(nivel){
  removerTudo();
  if(nivel===1){
    nivel1();
  } else if(nivel===2){
    nivel2();///=== é comparação 
  }else if(nivel===3){
    nivel3();
  }else if(nivel===4){
    nivel4();
  }else if(nivel===5){
    nivel5();
  }

}

function nivel2(){
    pegouChave=false
  estadoJogo="jogando";
   
   jogador = new Jogador (150, height - 250, 50, 50);
    porta = new Porta(1800, height -1300, 100, 100);
    chave = new Chave(1400, height -1050,70,70 )
    moeda = new Moeda(500, height -700, 50, 50);

   plataformas.push(new Plataformas(1800, height - 1250, 200, 20));  
plataformas.push(new Plataformas(1300, height - 650, 150, 20));   
plataformas.push(new Plataformas(850, height - 950, 180, 20)); 
plataformas.push(new Plataformas(600, height - 600, 150, 20));        
plataformas.push(new Plataformas(100, height - 200, 250, 20));    

}

function nivel3(){
    pegouChave=false
  estadoJogo="jogando";
   
   jogador = new Jogador (150, height - 250, 50, 50);
    porta = new Porta(2100, height -1150, 100, 100);
    chave = new Chave(1400, height -1050,70,70 )
    moeda = new Moeda(800, height -600, 50, 50);

 plataformas.push(new Plataformas(100, height - 150, 200, 20));       // inicial
  plataformas.push(new Plataformas(500, height - 300, 150, 20));       // salto horizontal médio
  plataformas.push(new Plataformas(900, height - 750, 120, 20));       // precisa de precisão
  plataformas.push(new Plataformas(1250, height - 950, 150, 20));      // boa para recuperar impulso
  plataformas.push(new Plataformas(1700, height - 700, 150, 20));      // mais difícil
  plataformas.push(new Plataformas(2100, height - 1100, 150, 20));     // onde está a chave
}

function nivel4(){
    pegouChave=false
  estadoJogo="jogando";
   
 jogador = new Jogador(150, height - 250, 50, 50);
porta = new Porta(2400, height - 1200, 100, 100);
chave = new Chave(1850, height - 800, 70, 70);
moeda = new Moeda(1100, height - 500, 50, 50);

plataformas.push(new Plataformas(100, height - 150, 200, 20));        // inicial
plataformas.push(new Plataformas(500, height - 300, 150, 20));        // salto 1
plataformas.push(new Plataformas(850, height - 500, 120, 20));        // moeda
plataformas.push(new Plataformas(1250, height - 700, 150, 20));       // impulso
plataformas.push(new Plataformas(1700, height - 800, 150, 20));       // chave
plataformas.push(new Plataformas(2100, height - 1000, 150, 20));      // final
plataformas.push(new Plataformas(2400, height - 1150, 150, 20));    

}

function nivel5(){
    pegouChave=false
  estadoJogo="jogando";
   
 jogador = new Jogador(150, height - 250, 50, 50);
  porta = new Porta(2800, height - 1200, 100, 100);
  chave = new Chave(2200, height - 950, 70, 70);
  moeda = new Moeda(1400, height - 700, 50, 50);

  plataformas.push(new Plataformas(100, height - 150, 180, 20));
  plataformas.push(new Plataformas(500, height - 400, 150, 20));
  plataformas.push(new Plataformas(900, height - 650, 120, 20));
  plataformas.push(new Plataformas(1300, height - 750, 150, 20));
  plataformas.push(new Plataformas(1700, height - 600, 100, 20));
  plataformas.push(new Plataformas(2100, height - 850, 130, 20));
  plataformas.push(new Plataformas(2500, height - 1000, 150, 20));
  plataformas.push(new Plataformas(2800, height - 1150, 200, 20));
}

function removerTudo(){
  for (let plataforma of plataformas){
    if(plataforma.corpo){
      Mundo.remove(mundo, plataforma.corpo);

    }
  }
plataformas = [];

if(chave && chave.corpo){
  Mundo.remove(mundo, chave.corpo);
  chave=null;
}

if(porta && porta.corpo){
  Mundo.remove(mundo, porta.corpo);
  porta =null;
}

if(moeda && moeda.corpo){
  Mundo.remove(mundo, moeda.corpo);
  moeda=null;
}

}

    function windowResized(){
        resizeCanvas(windowWidth, windowHeight);
    }
    // atividade: comentários + plataformas

    //adicionar imagem na porta, vê contas e alternativas, posicao da porta(1400, 1200, 100, 100)
    //moedas de X(dica ou pontos, aumentar chance.) - classe da moedinha ou chave pra porta
    //salvar no github

    //x+7=12 a)19 b)5 c)12 d)7 
    // 3x-5=16 a)7 b)11 c)21 d)9
    //2(x+4)=3x-2 a)-10 b)8 c)4 d)10
    // 3x+1/4 = x+5/2 a) 2 b)-9 c)9 d)8
    //2(3x+1)-3(6-2x)=20 a)18 b)6 c)3 d)9
    //2x+10-15+3x=5 a)2 b)3 c)4 d)5
