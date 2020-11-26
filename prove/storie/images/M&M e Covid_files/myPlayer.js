
var myStory;
var result;
var counter=0;

//funzione generalw
function starter(name){

  myStory = name+"/"+name+".json";

  var head = document.getElementsByTagName('HEAD')[0];
  var link = document.createElement('link');

  link.rel = 'stylesheet';

  link.type = 'text/css';

  link.href = name+"/" +name+".css";

  head.appendChild(link);

  var openScript = document.createElement('script');

  openScript.type="text/javascript";

  openScript.src= name+"/" +name+".js";

  head.appendChild(openScript);


}
//funzione generale
function loadIntro(){

    console.log(myStory);

    $.getJSON(myStory, function(result1){
       result = result1;
       console.log(result.intro);
       document.getElementById("start").outerHTML = result.intro;

    });
}
