Vue.component("add-new-element", {
    data() {
        return {
            title: "",
            sette: false,
            undici: false,
            quindici: false,
            singolo: false,
            gruppo: false,
            classe: false,
        };
    },
    props: {
        category: {
            type: String,
        },
    },
    methods: {
        collectionName() {
            switch (this.category) {
                case "Storie":
                    return "stories";
                case "Missioni":
                    return "missions";
                case "Attività":
                    return "activities";
            }
        },
        newElement() {
            switch (this.category) {
                case "Storie":
                    return {
                        key: String(Date.now()),
                        title: this.title,
                        paths: [],
                        settings: {
                            published: false,
                            archived: false,
                            player: {
                                sette: this.sette,
                                undici: this.undici,
                                quindici: this.quindici,
                                single: this.singolo,
                                group: this.gruppo,
                                class: this.classe,
                            },
                        },
                    };
                case "Missioni":
                    return {
                        key: String(Date.now()),
                        title: this.title,
                        activities: [],
                        player: {
                            sette: this.sette,
                            undici: this.undici,
                            quindici: this.quindici,
                            single: this.singolo,
                            group: this.gruppo,
                            class: this.classe,
                        },
                        first_activity: null,
                        results: [
                            {
                                key: null,
                                range_min: 0,
                                range_max: null,
                            },
                        ],
                    };
                case "Attività":
                    return {
                        key: String(Date.now()),
                        title: this.title,
                        elements: [
                            {
                                key: String(Date.now()),
                                type: "",
                            },
                        ],
                        player: {
                            sette: this.sette,
                            undici: this.undici,
                            quindici: this.quindici,
                            single: this.singolo,
                            group: this.gruppo,
                            class: this.classe,
                        },
                        correct: {
                            key: null,
                            points: null,
                        },
                        wrong: {
                            key: null,
                            points: null,
                        },
                        time: null,
                    };
            }
        },
        onSave() {
            fetch("/api/" + this.collectionName() + "/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.newElement()),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/" + this.collectionName());
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    switch (this.category) {
                        case "Storie": {
                            this.$root.stories = data;
                            break;
                        }
                        case "Missioni": {
                            this.$root.missions = data;
                            break;
                        }
                        case "Attività": {
                            this.$root.activities = data;
                            break;
                        }
                    }
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation",
                        error
                    );
                    switch (this.category) {
                        case "Storie": {
                            this.$root.stories = null;
                            break;
                        }
                        case "Missioni": {
                            this.$root.missions = null;
                            break;
                        }
                        case "Attività": {
                            this.$root.activities = null;
                            break;
                        }
                    }
                });
            this.$bvModal.hide("modal-add-new-element");
            this.title = "";
            this.sette = false;
            this.undici = false;
            this.quindici = false;
            this.singolo = false;
            this.gruppo = false;
            this.classe = false;
        },
        onCancel() {
            this.$bvModal.hide("modal-add-new-element");
            this.title = "";
            this.sette = false;
            this.undici = false;
            this.quindici = false;
            this.singolo = false;
            this.gruppo = false;
            this.classe = false;
        },
    },
    template: "#add-new-element",
});

