Vue.component("loading", {
    template: "#loading",
});

Vue.component("story-table", {
    data() {
        return {
            fields: [
                {
                    key: "title",
                    label: "Titolo",
                },
            ],
            selected: null,
            isBusy: false,
        };
    },
    computed: {
        stories() {
            return this.$root.stories;
        },
    },
    methods: {
        onRowSelected(items) {
            this.selected = items.length ? items[0] : null;
        },
    },
    template: "#story-table",
});

Vue.component("info-panel", {
    computed: {
        story() {
            return this.$parent.selected;
        },
    },
    methods: {
        onDelete() {
            this.$parent.isBusy = true;
            fetch("/api/stories/delete?key=" + this.story.key)
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/stories");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    this.$root.stories = data;
                    this.$parent.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.$root.stories = null;
                });
            this.$parent.selected = null;
        },
        onModify() {
            this.$root.modified_story = this.story;
            this.$root.edit_mode = true;
        },
        onPublish() {},
    },
    template: "#info-panel",
});

Vue.component("add-simple-story-modal", {
    data() {
        return {
            form: {
                title: null,
                nr: null,
            },
            show: false,
        };
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.show = true;
            let new_story = {
                key: Date.now(),
                title: this.form.title,
                stages: [],
                settings: {},
            };
            let max = parseInt(this.form.nr);
            for (let i = 0; i < max; i++) {
                new_story.stages.push({
                    template: "",
                    props: {},
                });
            }
            fetch("/api/stories/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(new_story),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/stories");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    this.$root.stories = data;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.$root.stories = null;
                });
            this.show = false;
            this.$bvModal.hide("modal-add-simple-story");
            this.form.title = null;
            this.form.nr = null;
        },
        onReset(event) {
            event.preventDefault();
            this.$bvModal.hide("modal-add-simple-story");
            this.form.title = null;
            this.form.nr = null;
        },
    },
    template: "#add-simple-story-modal",
});

Vue.component("story-edit", {
    data() {
        return {
            selected_stage: null,
            story: JSON.parse(JSON.stringify(this.$root.modified_story)),
        };
    },
    methods: {
        addNewStage() {
            this.story.stages.push({
                title: "Senza Titolo",
                template: null,
                props: {},
            });
        },
    },
    template: "#story-edit",
});

Vue.component("add-mission-modal-template", {
    data() {
        return {
            selected: null,
        };
    },
    methods: {
        onSubmit() {
            event.preventDefault();
            this.$parent.$parent.story.stages.push({
                title: "Senza Titolo",
                template: this.selected,
                props: null,
            });
            this.$bvModal.hide("add-mission-modal");
            this.selected = null;
        },
        onReset() {
            event.preventDefault();
            this.$bvModal.hide("add-mission-modal");
            this.selected = null;
        },
    },
    template: "#add-mission-modal-template",
});

Vue.component("nav-item-content", {
    props: {
        stage: {
            type: Object,
        },
    },
    methods: {
        select() {
            this.$parent.selected_stage = this.stage;
        },
    },
    template: "#nav-item-content",
});

Vue.component("intro", {
    computed: {
        stage() {
            return this.$parent.selected_stage;
        },
    },
    template: "#intro",
});

Vue.component("connect", {
    computed: {
        stage() {
            return this.$parent.selected_stage;
        },
    },
    template: "#connect",
});

Vue.component("multi", {
    computed: {
        stage() {
            return this.$parent.selected_stage;
        },
    },
    template: "#multi",
});

Vue.component("place", {
    computed: {
        stage() {
            return this.$parent.selected_stage;
        },
    },
    template: "#place",
});

Vue.component("question", {
    computed: {
        stage() {
            return this.$parent.selected_stage;
        },
    },
    template: "#question",
});

var vm = new Vue({
    el: "#app",
    data: {
        stories: null,
        modified_story: null,
        edit_mode: false,
    },
    computed: {},
    methods: {},
});

function fetchData() {
    fetch("/api/stories")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.stories = data;
        });
}

$(document).ready(fetchData);
