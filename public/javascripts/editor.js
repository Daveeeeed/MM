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
    data(){
        return{
            list_item_edit_mission: [
                {
                    name: "Attività",
                    isActive: true,
                },
                {
                    name: "Esiti",
                    isActive: false,
                },
                {
                    name: "Impostazioni",
                    isActive: false,
                },
            ],
            successive_fields: [
                {
                    key: "min",
                    label: "Min",
                    tdClass: "titleFormatter",
                    thStyle: "width: 20%;",
                },
                {
                    key: "max",
                    label: "Max",
                    tdClass: "titleFormatter",
                    thStyle: "width: 20%;",
                },
                {
                    key: "selectableMissions",
                    label: "Attivita",
                    thStyle: "width: 60%;",
                },
            ],
            activity_filter: "",
            selected_path: null,
            selected_activity: null,
            mission_settings: [],
        };
    },
    props: {
        activities: {
            type: Array,
        },
        mission: {
            type: Object,
        },
    },
    computed: {
        filteredActivities() {
            if (this.activity_filter) {
                let a = [];
                this.activities.forEach((element) => {
                    if (element.title.includes(this.activity_filter))
                        a.push(element);
                });
                return a;
            } else return this.activities;
        },
        modalId() {
            return String(this.mission.key);
        },
    },
    methods: {
        checkActivity(activity) {
            let available = true;
            if (this.mission.activities.indexOf(activity) != -1)
                available = false;
            return {
                unavailable: !available,
            };
        },
        onAvailableActivityClick(activity) {
            if (this.mission.activities.indexOf(activity) == -1) {
                this.mission.activities.push(activity);
            } else
                for (let i = 0; i < this.mission.activities.length; i++) {
                    if (this.mission.activities[i] === activity) {
                        this.mission.activities.splice(i, 1);
                        i--;
                    }
                }
        },
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
            return this.giocatore.indexOf("single") != -1;
        },
        gruppo() {
            return this.giocatore.indexOf("group") != -1;
        },
        classe() {
            return this.giocatore.indexOf("class") != -1;
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
                        sette: this.sette,
                        undici: this.undici,
                        quindici: this.quindici,
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

Vue.component("add-simple-mission-modal", {
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
            return this.giocatore.indexOf("single") != -1;
        },
        gruppo() {
            return this.giocatore.indexOf("group") != -1;
        },
        classe() {
            return this.giocatore.indexOf("class") != -1;
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
            let new_mission = {
                key: Date.now(),
                title: this.form.title,
                stages: [],
                player: {
                        single: this.singolo,
                        group: this.gruppo,
                        class: this.classe,
                        sette: this.sette,
                        undici: this.undici,
                        quindici: this.quindici,
                    },
                
            };
            fetch("/api/missions/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(new_mission),
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
                    this.$root.missions = data;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.$root.missions = null;
                });
            this.show = false;
            this.$bvModal.hide("modal-add-simple-mission");
            this.form.title = null;
            this.form.nr = null;
        },
        onReset(event) {
            event.preventDefault();
            this.$bvModal.hide("modal-add-simple-mission");
            this.form.title = null;
            this.form.nr = null;
        },
    },
    template: "#add-simple-mission-modal",
});

Vue.component("modal-edit-path-name", {
    data() {
        return {
            pathName: null,
        }
    },
    props: {
        path: null,
    },
    methods: {
        onHide(){
            this.pathName = JSON.parse(JSON.stringify(this.path.name))
        },
        onOk(){
        this.path.name = this.pathName;
        }
    },
    mounted() {
        if (this.path) this.pathName = JSON.parse(JSON.stringify(this.path.name))
    },
    template: "#modal-edit-path-name-template",
})

