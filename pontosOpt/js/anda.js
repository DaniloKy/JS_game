$().ready(function(){
    //cria e atualiza a tabela quando for adicionada uma nova coluna ou celula
    var tabela = new Array();
    function update(){
        //main array com o tamanho dos p no HTML
        tabela = new Array($("#tabela p").length);
        $("#tabela p").each(function(i){
            //cria um novo array dentro do main array
            tabela[i] = new Array($("#tabela p:eq(0) span").length); 
            $("#tabela p:eq(0) span").each(function(f){
                //coloca cada lugar como "0" (vazio)
                tabela[i][f] = "0";
                $("#tabela p:eq("+i+") span:eq("+f+")").removeClass("ocupar ponto");
                //coloca o bloco ocupado na primeira posição
                tabela[0][0] = "1";
                $("#tabela p:eq("+0+") span:eq("+0+")").addClass("ocupar");
            })
        })
        return tabela;
    };
    update();
    var pontos = 0;
    //função que vai gerar os blocos vermelhos
    function gerar(){
        //gera um numero random entre o numero de p que existem na tabela
        var x = Math.floor(Math.random()*$("#tabela p").length)
        //gera um numero random entre o numero de span dentro de um p
        var y = Math.floor(Math.random()*$("#tabela p:eq(0) span").length)
        //verifica se a possição gerada,já não esta ocupado por um bloco azul e vermelho ou se esta numa posição livre
        if(tabela[x][y] != "1" && tabela[x][y] != "2" || tabela[x][y] == "0" ){
            tabela[x][y] = "2";
            $("#tabela p:eq("+x+") span:eq("+y+")").addClass("ponto");
        }else
            //se estiver ocupada gera novamente
            gerar();
    }
    gerar();
    console.log(tabela);
    //funcao que faz o bloco andar, cima, baixo, esqueda, direita
    function andar(up, right, down, left){
        //percure a tabela
        for(var i = 0; i < tabela.length; i++)
            for(var f = 0; f < tabela[i].length; f++)
                //encontra o bloco ocupado(azul)
                if(tabela[i][f] == "1"){
                    //adiciona mais 1 ou menos 1 ao bloco ocupado, dependendo do direcao que queremos ir
                    var proximoI = (i-up+down);
                    var proximoF = (f+right-left);
                    //verifica se o bloco pode passar para proxima posicao
                    //se for na esquerda "F=0" ou na direira "tabela[i].length", e em cima "I=0" ou em baixo
                    if(proximoF < 0 || proximoF >= tabela[i].length || proximoI < 0 || proximoI >= tabela.length)
                        alert("Indisponivel");
                    else{
                        //se for disponivel entao
                        //verifica antes de o proximo bloco é vermelho e se for limpa, da um ponto, e gera mais uma vez
                        if(tabela[proximoI][proximoF] == "2"){
                            //tabela[proximoI][proximoF] = "1";
                            $("#tabela p:eq("+proximoI+") span:eq("+proximoF+")").removeClass("ponto");
                            pontos++;
                            gerar();
                        }
                        //desocupa o lugar, e ocupa o proximo
                        tabela[i][f] = "0";
                        $("#tabela p:eq("+i+") span:eq("+f+")").removeClass("ocupar");
                        tabela[proximoI][proximoF] = "1";
                        $("#tabela p:eq("+proximoI+") span:eq("+proximoF+")").addClass("ocupar");
                        //atualiza os pontos visualmente
                        $("#pontos").text("Pontos: "+pontos);
                        //para todos os fluxos e a função
                        return;
                    }
                }
    }
    //teclado
    //verifica o KeyCode da tecla precionada
    $(window).keypress(function(e){
        switch(e.keyCode){
            case 119: andar(1,0,0,0);break;
            case 100: andar(0,1,0,0);break;
            case 115: andar(0,0,1,0);break;
            case 97: andar(0,0,0,1);break;
            case 114: location.reload();break;
        }
    })
    //botoes de cima, baixo, esquerda, direita
    $("#up").click(function(){
        andar(1,0,0,0);
    });
    $("#right").click(function(){
        andar(0,1,0,0);
    });
    $("#down").click(function(){
        andar(0,0,1,0);
    });
    $("#left").click(function(){
        andar(0,0,0,1);
    });
    var vezes = 0;
    var vezesR = 0;
    var vezesC = 0;
    //Maximo de cells e rows permitidas
    const MAX = 10;
    //botoes para adicionar rows e cells
    $("#addRow").click(function() {
        vezesR++;
        //verificar se ja passoa o limite de rows permitidas
        if (vezesR <= MAX) {
            vezes++;
            //adicionar mais um p com o numero de spans correspondente
            $("#tabela").append($("<p>"));
            $("#tabela p:eq(0) span").each(function() {
                $("#tabela p:last-child").append($("<span>"));
            });
            //atualiza o array
            tabela = update();
            //gera um bloco vermeho
            gerar();
            //gera mais blocos vermelhos com forme o numero de vezes clicadas no addCell e addRow
            for (var i = 0; i < Math.floor(vezes / 2); i++)
                gerar();
        } else
            alert("Excedeu o limite de Rows");
      });
    $("#addCell").click(function(){
        vezesC++;
        if(vezesC <= MAX){
            vezes++;
            //largura do div(tabela) += outerHeight(true) dos spans
            $("#tabela").css("width",($("#tabela").width()+($("#tabela p span").outerHeight(true)))+"px");
            //cria mais uma linha de spans para cada p na tabela
            $("#tabela p").append($("<span>"));
            //atualiza o array
            tabela = update();
            //gera um bloco vermeho
            gerar();
            //gera mais blocos vermelhos com forme o numero de vezes clicadas no addCell e addRow
            for (var i = 0; i < Math.floor(vezes / 2); i++)
                gerar();
        }else
            alert("Excedeu o limite de Cells");
    });
});