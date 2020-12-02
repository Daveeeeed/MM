const progressBar = document.getElementsByClassName('progress-bar')[0];

const increase = setInterval(() => {
	const computedStyle = getComputedStyle(progressBar)
	const width = parseFloat(computedStyle.getPropertyValue('--width')) || 0
	progressBar.style.setProperty('--width', width + .1);
	if(width >= 100){
		clearInterval(increase);	//blocco il timer per non sprecare memoria
	}

}, 10);


/*TODO:
	devo aumentare la progressBar per ogni livello superato dall utente. quindi devo dividere il 
	numero delle domande a cui ha rispost per il totale delle domande. in questo modo
	ottengo una progressione della barra ogni volta che clicko su invia risposta.*/