Vue.component("modal-edit-story", {
    data() {
        return {
            list_item_edit_story: [
                {
                    name: "Percorsi",
                    isActive: true,
                },
                {
                    name: "Missioni",
                    isActive: false,
                },
                {
                    name: "Esiti",
                    isActive: false,
                },
                {
                    name: "Impostazioni",
                    isActive: false,
                },
            ],
            successive_fields: [
                {
                    key: "min",
                    label: "Min",
                    tdClass: "titleFormatter",
                    thStyle: "width: 20%;",
                },
                {
                    key: "max",
                    label: "Max",
                    tdClass: "titleFormatter",
                    thStyle: "width: 20%;",
                },
                {
                    key: "selectableMissions",
                    label: "Missione",
                    thStyle: "width: 60%;",
                },
            ],
            mission_filter: "",
            selected_path: null,
            selected_mission: null,
            story_settings: [],
        };
    },
    props: {
        storia: null,
        missions: null,
        activities: null,
    },
    computed: {
        filteredMissions() {
            if (this.mission_filter) {
                let a = [];
                this.missions.forEach((element) => {
                    if (element.title.includes(this.mission_filter))
                        a.push(element);
                });
                return a;
            } else return this.missions;
        },
        modalId() {
            return String(this.storia.key);
        },
    },
    methods: {
        selectMission(data){
            let a = [];
            this.selected_path.missions.forEach(mission => {
                if (data.item.key != mission.key) a.push({
                    value: mission.key,
                    text: mission.title
                })
            });
            return a;
        },
        addPath() {
            this.storia.paths.push({
                name: "Senza nome",
                missions: [],
                key: String(Date.now()),
            });
        },
        onPathClick(path) {
            this.selected_path = path;
        },
        pathClass(path) {
            return {
                unavailable: path != this.selected_path,
            };
        },
        showMissionInfos(mission) {
            this.selected_mission = mission;
        },
        checkMission(mission) {
            let available = true;
            if (this.selected_path.missions.indexOf(mission) != -1)
                available = false;
            return {
                unavailable: !available,
            };
        },
        onAvailableMissionClick(mission) {
            if (this.selected_path.missions.indexOf(mission) == -1) {
                this.selected_path.missions.push(mission);
            } else
                for (let i = 0; i < this.selected_path.missions.length; i++) {
                    if (this.selected_path.missions[i] === mission) {
                        this.selected_path.missions.splice(i, 1);
                        i--;
                    }
                }
        },
        addSuccessiveMission() {
            this.selected_mission.successive.push({
                min: 0,
                max: 0,
                key: 3454302,
            });
        },
        onEditStoryMenuClick(item) {
            if (
                (item.name == "Missioni" && this.selected_path) ||
                (item.name == "Esiti" && this.selected_path) ||
                (item.name != "Missioni" && item.name != "Esiti")
            ) {
                this.list_item_edit_story.forEach(
                    (element) => (element.isActive = false)
                );
                item.isActive = true;
            } else console.log("Error: no path selected");
        },
        showQrCode() {
            new Promise((resolve, reject) => {
                this.$bvModal.show("modal-qr-code");
                resolve();
            }).then(() => {
                $("#qrcode").kjua({
                    render: "svg",
                    crisp: true,
                    size: 200,
                    ratio: null,
                    fill: "#000",
                    back: "#fff",
                    text: "ciao",
                    rounded: 0,
                    quiet: 0,
                    // label/image size and pos in pc: 0..100
                    mSize: 30,
                    mPosX: 50,
                    mPosY: 50,
                    // label
                    label: "no label",
                    fontname: "sans",
                    fontcolor: "#333",
                });
            });
        },
    },
    mounted() {
        if (this.storia.settings.player.single)
            this.story_settings.push("single");
        if (this.storia.settings.player.group)
            this.story_settings.push("group");
        if (this.storia.settings.player.class)
            this.story_settings.push("class");
        if (this.storia.settings.player.sette)
            this.story_settings.push("sette");
        if (this.storia.settings.player.undici)
            this.story_settings.push("undici");
        if (this.storia.settings.player.quindici)
            this.story_settings.push("quindici");
    },
    template: "#modal-edit-story",
});

/* MODIFICARE */
Vue.component("add-simple-activity-modal", {
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
            return this.giocatore.indexOf("single") != -1;
        },
        gruppo() {
            return this.giocatore.indexOf("group") != -1;
        },
        classe() {
            return this.giocatore.indexOf("class") != -1;
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
            let new_activity = {
                key: Date.now(),
                title: this.form.title,
                stages: [],
                player: {
                        single: this.singolo,
                        group: this.gruppo,
                        class: this.classe,
                        sette: this.sette,
                        undici: this.undici,
                        quindici: this.quindici,
                    },
                
            };
            fetch("/api/activities/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(new_activity),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/activities");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("activityrk response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    this.$root.activities = data;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    this.$root.activities = null;
                });
            this.show = false;
            this.$bvModal.hide("modal-add-activity");
            this.form.title = null;
            this.form.nr = null;
        },
        onReset(event) {
            event.preventDefault();
            this.$bvModal.hide("modal-add-activity");
            this.form.title = null;
            this.form.nr = null;
        },
    },
    template: "#add-simple-activity-modal",
});

