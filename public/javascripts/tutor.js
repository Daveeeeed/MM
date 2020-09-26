var vm = new Vue({
    el: "#app",
    data: {
        game: null,
        game_key: "",
    },
    created(){
        this.game = {
            players: []
        }
    }
});


function update() {
    console.log("called");
    fetch("/api/update?game_key=" + vm.$data.game_key)
    .then((response) => response.json())
    .then((data) => {
        vm.$data.game = data[0];
    });
}

$(document).ready(() => {
    let urlParams = new URLSearchParams(window.location.search);
    vm.$data.game_key = urlParams.get('game_key');
    setInterval(update, 5000);
});
