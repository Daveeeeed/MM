Vue.component("custom-navbar-item", {
    props: {
        item: {
            type: Object,
        },
    },
    methods: {
        onClick() {
            this.$root.navbar_items.forEach((element) => {
                if (element.name !== this.item.name) element.isActive = false;
                else element.isActive = true;
            });
        },
    },
    template: "#custom-navbar-item",
});

Vue.component("custom-list-item", {
    props: {
        item: {
            type: Object,
        },
    },
    methods: {
        onClick() {
            this.$root.list_items_stories.forEach((element) => {
                if (element.name !== this.item.name) element.isActive = false;
                else element.isActive = true;
            });
        },
    },
    template: "#custom-list-item",
});

Vue.component("add-simple-story-modal", {
    data() {
        return {
            form: {
                title: null,
            },
            eta: [],
            giocatore: [],
            show: false,
        };
    },
    computed: {
        singolo(){
            return (this.giocatore.indexOf("singolo") != -1)
        },
        gruppo(){
            return (this.giocatore.indexOf("gruppo") != -1)
        },
        classe(){
            return (this.giocatore.indexOf("classe") != -1)
        },
        sette(){
            return (this.eta.indexOf("sette") != -1)
        },
        undici(){
            return (this.eta.indexOf("undici") != -1)
        },
        quindici(){
            return (this.eta.indexOf("quindici") != -1)
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.show = true;
            let new_story = {
                key: Date.now(),
                title: this.form.title,
                stages: [],
                settings: {
                    archived: false,
                    published: false,
                    player: {
                        single: this.singolo,
                        group: this.gruppo,
                        class: this.classe,
                        "7_10": this.sette,
                        "11_14": this.undici,
                        "15_18": this.quindici,
                    }
                },
            };
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

var vm = new Vue({
    el: "#app",
    data: {
        isBusy: false,
        stories: null,
        story_filter: null,
        story_filter_field: ["title"],
        navbar_items: [
            {
                name: "Storie",
                isActive: true,
            },
            {
                name: "Missioni",
                isActive: false,
            },
            {
                name: "Attività",
                isActive: false,
            },
        ],
        stories_fields: [
            {
                key: "title",
                label: "Titolo",
                tdClass: "titleFormatter",
                thStyle: "width: 33%;",
            },
            {
                key: "settings.published",
                label: "Pubblicata",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 14%;",
            },
            {
                key: "settings.player.single",
                label: "Singolo",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.group",
                label: "Gruppo",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.class",
                label: "Classe",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.7_10",
                label: "7-10",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.11_14",
                label: "11-14",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.15_18",
                label: "15-18",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center;  width: 6%;",
            },
            {
                key: "actions",
                label: "Azioni",
                thStyle: "width: 17%;",
            },
        ],
        list_items_stories: [
            {
                name: "Storie",
                isActive: true,
            },
            {
                name: "Archiviate",
                isActive: false,
            },
        ],
    },
    computed: {
        archivedStories() {
            if (this.stories) {
                let a = [];
                this.stories.forEach((element) => {
                    if (element.settings.archived) a.push(element);
                });
                return a;
            } else return null;
        },
        availableStories() {
            if (this.stories) {
                let a = [];
                this.stories.forEach((element) => {
                    if (!element.settings.archived) a.push(element);
                });
                return a;
            } else return null;
        },
    },
    methods: {
        tableFormatter(value) {
            return value ? "✓ Yes" : "✗ No";
        },
        titleFormatter() {
            return "cell-title";
        },
        cellFormatter(value) {
            return value ? "cell-true" : "cell-false";
        },
        onPublish(data) {
            data.item.settings.published = !data.item.settings.published;
            this.isBusy = true;
            fetch("/api/stories/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data.item),
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
                    this.stories = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.stories = null;
                });
        },
        onArchive(data) {
            data.item.settings.archived = !data.item.settings.archived;
            this.isBusy = true;
            fetch("/api/stories/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data.item),
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
                    this.stories = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.stories = null;
                });
        },
        onDelete(data) {
            this.isBusy = true;
            fetch("/api/stories/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key : data.item.key}),
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
                    this.stories = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.stories = null;
                });
        },
        onEdit(data) {
            console.log(data);
        },
        onClone(data) {
            this.isBusy = true;
            let cloned = {
                key: Date.now(),
                title: data.item.title,
                stages: data.item.stages,
                settings: data.item.settings,
            };
            fetch("/api/stories/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cloned),
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
                    this.stories = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.stories = null;
                });
        },
    },
});

function fetchData() {
    fetch("/api/stories")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.stories = data;
        });
}

$(document).ready(fetchData);
