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

Vue.component("modal-edit-mission", {
    props: {
        mission: {
            type: Object,
        },
    },
    computed: {
        modalId(){
            return String(this.mission.key)
        }
    },
    methods: {
    },
    template: "#modal-edit-mission-template",
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
        singolo() {
            return this.giocatore.indexOf("singolo") != -1;
        },
        gruppo() {
            return this.giocatore.indexOf("gruppo") != -1;
        },
        classe() {
            return this.giocatore.indexOf("classe") != -1;
        },
        sette() {
            return this.eta.indexOf("sette") != -1;
        },
        undici() {
            return this.eta.indexOf("undici") != -1;
        },
        quindici() {
            return this.eta.indexOf("quindici") != -1;
        },
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
                    },
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

Vue.component("modal-edit-story", {
    data() {
        return {
            list_item_edit_story: [
                {
                    name: "Selezione Missioni",
                    isActive: true,
                },
                {
                    name: "Collega Missioni",
                    isActive: false,
                },
                {
                    name: "Impostazioni",
                    isActive: false,
                },
            ],
            mission_filter: "",
        }
    },
    props: {
        storia: null,
        missions: null,
    },
    computed: {
        filteredMissions() {
            if (this.mission_filter){
                let a = []
                this.missions.forEach((element) => {
                    if (element.title.includes(this.mission_filter)) a.push(element)
                })
                return a;
            } else return this.missions
        },
        modalId() {
            return String(this.storia.key);
        },
    },
    methods: {
        checkMission(mission) {
            let available = true
            if(this.storia.missions.indexOf(mission) != -1) available = false;
            return {
                unavailable: !available,
            }
        },
        onAvailableMissionClick(mission) {
            if(this.storia.missions.indexOf(mission) == -1) this.storia.missions.push(mission)
            else for(let i = 0; i < this.storia.missions.length; i++){
                if ( this.storia.missions[i] === mission) {
                    this.storia.missions.splice(i, 1);
                    i--;
                }
            }
        },
        onEditStoryMenuClick(data) {
            console.log(data)
            this.list_item_edit_story.forEach((element) => {
                if (element.name !== data.srcElement.innerText) element.isActive = false;
                else element.isActive = true;
            });
        },
        showQrCode() {
            new Promise((resolve,reject) => {
                this.$bvModal.show('modal-qr-code')
                resolve()
            })
            .then(() => {
                $('#qrcode').kjua({
                    render: 'svg',
                    crisp: true,
                    size: 200,
                    ratio: null,
                    fill: '#000',
                    back: '#fff',
                    text: 'ciao',
                    rounded: 0,
                    quiet: 0,
                    // label/image size and pos in pc: 0..100
                    mSize: 30,
                    mPosX: 50,
                    mPosY: 50,
                    // label
                    label: 'no label',
                    fontname: 'sans',
                    fontcolor: '#333',
                });
            })
        }
    },
    template: "#modal-edit-story",
});

var vm = new Vue({
    el: "#app",
    data: {
        isBusy: false,
        stories: null,
        missions: null,
        story_filter: null,
        mission_filter: null,
        filter_field: ["title"],
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
        missions_fields: [
            {
                key: "title",
                label: "Titolo",
                tdClass: "titleFormatter",
                thStyle: "width: 34%;",
            },
            {
                key: "player.single",
                label: "Singolo",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.group",
                label: "Gruppo",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.class",
                label: "Classe",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.7_10",
                label: "7-10",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.11_14",
                label: "11-14",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.15_18",
                label: "15-18",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center;  width: 9%;",
            },
            {
                key: "actions",
                label: "Azioni",
                thStyle: "width: 12%;",
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
        list_items_missions: [
            {
                name: "Missioni",
                isActive: true,
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
                body: JSON.stringify({ key: data.item.key }),
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
            this.$bvModal.show(String(data.item.key));
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
        onDeleteMission(data) {
            is;
            this.isBusy = true;
            fetch("/api/missions/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key: data.item.key }),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/missions");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    this.missions = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.missions = null;
                });
        },
        onEditMission(data) {
            console.log(data)
            this.$bvModal.show(String(data.item.key));
        },
        onCloneMission(data) {
            this.isBusy = true;
            let cloned = {
                key: Date.now(),
                title: data.item.title,
                activities: data.item.activities,
                player: data.item.player,
            };
            fetch("/api/missions/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cloned),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/missions");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    this.missions = data;
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.missions = null;
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
    fetch("/api/missions")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.missions = data;
        });
    /* http://localhost:8000/api/stories
       4 colonne di tipo b-col
       ogni colonna ha l'overflow nell'asse y ovvero la puoi scorrere in su e giu
       la prima boh
       la seconda ha tanti elementi quante le missioni disponibili
       la terza tanti elementi quante le missioni selezionate
       la quarta ha diversi elementi come se fosse una pagina a parte, ha il titolo in alto, sotto alcuni dettagli
       e sotto ancora la tabella degli esiti
       */
}

$(document).ready(fetchData);
