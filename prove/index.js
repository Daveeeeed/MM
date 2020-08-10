var app = new Vue({
	el: "#app",
	data: {
		titolo : "hello world"
	}

});
document.getElementById("saluto").addEventListener("click",function() {
	app.titolo = "mi hai clickato!";
})