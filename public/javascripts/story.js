Vue.component("loading", {
    props: {
        text: {
            type: String,
        },
    },
    template: `
    <div>
        <div> {{ text }} </div>
    </div>
    `,
});

Vue.component("intro", {
    props: {
        text: {
            type: String,
        },
    },
    methods: {
        next: function () {
            this.$emit('success')
        }
    },
    template: "#intro",
});

Vue.component("connect", {
    props: {
        text: {
            type: String,
        },
        elements: {
            type: Array,
        },
    },
    methods: {
        next: function () {
            this.$emit('success')
        }
    },
    computed: {
        leftElements: function () {
            let array = [];
            for (i = 0; i < this.elements.length; i++) {
                array.push({ text: this.elements[i].left, index: i });
            }
            return array;
        },
        rightElements: function () {
            let array = [];
            for (i = 0; i < this.elements.length; i++) {
                array.push({ text: this.elements[i].right, index: i });
            }
            return array;
        },
    },
    template: "#connect",
});

Vue.component("choice", {
    props: {
        text: {
            type: String,
        },
        answers: {
            type: Object,
        },
    },
    methods: {
        next: function () {
            this.$emit('success')
        }
    },
    template: "#choice",
});

Vue.component("question", {
    props: {
        text: {
            type: String,
        },
        require_validation: {
            type: Boolean,
        },
        acceptable_answers: {
            type: Array,
        },
    },
    methods: {
        next: function () {
            this.$emit('success')
        }
    },
    template: "#question",
});

Vue.component("ending", {
    props: {
        text: {
            type: String,
        },
        game_time: {
            type: Boolean,
        },
        game_points: {
            type: Boolean,
        },
    },
    methods: {
        next: function () {
            this.$emit('success')
        }
    },
    template: '#ending',
});

var vm = new Vue({
    el: "#app",
    data: {
        mission_index: null,
        story: null,
    },
    methods: {
        proceed: function(){
            this.mission_index++;
        }
    },
    computed: {
        mission_template: function () {
            if (this.story)
                return this.story.stages[this.mission_index].template;
            else return null;
        },
        mission_props: function () {
            if (this.story) return this.story.stages[this.mission_index].props;
            else return null;
        },
    },
    created: init,
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
