var domSbagliata = null;
var risposta;
var index = 0;
var myWidth =0;
var correct;
var explatation;
function nextQuestionInput(){
  console.log("DOMANDA:" + result.activity[index].number);
  document.getElementById("initialDiv").outerHTML="";
  if(result.activity[index].number == 1){
    document.getElementById("startbutton").outerHTML = "";
  }
  if (result.activity[index].a2 == null) {
    document.getElementById("myConteiner").innerHTML= result.activity[index].question+"<br>"+result.activity[index].img+"<br>"+result.activity[index].a1+"<br>"+result.activity[index].button;
    document.getElementById("myProgress").style.width= String(myWidth+"%");
    console.log("progress: "+myWidth);
    correct = result.activity[index].correct;
    explatation = result.activity[index].explatation;
    console.log("risposta corretta: "+correct);
  }
  else {
    document.getElementById("myConteiner").innerHTML= result.activity[index].question+"<br><br>"+result.activity[index].img+"<br><br>"+result.activity[index].a1+"<br>"+result.activity[index].a2+"<br>"+result.activity[index].a3+"<br>"+result.activity[index].a4+"<br>"+result.activity[index].button;
    document.getElementById("myProgress").style.width= String(myWidth+"%");
    console.log("progress: "+myWidth);
    correct = result.activity[index].correct;
    explatation = result.activity[index].explatation;
    console.log("risposta corretta: "+correct);
  }

  }

function checkInputType(){
  console.log("check input type");
  risposta = document.getElementById("regIt").value;
  console.log("mia risp: "+risposta);
  if (risposta == correct) {
    if (domSbagliata != null) {
      index = domSbagliata;
      domSbagliata = null;
    }
    index = index +1;
    console.log(index);
    nextQuestionInput();
    myWidth = (myWidth+10);
    document.getElementById("myProgress").style.width= String(myWidth+"%");
  }
  else{
    domSbagliata =index;
    console.log(domSbagliata);
    index = index+1;

    myWidth = (myWidth-5);
    document.getElementById("myProgress").style.width= String(myWidth+"%");
    alert(explatation);

    if (domSbagliata == 8) {
    nextQuestionInput();
    }
    else{
      wrongQuestion();
    }

  }
}

function checkRB(){
  console.log("check input type");

  if ((document.getElementById("a1").checked) && (correct == "a1")) {
    if (domSbagliata != null) {
      index = domSbagliata;
      domSbagliata = null;
    }
  counter = counter +1;
  index = index +1;
  console.log("corretta - a1" + document.getElementById("a1").checked);
  myWidth = (myWidth+10);
  document.getElementById("myProgress").style.width= String(myWidth+"%");
  nextQuestionInput();
  }
  else if ((document.getElementById("a2").checked) && (correct == "a2")) {
    if (domSbagliata != null) {
      index = domSbagliata;
      domSbagliata = null;
    }
  counter = counter +1;
  index = index +1;
  console.log("corretta - a2" + document.getElementById("a2").checked);
  myWidth = (myWidth+10);
  document.getElementById("myProgress").style.width= String(myWidth+"%");
  nextQuestionInput();
  }
  else if ((document.getElementById("a3").checked) && (correct == "a3")) {
    if (domSbagliata != null) {
      index = domSbagliata;
      domSbagliata = null;
    }
  counter = counter +1;
  index = index +1;
  console.log("corretta - a3" + document.getElementById("a3").checked);
  myWidth = (myWidth+10);
  document.getElementById("myProgress").style.width= String(myWidth+"%");
  nextQuestionInput();
  }
  else if ((document.getElementById("a4").checked) && (correct == "a4")) {
    if (domSbagliata != null) {
      index = domSbagliata;
      domSbagliata = null;
    }
  counter = counter +1;
  index = index +1;
  console.log("corretta - a4" + document.getElementById("a4").checked);
  myWidth = (myWidth+10);
  document.getElementById("myProgress").style.width= String(myWidth+"%");
  nextQuestionInput();
  }
  else {
    domSbagliata =index;
    index = index+1;
    console.log("sbagliata");
    myWidth = (myWidth-5);
    document.getElementById("myProgress").style.width= String(myWidth+"%");
    alert(explatation);
    if (domSbagliata == 8) {
      nextQuestionInput();
    }
    else{
    wrongQuestion();
  }
  }
}


function wrongQuestion(){
  console.log("DOMANDA:" + result.activity[index].number);
  document.getElementById("initialDiv").outerHTML="";
    if (result.wrong[index].a2 == null) {
        document.getElementById("myConteiner").innerHTML=  result.wrong[index].question+"<br>"+result.wrong[index].img+"<br>"+result.wrong[index].a1+"<br>"+result.wrong[index].button;
      document.getElementById("myProgress").style.width= String(myWidth+"%");
      correct = result.wrong[index].correct;
      explatation = result.wrong[index].explatation;
      console.log("risposta corretta: "+correct);
    }
    else {
      document.getElementById("myConteiner").innerHTML= result.wrong[index].question+"<br><br>"+result.wrong[index].img+"<br><br>"+result.wrong[index].a1+"<br>"+result.wrong[index].a2+"<br>"+result.wrong[index].a3+"<br>"+result.wrong[index].a4+result.wrong[index].button;
      document.getElementById("myProgress").style.width= String(myWidth+"%");
      correct = result.wrong[index].correct;
      explatation = result.wrong[index].explatation;
      console.log("risposta corretta: "+correct);
    }
}

function endGame(){
  console.log("check end input type");
  risposta = document.getElementById("regIt").value;
  console.log("mia risp: "+risposta);
  if (risposta == correct) {
    myWidth = (myWidth+10);
    document.getElementById("myProgress").style.width= String(myWidth+"%");
  }
  else{
    myWidth = (myWidth-5);
    document.getElementById("myProgress").style.width= String(myWidth+"%");
  }
  console.log(myWidth);
  if (myWidth>80) {
    document.getElementById("myConteiner").innerHTML= "<div class=\"alert alert-success alert-dismissible fade show\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button><strong>Geografo supremo!</strong> Bravo hai dimostrato di essere un grande conoscietore del nostro Bel Paese</div>";
  }
  else if(myWidth>50){
    document.getElementById("myConteiner").innerHTML="<div class=\"alert alert-info alert-dismissible fade show\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button><strong>Ottimo geografo!</strong> Bravo hai dimostrato di conoscere abbastanza l'Italia</div>";
  }
  else{
    document.getElementById("myConteiner").innerHTML="<div class=\"alert alert-danger alert-dismissible fade show\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button><strong>Bravo sei arrivato alla fine!</strong> Non hai dato molte risposte corrette, ma se continui a studiare diventerai il migliore!</div>";
  }
  document.getElementById("myConteiner").innerHTML = document.getElementById("myConteiner").innerHTML+"<div><a href=\"http://site192006.tw.cs.unibo.it\"><button class=\"btn btn-info\">Fine</button></a></div>"
}
