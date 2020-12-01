<template>
  <b-modal
    @ok="onSave()"
    @hide="onHide()"
    :id="story_to_edit.key"
    size="xl"
    :title="story_to_edit.title"
  >
    <template #modal-header>
      <b-container
        fluid
        class="d-flex justify-content-between"
        style="height: 100%"
      >
        <h4 class="py-3">{{ story_to_edit.title }}</h4>
        <b-button class="px-4 my-auto darker" @click="showQrCode"
          >QR CODE</b-button
        >
        <b-modal id="modal-qr-code" centered ok-only>
          <template #modal-header>
            <h4 class="mx-auto my-0">QR CODE</h4>
          </template>
          <template #default>
            <b-container fluid class="d-flex justify-content-center">
              <span
                v-if="story_to_edit.settings.published"
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
              <b-button class="darker" @click="close()"> OK </b-button>
            </b-container>
          </template>
        </b-modal>
      </b-container>
    </template>
    <template #default>
      <b-container fluid class="p-0 m-0" style="height: 100%">
        <b-row class="p-0 m-0" style="height: 100%">
          <b-col class="p-0 m-0 menu-column" cols="2">
            <b-list-group>
              <b-list-group-item
                button
                v-for="(item, index) in list_item_edit_story"
                :key="index"
                @click="onEditStoryMenuClick(item)"
                :class="{ active: item.isActive }"
              >
                <h6 class="my-0">{{ item.name }}</h6>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col cols="10" v-if="list_item_edit_story[0].isActive">
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
                <b-list-group>
                  <b-list-group-item
                    v-for="(path, index) in story.paths"
                    :key="index"
                    class="my-2 d-flex align-items-center justify-content-between"
                    :class="pathClass(path)"
                    button
                    @click="onPathClick(path)"
                  >
                    <div class="ml-2">
                      {{ path.name }}
                    </div>
                    <div class="mr-2">
                      <b-button @click="$bvModal.show(path.key)">
                        <b-icon icon="pencil"></b-icon>
                      </b-button>
                      <b-button @click="removePath(path)">
                        <b-icon icon="x"></b-icon>
                      </b-button>
                      <edit-path-name :path="path"></edit-path-name>
                    </div>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="6" v-if="list_item_edit_story[1].isActive">
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
                    v-for="(mission, index) in availableFilteredMissions"
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
          <b-col cols="4" v-if="list_item_edit_story[1].isActive">
            <b-row class="m-0 p-0">
              <b-col class="p-0 mt-2 mb-1">
                <h3 style="height: 34px">Aggiunte</h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                <h6 v-if="selected_path.missions.length == 0">
                  Aggiungi qualche missione...
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
          <b-col v-if="list_item_edit_story[2].isActive" cols="3">
            <b-row class="m-0 p-0">
              <b-col class="p-0 mt-2 mb-1">
                <h3 style="height: 34px">Missioni</h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mission-group-item scrollable px-3 py-3 m-0">
                <h6 v-if="selected_path.missions.length == 0">
                  Aggiungi qualche missione...
                </h6>
                <b-list-group v-else>
                  <b-list-group-item
                    v-for="(mission, index) in selected_path.missions"
                    :key="index"
                    class="px-0 py-2 my-1"
                    button
                    @click="showMissionInfos(mission)"
                  >
                    {{ mission.title }}
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col
            v-if="list_item_edit_story[2].isActive"
            cols="7"
            style="overflow-y: auto; height: 100%"
          >
            <h6 v-if="!selected_mission">Nessuna missione selezionata</h6>
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
                <h5>Esiti</h5>
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
                      da {{ rangeMin(index) }} punti a
                      {{ rangeMax(index) }} punti
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
            v-if="list_item_edit_story[3].isActive"
            cols="10"
          >
            <b-container class="d-flex flex-column" fluid>
              <div class="m-4 d-flex flex-column align-items-center">
                <h5>Titolo</h5>
                <b-form-input
                  style="width: 50%"
                  class="m-2"
                  type="text"
                  maxlength="25"
                  v-model="selected_path.name"
                  placeholder="Inserisci il titolo..."
                ></b-form-input>
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
            v-if="list_item_edit_story[4].isActive"
            cols="10"
          >
            <b-container class="d-flex flex-column" fluid>
              <div class="m-4 d-flex flex-column align-items-center">
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
              <div class="m-4 d-flex flex-column align-items-center">
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
              <div class="m-4 d-flex flex-column align-items-center">
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
            </b-container>
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template #modal-footer="{ hide, ok }">
      <b-row d-flex justify-content-end>
        <b-button class="darker mx-1" @click="hide()"> Indietro </b-button>
        <b-button
          class="darker mx-1"
          v-on="
            validateStory()
              ? { click: () => ok() }
              : { click: () => showAlertModal() }
          "
        >
          Salva
        </b-button>
        <unvalid-alert
          :empty_title="story.title == ''"
          :empty_paths="!validatePath()"
          :empty_path_name="!validatePathsNames()"
          :invalid_story_type="!validateStoryType()"
          :empty_story_missions="!validateStoryMissions()"
          :empty_first_mission="!validateStoryFirstMission()"
          :empty_story_results="!validateStoryResults()"
        >
        </unvalid-alert>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
module.exports = {
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
      removePathActive: false,
    };
  },
  props: {
    story_to_edit: null,
    missions: null,
    activities: null,
  },
  computed: {
    availableFilteredMissions() {
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
        title: "Fine missione",
      });
      return a;
    },
  },
  methods: {
    validateStory() {
      if (
        this.story.title != "" &&
        this.validatePath() &&
        this.validatePathsNames() &&
        this.validateStoryType() &&
        this.validateStoryMissions() &&
        this.validateStoryFirstMission() &&
        this.validateStoryResults()
      ) {
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
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].name == "") return false;
      }
      return true;
    },
    validateStoryType() {
      if (
        (this.story.settings.player.sette ||
          this.story.settings.player.undici ||
          this.story.settings.player.quindici) &&
        (this.story.settings.player.single ||
          this.story.settings.player.group ||
          this.story.settings.player.class)
      )
        return true;
      else false;
    },
    validateStoryMissions() {
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].missions.length == 0) return false;
      }
      return true;
    },
    validateStoryFirstMission() {
      for (let i = 0; i < this.story.paths.length; i++) {
        if (this.story.paths[i].first_mission == null) return false;
      }
      return true;
    },
    validateStoryResults() {
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
    showAlertModal() {
      this.$bvModal.show("non-valid");
    },
    removePath(path) {
      this.removePathActive = true;
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
      if (!this.removePathActive) this.selected_path = path;
      this.removePathActive = false;
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
        (item.name == "Missioni" && this.selected_path != null) || //item.name è quello che clicchi -- quando elimino il percorso selected_path rimane non null
        (item.name == "Esiti" && this.selected_path != null) ||
        (item.name == "Impostazioni percorso" && this.selected_path != null) ||
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
          text: "http://frank.cs.unibo.it:8000/play?key=" + this.story.key,
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/stories");
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
  components: {
    unvalidAlert: httpVueLoader("comp/editor/unvalid_alert.vue"),
    editPathName: httpVueLoader("comp/editor/edit_path_name.vue"),
  },
  mounted() {
    this.story = JSON.parse(JSON.stringify(this.story_to_edit));
  },
};
</script>

<style>
</style>