Vue.component("unvalid-alert", {
    props: {
        empty_title: {
            type: Boolean,
            default: false,
        },
        empty_time: {
            type: Boolean,
            default: false,
        },
        empty_element: {
            type: Boolean,
            default: false,
        },
        missing_special: {
            type: Boolean,
            default: false,
        },
        empty_start_activity: {
            type: Boolean,
            default: false,
        },
        empty_activity: {
            type: Boolean,
            default: false,
        },
        unvalid_component: {
            type: Boolean,
            default: false,
        },
        empty_paths: {
            type: Boolean,
            default: false,
        },
        empty_connection:{
            type: Boolean,
            default: false,
        },
        empty_path_name:{
            type: Boolean,
            defaul: false,
        },
        invalid_story_type:{
            type: Boolean,
            defaul: false,
        },
        empty_story_missions:{
            type: Boolean,
            defaul: false,
        },
        empty_first_mission:{
            type: Boolean,
            defaul: false,
        },
        empty_story_results:{
            type: Boolean,
            defaul: false,
        }
    },
    template: "#unvalid-alert",
});

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
                    name: "Impostazioni percorso",
                    isActive: false,
                },
                {
                    name: "Impostazioni storia",
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
            story: null,
            isSaved: false,
        };
    },
    props: {
        story_to_edit: null,
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
        resultsSelect: function () {
            let a = JSON.parse(JSON.stringify(this.selected_path.missions));
            a.push({
                key: "-1",
                title: "Fine missione",
            });
            return a;
        },
    },
    methods: {
        validateStory() {
            //console.log(this.validatePath())
            if ((this.story.title != "") && this.validatePath() && this.validatePathsNames() && this.validateStoryType()
            && this.validateStoryMissions() && this.validateStoryFirstMission() && this.validateStoryResults()) {
                return true;
            } else {
                return false;
            }
        },
        validatePath() {
            if (this.story.paths.length != 0) return true;
            else false;
        },
        validatePathsNames() {
            for (let i=0; i < this.story.paths.length; i++) {
                if (this.story.paths[i].name == "")
                return false;
            }
            return true;
        },
        validateStoryType() {
            if ((this.story.settings.player.sette || this.story.settings.player.undici || this.story.settings.player.quindici) &&
            (this.story.settings.player.single || this.story.settings.player.group || this.story.settings.player.class))
            return true;
            else false;
        },
        validateStoryMissions() {
            for (let i=0; i < this.story.paths.length; i++) {
                if (this.story.paths[i].missions.length == 0)
                return false;
            }
            return true;
        },
        validateStoryFirstMission() {  //Non crea comunque il modal anche se non è selezionata alcuna first mission
            for (let i=0; i < this.story.paths.length; i++) {
                if (this.story.paths[i].first_mission == null)
                return false;
            }
            return true;
        },
        validateStoryResults() {
            for (let i=0; i < this.story.paths.length; i++) {
                for (let j=0; j < this.story.paths[i].missions.length; j++) {
                    for (let k=0; k < this.story.paths[i].missions[j].results.length; k++) {
                        if (this.story.paths[i].missions[j].results[k].key == null)
                        return false;
                    }
                }
            }
            return true;
        },
        showAlertModal() {
            this.$bvModal.show("non-valid");
        },
        removePath(path) {
            for (let i = 0; i < this.story.paths.length; i++) {
                if (this.story.paths[i].key === path.key) {
                    this.story.paths.splice(i, 1);
                    this.selected_path = null;
                    i--;
                }
            }
        },
        selectMission(data) {
            let a = [];
            this.selected_path.missions.forEach((mission) => {
                if (data.item.key != mission.key)
                    a.push({
                        value: mission.key,
                        text: mission.title,
                    });
            });
            return a;
        },
        addPath() {
            this.story.paths.push({
                name: "Senza nome",
                missions: [],
                first_mission: null,
                key: String(Date.now()),
            });
        },
        maxResult() {
            let a = 0;
            this.selected_mission.activities.forEach((activity) => {
                a = a + parseInt(activity.correct.points);
            });
            return a;
        },
        addResult() {
            if (this.selected_mission.results.length < 5) {
                this.selected_mission.results.push({
                    id: String(Date.now()),
                    key: null,
                    range_min: null,
                    range_max: null,
                });
            }
        },
        removeResult(result) {
            for (let i = 0; i < this.selected_mission.results.length; i++) {
                if (this.selected_mission.results[i].id === result.id) {
                    this.selected_mission.results.splice(i, 1);
                    i--;
                }
            }
        },
        rangeMin(index) {
            let unit = this.maxResult() / this.selected_mission.results.length;
            return Math.round(unit * index + 1);
        },
        rangeMax(index) {
            let unit = this.maxResult() / this.selected_mission.results.length;
            return Math.round(unit * (index + 1));
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
        onAvailableMissionClick(mission) {
            let a = JSON.parse(JSON.stringify(mission));
            a.key = String(Date.now());
            this.selected_path.missions.push(a);
        },
        removeMission(mission) {
            for (let i = 0; i < this.selected_path.missions.length; i++) {
                if (this.selected_path.missions[i].key === mission.key) {
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
                (item.name == "Impostazioni percorso" && this.selected_path) ||
                (item.name != "Missioni" &&
                    item.name != "Esiti" &&
                    item.name != "Impostazioni percorso")
            ) {
                this.list_item_edit_story.forEach(
                    (element) => (element.isActive = false)
                );
                item.isActive = true;
            }
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
                    text:
                        "http://192.168.178.21:8000/play?key=" + this.story.key,
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
        onHide() {
            this.$bvModal.hide(this.story_to_edit.key);
            this.onEditStoryMenuClick(this.list_item_edit_story[0]);
            this.mission_filter = "";
            this.selected_path = null;
            this.selected_mission = null;
            if (!this.isSaved) {
                this.storiy = JSON.parse(JSON.stringify(this.story_to_edit));
            }
            this.isSaved = false;
        },
        onSave() {
            this.isSaved = true;
            fetch("/api/stories/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.story),
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
        },
    },
    mounted() {
        this.story = JSON.parse(JSON.stringify(this.story_to_edit));
    },
    template: "#modal-edit-story",
});

Vue.component("modal-edit-path-name", {
    data() {
        return {
            pathName: null,
        };
    },
    props: {
        path: null,
    },
    methods: {
        onHide() {
            this.pathName = JSON.parse(JSON.stringify(this.path.name));
        },
        onOk() {
            this.path.name = this.pathName;
        },
    },
    mounted() {
        if (this.path)
            this.pathName = JSON.parse(JSON.stringify(this.path.name));
    },
    template: "#modal-edit-path-name-template",
});

Vue.component("modal-edit-mission", {
    data() {
        return {
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
            selected_activity: null,
            mission: null,
            isSaved: false,
        };
    },
    props: {
        activities: {
            type: Array,
        },
        mission_to_edit: {
            type: Object,
        },
    },
    computed: {
        filteredActivities: function () {
            if (this.activity_filter) {
                let a = [];
                this.activities.forEach((element) => {
                    if (element.title.includes(this.activity_filter))
                        a.push(element);
                });
                return a;
            } else return this.activities;
        },
    },
    methods: {
        connectionActivities() {
            for (let i = 0; i < this.mission.activities.length; i++) {
                if (this.mission.activities[i].correct.key == null || this.mission.activities[i].wrong.key == null)
                    return false;
            }
            return true;
        },
        validatemission() {
            console.log(this.connectionActivities())
            if (
                this.mission.title != "" &&
                this.mission.first_activity != null &&
                this.connectionActivities() &&
                this.mission.activities.length > 0 
                
            ) {
                return true;
            } else {
                return false;
            }
        },
        showAlertModal() {
            this.$bvModal.show("non-valid");
        },
        showActivityInfos(activity) {
            console.log(activity);
            this.selected_activity = activity;
        },
        onEditMenuClick(item) {
            this.list_item_edit_mission.forEach(
                (element) => (element.isActive = false)
            );
            item.isActive = true;
        },
        onAvailableActivityClick(activity) {
            let a = JSON.parse(JSON.stringify(activity));
            a.key = String(Date.now());
            this.mission.activities.push(a);
        },
        removeActivity(activity) {
            for (let i = 0; i < this.mission.activities.length; i++) {
                if (this.mission.activities[i].key === activity.key) {
                    this.mission.activities.splice(i, 1);
                    i--;
                }
            }
            if (activity.key == this.mission.first_activity)
                this.mission.first_activity = null;
        },
        onHide() {
            this.$bvModal.hide(this.mission.key);
            this.onEditMenuClick(this.list_item_edit_mission[0]);
            this.activity_filter = "";
            this.selected_activity = null;
            if (!this.isSaved) {
                this.mission = JSON.parse(JSON.stringify(this.mission_to_edit));
            }
            this.isSaved = false;
        },
        onSave() {
            this.isSaved = true;
            fetch("/api/missions/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.mission),
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
        },
    },
    mounted() {
        this.mission = JSON.parse(JSON.stringify(this.mission_to_edit));
    },
    template: "#modal-edit-mission-template",
});

Vue.component("modal-edit-activity", {
    data() {
        return {
            list_item_edit_activity: [
                {
                    name: "Componenti",
                    isActive: true,
                },
                {
                    name: "Impostazioni",
                    isActive: false,
                },
            ],
            components_special: [
                {
                    type: "Domanda",
                    question: "",
                    answers: [],
                },
                {
                    type: "Scelta Multipla",
                    question: "",
                    answers: ["", "", "", ""],
                    correct_answer: null,
                },
                {
                    type: "Foto",
                    question: "",
                },
                {
                    type: "Testo",
                    text: "",
                },
                {
                    type: "Collega",
                    answers: [
                        {
                            first: "",
                            second: "",
                        },
                        {
                            first: "",
                            second: "",
                        },
                        {
                            first: "",
                            second: "",
                        },
                        {
                            first: "",
                            second: "",
                        },
                    ],
                },
                {
                    type: "Riempi",
                    text: "",
                },
            ],
            components: [
                {
                    type: "Descrizione",
                    text: "",
                },
                {
                    type: "Immagine",
                    text: "",
                },
                {
                    type: "Video",
                    text: "",
                },
                {
                    type: "Custom",
                },
            ],
            activity: null,
            isSaved: false,
            component_selected: null,
            element_selected: null,
        };
    },
    props: {
        activity_prop: {
            type: Object,
        },
    },
    computed: {
        disableSpecial: function () {
            // Serve per "forzare" l'update della computed
            if (this.element_selected);
            let a = false;
            this.activity.elements.forEach((element) => {
                this.components_special.forEach((component) => {
                    if (element.type == component.type) a = true;
                });
            });
            return a;
        },
    },
    methods: {
        validateStructure() {
            for (let i = 0; i < this.activity.elements.length; i++) {
                if (this.activity.elements[i].type == "") return false;
            }
            return true;
        },
        validate() {
            if (
                this.activity.title != "" &&
                this.activity.time != "" &&
                this.validateStructure() &&
                this.disableSpecial
            ) {
                return true;
            } else {
                return false;
            }
        },
        checkMultiple(){

        },
        validateComponent() {
            switch (this.component_selected.type) {
                case "Domanda": {
                    if (
                        this.component_selected.question != "" &&
                        this.component_selected.answers.length > 0
                    )
                        return true;
                    else return false;
                }
                case "Scelta multipla": {
                    console.log(function () {
                        for(let i = 0; i < this.component_selected.answers.length; i++){
                            if (this.component_selected.answers[i] == "") return false;
                        }
                        return true;
                    })
                    if (
                        this.component_selected.question != "" &&
                        this.component_selected.correct_answer != null &&
                        function () {
                            for(let i = 0; i < this.component_selected.answers.length; i++){
                                if (this.component_selected.answers[i] == "") return false;
                            }
                            return true;
                        }
                    ) {
                        return true;
                    } else return false;
                }
                case "Foto": {
                }
                case "Testo": {
                }
                case "Collega": {
                }
                case "Riempi": {
                }
                case "Descrizione": {
                }
                case "Immagine": {
                }
                case "Video": {
                }
                case "Custom": {
                }
            }
        },
        showAlertModal() {
            this.$bvModal.show("non-valid");
        },
        onEditMenuClick(item) {
            this.list_item_edit_activity.forEach(
                (element) => (element.isActive = false)
            );
            item.isActive = true;
        },
        onComponentClick(component) {
            if (this.component_selected) {
                if (this.component_selected.type == component.type) {
                    this.component_selected = null;
                } else {
                    this.component_selected = JSON.parse(
                        JSON.stringify(component)
                    );
                }
            } else {
                this.component_selected = JSON.parse(JSON.stringify(component));
            }
        },
        addElement() {
            this.activity.elements.push({
                key: String(Date.now()),
                type: "",
            });
        },
        removeElement(element) {
            for (let i = 0; i < this.activity.elements.length; i++) {
                if (this.activity.elements[i] === element) {
                    this.activity.elements.splice(i, 1);
                    i--;
                }
            }
        },
        openComponentModal(element) {
            if (this.component_selected) {
                this.element_selected = element;
                this.$bvModal.show("edit-component-modal");
            }
        },
        editComponent(element) {
            this.element_selected = element;
            this.component_selected = element;
            this.$bvModal.show("edit-component-modal");
        },
        onHideComponentModal(evt) {
            this.element_selected = null;
            this.$bvModal.hide("edit-component-modal");
        },
        onSaveComponentModal(evt) {
            for (let i = 0; i < this.activity.elements.length; i++) {
                if (
                    this.activity.elements[i].key === this.element_selected.key
                ) {
                    let key = this.element_selected.key;
                    this.activity.elements[i] = this.component_selected;
                    this.activity.elements[i].key = key;
                }
            }
        },
        onHide() {
            this.$bvModal.hide(this.modalId);
            this.component_selected = null;
            this.element_selected = null;
            if (!this.isSaved) {
                this.activity = JSON.parse(JSON.stringify(this.activity_prop));
            }
            this.isSaved = false;
        },
        onSave() {
            this.isSaved = true;
            fetch("/api/activities/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.activity),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/activities");
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
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
        },
    },
    mounted() {
        this.activity = JSON.parse(JSON.stringify(this.activity_prop));
    },
    template: "#modal-edit-activity",
});

var vm = new Vue({
    el: "#app",
    data: {
        // MAIN ARRAYS
        stories: null,
        missions: null,
        activities: null,

        // SECTIONS
        raw_sections: [
            {
                add_new_placeholder: "Crea Nuova Storia",
                navbar_name: "Storie",
                tab_active: "Storie",
                table_fields: [
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
                table_filter: null,
                table_items: null,
                tabs: ["Storie", "Archiviate"],
            },
            {
                add_new_placeholder: "Crea Nuova Missione",
                navbar_name: "Missioni",
                tab_active: "Missioni",
                table_fields: [
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
                table_filter: null,
                table_items: null,
                tabs: ["Missioni"],
            },
            {
                add_new_placeholder: "Crea Nuova Attività",
                navbar_name: "Attività",
                tab_active: "Attività",
                table_fields: [
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
                table_filter: null,
                table_items: null,
                tabs: ["Attività"],
            },
        ],
        active_section: null,

        //TABLES
        filter_field: ["title"],
        isBusy: false,
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
        sections() {
            this.raw_sections[0].table_items =
                this.raw_sections[0].tab_active == "Storie"
                    ? this.availableStories
                    : this.archivedStories;
            this.raw_sections[1].table_items = this.missions;
            this.raw_sections[2].table_items = this.activities;
            return this.raw_sections;
        },
    },
    methods: {
        tableFormatter(value) {
            return value ? "✓" : "✗";
        },
        titleFormatter() {
            return "cell-default";
        },
        cellFormatter(value) {
            return value ? "cell-true" : "cell-false";
        },
        collectionName(name) {
            return name == "Storie"
                ? "stories"
                : name == "Missioni"
                ? "missions"
                : "activities";
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
        onDelete(data, name) {
            this.isBusy = true;
            fetch("/api/" + this.collectionName(name) + "/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key: data.item.key }),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/" + this.collectionName(name));
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    switch (name) {
                        case "Storie": {
                            this.stories = data;
                            break;
                        }
                        case "Missioni": {
                            this.missions = data;
                            break;
                        }
                        case "Attività": {
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
                    switch (name) {
                        case "Storie": {
                            this.stories = null;
                            break;
                        }
                        case "Missioni": {
                            this.missions = null;
                            break;
                        }
                        case "Attività": {
                            this.activities = null;
                            break;
                        }
                    }
                });
        },
        onEdit(data) {
            this.$bvModal.show(data.item.key);
        },
        onClone(data, name) {
            this.isBusy = true;
            let cloned = {};
            switch (name) {
                case "Storie": {
                    cloned = {
                        key: String(Date.now()),
                        title: data.item.title,
                        paths: data.item.paths,
                        settings: data.item.settings,
                    };
                    break;
                }
                case "Missioni": {
                    cloned = {
                        key: String(Date.now()),
                        title: data.item.title,
                        activities: data.item.activities,
                        player: data.item.player,
                        first_activity: data.item.first_activity,
                        results: [
                            {
                                key: null,
                                range_min: 0,
                                range_max: null,
                            },
                        ],
                    };
                    break;
                }
                case "Attività": {
                    cloned = {
                        key: String(Date.now()),
                        title: data.item.title,
                        player: data.item.player,
                        elements: data.item.elements,
                    };
                    break;
                }
            }
            fetch("/api/" + this.collectionName(name) + "/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cloned),
            })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return fetch("/api/" + this.collectionName(name));
                })
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Network response was not ok");
                    else return response.json();
                })
                .then((data) => {
                    switch (name) {
                        case "Storie": {
                            this.stories = data;
                            break;
                        }
                        case "Missioni": {
                            this.missions = data;
                            break;
                        }
                        case "Attività": {
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
                    switch (name) {
                        case "Storie": {
                            this.stories = null;
                            break;
                        }
                        case "Missioni": {
                            this.missions = null;
                            break;
                        }
                        case "Attività": {
                            this.activities = null;
                            break;
                        }
                    }
                });
        },
    },
    mounted() {
        this.active_section = this.sections[0];
    },
});

function fetchData() {
    fetchStories();
    fetchMissions();
    fetchActivities();
}

function fetchStories() {
    fetch("/api/stories")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.stories = data;
        });
}

function fetchMissions() {
    fetch("/api/missions")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.missions = data;
        });
}

function fetchActivities() {
    fetch("/api/activities")
        .then((response) => response.json())
        .then((data) => {
            vm.$data.activities = data;
        });
}

$(document).ready(fetchData);
