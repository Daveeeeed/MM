<template>
  <div>
    <!-- Modal edit mission -->
    <b-modal @show="init()" @hide="reset()" size="xl" id="modal-edit-story">
      <template #modal-header>
        <b-container
          fluid
          class="d-flex justify-content-between"
          style="height: 100%"
        >
          <h4 class="py-3">{{ story_prop.title }}</h4>
          <b-button class="px-4 my-auto" @click="showQrCode">QR CODE</b-button>
          <b-modal id="modal-qr-code" centered ok-only>
            <template #modal-header>
              <h4 class="mx-auto my-0">QR CODE</h4>
            </template>
            <template #default>
              <b-container fluid class="d-flex justify-content-center">
                <span
                  v-if="story_prop.settings.published"
                  class="py-3"
                  id="qrcode"
                ></span>
                <p class="my-3" v-else>
                  Pubblica la storia per visualizzare il QR code
                </p>
              </b-container>
            </template>
            <template #modal-footer="{ close }">
              <b-container fluid class="d-flex justify-content-end">
                <b-button @click="close()"> OK </b-button>
              </b-container>
            </template>
          </b-modal>
        </b-container>
      </template>

      <template #default>
        <b-container fluid class="p-0 m-0" style="height: 100%">
          <b-row class="p-0 m-0" style="height: 100%">
            <!-- Menu sections -->
            <b-col class="p-0 m-0 menu-column" cols="2">
              <b-list-group>
                <b-list-group-item
                  button
                  v-for="(item, index) in sections"
                  :key="index"
                  @click="onEditStoryMenuClick(item)"
                  :class="{ active: item == active_section }"
                >
                  <h6 class="my-0">{{ item }}</h6>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col cols="10" v-if="active_section == sections[0]">
              <b-row style="height: 54px">
                <b-col cols="auto" class="mr-auto ml-3 my-2 p-0">
                  <h3 class="m-0">Percorsi</h3>
                </b-col>
                <b-col cols="auto" class="my-2 mr-3 px-0">
                  <b-button class="px-4" @click="addPath"
                    >Nuovo Percorso</b-button
                  >
                </b-col>
              </b-row>
              <b-row>
                <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                  <div
                    v-if="!story.paths.length"
                    class="d-flex align-items-center justify-content-center"
                    style="height: 100%"
                  >
                    <h6>Aggiungi almeno un percorso.</h6>
                  </div>
                  <b-list-group>
                    <b-list-group-item
                      v-for="(path, index) in story.paths"
                      :key="index"
                      class="my-2 d-flex align-items-center justify-content-between"
                      :class="pathClass(path)"
                      button
                      @click="selected_path = path"
                    >
                      <div class="ml-2">
                        {{ path.name }}
                      </div>
                      <div class="mr-2">
                        <b-button @click.stop="removePath(path)">
                          <b-icon icon="x"></b-icon>
                        </b-button>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="6" v-if="active_section == sections[1]">
              <b-row class="m-0 p-0">
                <b-col cols="auto" class="mr-auto p-0 mt-2">
                  <h3>Disponibili</h3>
                </b-col>
                <b-col cols="6" class="my-2 px-0">
                  <b-input-group class="px-0">
                    <b-form-input
                      spellcheck="false"
                      type="search"
                      placeholder="Cerca"
                      v-model="mission_filter"
                    ></b-form-input>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                  <b-list-group>
                    <b-list-group-item
                      v-for="(mission, index) in available_filtered_missions"
                      :key="index"
                      class="px-0 py-2 my-1"
                      button
                      @click="onAvailableMissionClick(mission)"
                    >
                      {{ mission.title }}
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4" v-if="active_section == sections[1]">
              <b-row class="m-0 p-0">
                <b-col class="p-0 mt-2 mb-1">
                  <h3 style="height: 34px">Aggiunte</h3>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                  <h6 v-if="selected_path.missions.length == 0">
                    Aggiungi almeno una missione.
                  </h6>
                  <b-list-group v-else>
                    <b-list-group-item
                      v-for="(mission, index) in selected_path.missions"
                      :key="index"
                      class="py-2 px-3 my-1 d-flex justify-content-between align-items-center"
                    >
                      <div>{{ mission.title }}</div>
                      <b-button @click="removeMission(mission)">
                        <b-icon icon="x"></b-icon>
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col v-if="active_section == sections[2]" cols="3">
              <b-row class="m-0 p-0">
                <b-col class="p-0 mt-2 mb-1">
                  <h3 style="height: 34px">Missioni</h3>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                  <h6 v-if="selected_path.missions.length == 0">
                    Aggiungi almeno una missione.
                  </h6>
                  <b-list-group v-else>
                    <b-list-group-item
                      v-for="(mission, index) in selected_path.missions"
                      :key="index"
                      class="px-0 py-2 my-1"
                      button
                      :class="missionClass(mission)"
                      @click="
                        showMissionInfos(
                          selected_mission == mission ? null : mission
                        )
                      "
                    >
                      {{ mission.title }}
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              v-if="active_section == sections[2]"
              cols="7"
              style="overflow-y: auto; height: 100%"
            >
              <div
                v-if="!selected_mission"
                class="d-flex align-items-center justify-content-center"
                style="height: 100%"
              >
                <h6>Nessuna missione selezionata.</h6>
              </div>
              <div
                v-else
                class="d-flex flex-column"
                style="width: 100%; height: 100%"
              >
                <h3 class="my-3">
                  {{ selected_mission.title }}
                </h3>
                <h5 class="my-3">
                  Numero di attività: {{ selected_mission.activities.length }}
                </h5>
                <div
                  class="d-flex justify-content-between align-items-center my-3"
                >
                  <h5>Percentuale risposte corrette</h5>
                  <b-button @click="addResult()">+ Aggiungi esito</b-button>
                </div>
                <b-list-group class="mission-group-item">
                  <b-list-group-item
                    class="my-2 py-2"
                    v-for="(result, index) in selected_mission.results"
                    :key="index"
                  >
                    <b-row style="width: 100%" class="m-0">
                      <b-col
                        cols="6"
                        class="p-0 d-flex align-items-center mr-auto"
                      >
                        da {{ result.range_min }} punti a
                        {{ result.range_max }} punti
                      </b-col>
                      <b-col cols="6" class="p-0 d-flex">
                        <b-form-select
                          text-field="title"
                          value-field="key"
                          v-model="selected_mission.results[index].key"
                          :options="resultsSelect"
                        >
                        </b-form-select>
                        <b-button @click="removeResult(result)" class="ml-2"
                          ><b-icon icon="x"></b-icon
                        ></b-button>
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-col>
            <b-col
              class="m-0 p-0 scrollable-full-body-height"
              v-if="active_section == sections[3]"
              cols="10"
            >
              <b-container class="d-flex flex-column" fluid>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Titolo</h5>
                  <b-form-input
                    style="width: 50%"
                    class="m-2"
                    type="text"
                    maxlength="25"
                    v-model="selected_path.name"
                    placeholder="Inserisci il titolo..."
                  ></b-form-input>
                </div>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Missione d'inizio</h5>
                  <b-form-select
                    style="width: 50%"
                    text-field="title"
                    value-field="key"
                    v-model="selected_path.first_mission"
                    :options="selected_path.missions"
                  >
                  </b-form-select>
                </div>
              </b-container>
            </b-col>
            <b-col
              class="m-0 p-0 scrollable-full-body-height"
              v-if="active_section == sections[4]"
              cols="10"
            >
              <b-container class="d-flex flex-column" fluid id="stocazzo">
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Titolo</h5>
                  <b-form-input
                    style="width: 50%"
                    class="m-2"
                    type="text"
                    v-model="story.title"
                    maxlength="25"
                    required
                    placeholder="Inserisci il titolo..."
                  ></b-form-input>
                </div>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Giocatore</h5>
                  <div class="d-flex justify-content-center">
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.single"
                      >Singolo</b-form-checkbox
                    >
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.group"
                      >Gruppo</b-form-checkbox
                    >
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.class"
                      >Classe</b-form-checkbox
                    >
                  </div>
                </div>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Età</h5>
                  <div class="d-flex justify-content-center">
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.sette"
                      >7-10</b-form-checkbox
                    >
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.undici"
                      >11-14</b-form-checkbox
                    >
                    <b-form-checkbox
                      class="m-2"
                      v-model="story.settings.player.quindici"
                      >15-18</b-form-checkbox
                    >
                  </div>
                </div>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5 class="mb-2">Background</h5>
                  <div class="d-flex justify-content-center">
                    <b-form-file
                      v-model="background_selector"
                      accept="image/*"
                      id="background-selector"
                      style="display: none"
                      ref="backgroundFileInput"
                    ></b-form-file>
                    <b-button class="mt-2" @click="openSelector"
                      >Cambia background</b-button
                    >
                  </div>
                  <img
                    class="mt-2 background-preview"
                    v-if="story.settings.background"
                    :src="story.settings.background"
                    alt="background story image"
                  />
                  <h6 class="mt-2" v-else>Nessun background selezionato</h6>
                </div>
              </b-container>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <template #modal-footer>
        <b-row d-flex justify-content-end>
          <b-button class="mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="mx-1"
            v-on="
              valid_story
                ? { click: () => save() }
                : { click: () => notifyErrors() }
            "
          >
            Salva
          </b-button>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      sections: [
        "Percorsi",
        "Missioni",
        "Esiti",
        "Impostazioni percorso",
        "Impostazioni storia",
      ],
      active_section: null,
      mission_filter: "",
      selected_mission: null,
      story: null,
      selected_path: null,
      background_selector: null,
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
    };
  },
  props: {
    story_prop: null,
    missions: null,
    activities: null,
  },
  computed: {
    available_filtered_missions: function () {
      let a = [];
      this.missions.forEach((mission) => {
        if (mission.activities.length > 0) {
          if (this.mission_filter) {
            if (mission.title.includes(this.mission_filter)) a.push(mission);
          } else {
            a.push(mission);
          }
        }
      });
      return a;
    },
    resultsSelect: function () {
      let a = JSON.parse(JSON.stringify(this.selected_path.missions));
      a.push({
        key: "-1",
        title: "Fine storia",
      });
      return a;
    },
    valid_title: function () {
      return this.story.title;
    },
    valid_paths: function () {
      return this.story.paths.length;
    },
    valid_paths_names: function () {
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].name == "") return false;
      }
      return true;
    },
    valid_story_type: function () {
      return (
        (this.story.settings.player.sette ||
          this.story.settings.player.undici ||
          this.story.settings.player.quindici) &&
        (this.story.settings.player.single ||
          this.story.settings.player.group ||
          this.story.settings.player.class)
      );
    },
    valid_story_missions: function () {
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].missions.length == 0) return false;
      }
      return true;
    },
    valid_story_first_mission: function () {
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].first_mission == null) return false;
      }
      return true;
    },
    valid_story_results: function () {
      for (let i = 0; i < this.story.paths.length; i++) {
        for (let j = 0; j < this.story.paths[i].missions.length; j++) {
          for (
            let k = 0;
            k < this.story.paths[i].missions[j].results.length;
            k++
          ) {
            if (this.story.paths[i].missions[j].results[k].key == null)
              return false;
          }
        }
      }
      return true;
    },
    valid_story: function () {
      return (
        this.valid_title &&
        this.valid_paths &&
        this.valid_paths_names &&
        this.valid_story_type &&
        this.valid_story_missions &&
        this.valid_story_first_mission &&
        this.valid_story_results
      );
    },
  },
  methods: {
    openSelector() {
      let el = $("#background-selector");
      if (el) el.click();
    },
    addPath() {
      this.story.paths.push({
        name: "Senza nome",
        missions: [],
        first_mission: null,
        key: String(Date.now()),
      });
    },
    removePath(path) {
      let index = this.story.paths.indexOf(path);
      this.story.paths.splice(index, 1);
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
    maxResult(mission) {
      let a = 0;
      mission.activities.forEach((activity) => {
        a = a + parseInt(activity.correct.points);
      });
      return a;
    },
    addResult() {
      if (this.selected_mission.results.length < 4) {
        this.selected_mission.results.push({
          id: String(Date.now()),
          key: null,
          range_min: null,
          range_max: null,
        });
        this.calculateResultRange(this.selected_mission);
      }
    },
    removeResult(result) {
      if (this.selected_mission.results.length > 1) {
        for (let i = 0; i < this.selected_mission.results.length; i++) {
          if (this.selected_mission.results[i].id === result.id) {
            this.selected_mission.results.splice(i, 1);
            i--;
          }
        }
        this.calculateResultRange(this.selected_mission);
      }
    },
    calculateResultRange(mission) {
      for (let i = 0; i < mission.results.length; i++) {
        mission.results[i].range_min = this.rangeMin(i);
        mission.results[i].range_max = this.rangeMax(i);
      }
    },
    rangeMin(index, mission = this.selected_mission) {
      let unit =
        100 /
        (mission.results ? mission.results.length : 1);
      return Math.round(unit * index + 1);
    },
    rangeMax(index, mission = this.selected_mission) {
      let unit =
        100 /
        (mission.results ? mission.results.length : 1);
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
    missionClass(mission) {
      return {
        unavailable: mission != this.selected_mission,
      };
    },
    showMissionInfos(mission) {
      this.selected_mission = mission;
    },
    onAvailableMissionClick(mission) {
      let a = JSON.parse(JSON.stringify(mission));
      a.key = String(Date.now());
      a.results = [
        {
          id: String(Date.now()),
          key: null,
          range_min: 0,
          range_max: this.rangeMax(0, a),
        },
      ];
      this.selected_path.missions.push(a);
    },
    removeMission(mission) {
      for (let i = 0; i < this.selected_path.missions.length; i++) {
        if (this.selected_path.missions[i].key === mission.key) {
          this.selected_path.missions.splice(i, 1);
          if (this.selected_mission.key == mission.key)
            this.selected_mission = null;
          i--;
        }
      }
    },
    addSuccessiveMission() {
      this.selected_mission.successive.push({
        min: 0,
        max: 0,
        key: String(Date.now()),
      });
    },
    onEditStoryMenuClick(item) {
      if (
        this.selected_path ||
        item == "Percorsi" ||
        item == "Impostazioni storia"
      ) {
        this.active_section = item;
      }
    },
    showQrCode() {
      new Promise((resolve, reject) => {
        this.$bvModal.show("modal-qr-code");
        resolve();
      }).then(() => {
        var qr_code = kjua({
          render: "image",
          crisp: true,
          size: 200,
          ratio: null,
          fill: "#000",
          back: "#fff",
          text: "http://localhost:8000/play?key=" + this.story.key,
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
        document.querySelector("#qrcode").appendChild(qr_code);
      });
    },

    init() {
      this.active_section = this.sections[0];
      this.story = JSON.parse(JSON.stringify(this.story_prop));
    },
    reset() {
      this.$bvModal.hide("modal-edit-story");
      this.onEditStoryMenuClick(this.sections[0]);
      this.mission_filter = "";
      this.selected_path = null;
      this.selected_mission = null;
    },
    save() {
      this.$emit("story-updated", this.story);
      this.reset();
    },

    // Validation and errors
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (!this.valid_title) a.push("Il titolo non può essere vuoto");
      if (!this.valid_paths) a.push("Inserisci almeno un percorso");
      if (!this.valid_paths_names)
        a.push("Inserisci un titolo ad ogni percorso");
      if (!this.valid_story_type)
        a.push("Specifica il tipo di storia in Impostazioni Storia");
      if (!this.valid_story_missions)
        a.push("Inserisci almeno una missione in tutti i percorsi");
      if (!this.valid_story_first_mission)
        a.push("Specifica la missione iniziale in ogni percorso");
      if (!this.valid_story_results)
        a.push("Specifica un esito per ogni missione di ogni percorso");
      return a;
    },
  },
  watch: {
    story_prop(new_value) {
      this.story = new_value;
    },
    background_selector(file) {
      if (file) {
        let formData = new FormData();
        formData.append("photo", file);

        fetch("/api/uploadPhoto", {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              this.story.settings.background = data.path;
            });
          }
        });

        this.$refs.backgroundFileInput.reset();
      }
    },
  },
};
</script>

<style></style>
