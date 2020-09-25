var vm = new Vue({
    el: "#app",
    data: {
    },
    computed: {
    },
    methods: {
    }
});

function init() {
    let params = new URL(document.location).searchParams;
    let searchParams = new URLSearchParams(params);
    if (searchParams.has("_id")) {
        fetch("/api/stories?_id=" + searchParams.get("_id"))
            .then((response) => response.json())
            .then((data) => {
                if (data.length == 1) {
                    vm.$data.mission_index = 0;
                    vm.$data.story = data[0];
                } else {
                    // id non trovato nel database
                }
            });
    } else {
        // url senza query id
    }
}