Vue.component("modal-edit-activity", {
    data(){
        return {
            grid_row: 2,
            grid_column: 15,
            list_item_edit_activity: [
                {
                    name: "Attività",
                    isActive: true,
                },
                {
                    name: "Impostazioni",
                    isActive: false,
                },
            ],
            list_item_activity_component: [
                {
                    name: "Testo"
                },
                {
                    name: "Immagine"
                },
                {
                    name: "Video"
                },
                {
                    name: "Custom"
                },
            ],
            list_item_activity_component_special: [
                {
                    name: "Domanda"
                },
                {
                    name: "Scelta Multipla"
                },
                {
                    name: "Foto"
                },
                {
                    name: "Testo"
                },
                {
                    name: "Collega"
                },
                {
                    name: "Riempi"
                },
            ],
            activity_settings: [],
            selected_item: null,
        }
    },
    props: {
        activity: {
            type: Object
        }
    },
    computed: {
        modalId(){
            return String(this.activity.key)
        },
    },
    methods: {
        checkItem(item){
            let selected = true;
            if (this.selected_item != item)
                selected = false;
            return {
                active: selected,
            };
        },
        onComponentClick(item){
            this.selected_item = (this.selected_item == item) ? null : item;
        },
        onEditMenuClick(item) {
            this.list_item_edit_activity.forEach(
                (element) => (element.isActive = false)
            );
            item.isActive = true;
        },
        addSelectedItem(evt){
            if (this.selected_item){
                evt.srcElement.innerHTML = this.selected_item.name
            }
        }
    },
    mounted() {
        if (this.activity.player.single)
            this.activity_settings.push("single");
        if (this.activity.player.group)
            this.activity_settings.push("group");
        if (this.activity.player.class)
            this.activity_settings.push("class");
        if (this.activity.player.sette)
            this.activity_settings.push("sette");
        if (this.activity.player.undici)
            this.activity_settings.push("undici");
        if (this.activity.player.quindici)
            this.activity_settings.push("quindici");
    },
    template: "#modal-edit-activity",
});


var vm = new Vue({
    el: "#app",
    data: {
        isBusy: false,
        stories: null,
        missions: null,
        activities: null,
        story_filter: null,
        mission_filter: null,
        activity_filter: null,
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
        missions_fields:[
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
                key: "player.sette",
                label: "7-10",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.undici",
                label: "11-14",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.quindici",
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
                thStyle: "width: 32%;",
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
                key: "settings.player.sette",
                label: "7-10",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.undici",
                label: "11-14",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 6%;",
            },
            {
                key: "settings.player.quindici",
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
        
        activities_fields: [ 
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
                key: "player.sette",
                label: "7-10",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.undici",
                label: "11-14",
                formatter: "tableFormatter",
                tdClass: "cellFormatter",
                thStyle: "text-align:center; width: 9%;",
            },
            {
                key: "player.quindici",
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
        list_items_activities: [
            {
                name: "Attivita",
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
            return "cell-default";
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
        onEdit(data) {
            this.$bvModal.show(String(data.item.key));
        },
        onDelete(data, collection) {
            this.isBusy = true;
            fetch("/api/" + collection + "/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key: data.item.key }),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/" + collection);
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    switch (collection) {
                        case "stories": {
                            this.stories = data;
                            break;
                        }
                        case "missions": {
                            this.missions = data;
                            break;
                        }
                        case "activities": {
                            this.activities = data;
                            break;
                        }
                    }
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    switch (collection) {
                        case "stories": {
                            this.stories = null;
                            break;
                        }
                        case "missions": {
                            this.missions = null;
                            break;
                        }
                        case "activities": {
                            this.activities = null;
                            break;
                        }
                    }
                });
        },
        onClone(data,collection) {
            this.isBusy = true;
            let cloned = {}
            switch (collection){
                case "stories": {
                    cloned = {
                        key: Date.now(),
                        title: data.item.title,
                        paths: data.item.paths,
                        settings: data.item.settings,
                    };
                    break;
                }
                case "missions": {
                    cloned = {
                        key: Date.now(),
                        title: data.item.title,
                        activities: data.item.activities,
                        player: data.item.player,
                    };
                    break;
                }
                case "activities": {
                    cloned = {
                        key: Date.now(),
                        title: data.item.title,
                        player: data.item.player,
                    };
                    break;
                }
            }
            fetch("/api/" + collection + "/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cloned),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/" + collection);
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    switch (collection) {
                        case "stories": {
                            this.stories = data;
                            break;
                        }
                        case "missions": {
                            this.missions = data;
                            break;
                        }
                        case "activities": {
                            this.activities = data;
                            break;
                        }
                    }
                    this.isBusy = false;
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    switch (collection) {
                        case "stories": {
                            this.stories = null;
                            break;
                        }
                        case "missions": {
                            this.missions = null;
                            break;
                        }
                        case "activities": {
                            this.activities = null;
                            break;
                        }
                    }
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
    fetch("/api/activities")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.activities = data;
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
