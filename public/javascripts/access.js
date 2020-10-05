var vm = new Vue({
    el: "#app",
    data: {
        story_key: null,
        tutor_game_key: null,
        player_game_key: null,
        correct_input: true,
    },
    computed: {
        correctInput(){
            if (!this.correct_input){
                if (this.player_game_key){
                    this.correct_input = true;
                } else return false;
            } else return null;
        }
    },
    methods: {
        openPlayerModal(){
            this.$bvModal.show('player-modal');
        },
        openTutorModal(){
            this.tutor_game_key = String(Math.round(Math.random() * 9999));
            this.$bvModal.show('tutor-modal');
        },
        confirmTutor(){
            fetch("/api/tutor?game_key=" + this.tutor_game_key + "&story_key=" + this.story_key,{
                method: "POST",
            })
            .then(response => window.location = "/tutor?game_key=" + this.tutor_game_key + "&story_key=" + this.story_key)
        },
        confirmPlayer(){
            let player_id = String(Date.now());
            fetch("api/player?game_key=" + this.player_game_key + "&story_key=" + this.story_key + "&player_id=" + player_id,{
                method: "POST",
            })
            .then(response => response.json())
            .then(data => {
                if(data.ok){
                    window.location = "/story?game_key=" + this.player_game_key + "&story_key=" + this.story_key + "&player_id=" + player_id;
                }
                else {
                    this.player_game_key = "";
                    this.correct_input = false;
                }
            })
        },
    },
    mounted(){
        let urlParams = new URLSearchParams(window.location.search);
        this.story_key = urlParams.get('key');
    }
});