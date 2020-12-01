<template>
  <b-modal @hide="onHide" @ok="onSave" size="xl" :id="mission_to_edit.key">
    <template #modal-header>
      <b-container fluid>
        <h4 class="py-3">{{ mission_to_edit.title }}</h4>
      </b-container>
    </template>
    <template #default>
      <b-container fluid class="p-0">
        <b-row class="m-0">
          <b-col class="p-0 menu-column" cols="2">
            <b-list-group>
              <b-list-group-item
                button
                v-for="(item, index) in list_item_edit_mission"
                :key="index"
                :class="{ active: item.isActive }"
                @click="onEditMenuClick(item)"
              >
                <h6 class="my-0">{{ item.name }}</h6>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col cols="6" v-if="list_item_edit_mission[0].isActive">
            <b-row class="m-0">
              <b-col cols="auto" class="mr-auto p-0 mt-2">
                <h3>Disponibili</h3>
              </b-col>
              <b-col cols="6" class="my-2 p-0">
                <b-input-group class="px-0">
                  <b-form-input
                    spellcheck="false"
                    type="search"
                    placeholder="Cerca"
                    v-model="activity_filter"
                  ></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mission-group-item scrollable py-3">
                <h6 v-if="availableFilteredActivities.length == 0">
                  Nessuna attività disponibile...
                </h6>
                <b-list-group>
                  <b-list-group-item
                    v-for="(activity, index) in availableFilteredActivities"
                    :key="index"
                    class="py-2 my-1"
                    button
                    @click="onAvailableActivityClick(activity)"
                    style="height: 53px"
                  >
                    {{ activity.title }}
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="4" v-if="list_item_edit_mission[0].isActive">
            <b-row class="m-0">
              <b-col class="p-0 mt-2 mb-1">
                <h3 style="height: 34px">Aggiunte</h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mission-group-item scrollable py-3">
                <h6 v-if="mission.activities.length == 0">
                  Aggiungi qualche attività...
                </h6>
                <b-list-group v-else>
                  <b-list-group-item
                    v-for="(activity, index) in mission.activities"
                    :key="index"
                    class="py-2 px-3 my-1 d-flex justify-content-between align-items-center"
                  >
                    <div>{{ activity.title }}</div>
                    <b-button @click="removeActivity(activity)">
                      <b-icon icon="x"></b-icon>
                    </b-button>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-if="list_item_edit_mission[1].isActive" cols="3">
            <b-row class="m-0">
              <b-col class="p-0 mt-2 mb-1">
                <h3 style="height: 34px">Attività</h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mission-group-item scrollable py-3">
                <h6 v-if="mission.activities.length == 0">
                  Aggiungi qualche attività...
                </h6>
                <b-list-group v-else>
                  <b-list-group-item
                    v-for="(activity, index) in mission.activities"
                    :key="index"
                    class="px-0 py-2 my-1"
                    button
                    @click="showActivityInfos(activity)"
                  >
                    {{ activity.title }}
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-if="list_item_edit_mission[1].isActive" cols="7">
            <b-row v-if="!selected_activity" class="m-0">
              <b-col class="p-0 mt-2 mb-1">
                <h3 style="height: 34px">Nessuna attività selezionata</h3>
              </b-col>
            </b-row>
            <b-row v-else class="p-0 scrollable-full-body-height">
              <b-col
                class="p-0 m-0 d-flex flex-column align-items-center mission-group-item"
              >
                <h3 class="p-0 mt-2 mb-1">
                  {{ selected_activity.title }}
                </h3>
                <h5 class="pt-3">Collegamenti con le altre attività</h5>
                <b-row class="m-0" style="width: 100%">
                  <b-col
                    cols="4"
                    offset="1"
                    style="
                      background-color: #171926;
                      text-align: center;
                      border-radius: 10px;
                      box-shadow: 0 2px 0#00bd58;
                      outline: 0;
                    "
                  >
                    <b-icon
                      icon="check"
                      class="h1 mt-2"
                      style="color: #00bd58"
                    ></b-icon>
                    <h3>Vai a</h3>
                    <b-form-select
                      text-field="title"
                      value-field="key"
                      :options="mission.activities"
                      v-model="selected_activity.correct.key"
                    ></b-form-select>
                    <h3 class="mt-3">Ottieni</h3>
                    <b-form-input
                      style="text-align: center"
                      class="my-3"
                      type="text"
                      placeholder="Punti..."
                      v-model="selected_activity.correct.points"
                    ></b-form-input>
                    <h3 class="mb-3">punti</h3>
                  </b-col>
                  <b-col
                    cols="4"
                    offset="2"
                    style="
                      background-color: #171926;
                      text-align: center;
                      border-radius: 10px;
                      box-shadow: 0 2px 0#FF3D4A;
                      outline: 0;
                    "
                  >
                    <b-icon
                      icon="x"
                      class="h1 mt-2"
                      style="color: #ff3d4a"
                    ></b-icon>
                    <h3>Vai a</h3>
                    <b-form-select
                      text-field="title"
                      value-field="key"
                      :options="mission.activities"
                      v-model="selected_activity.wrong.key"
                    ></b-form-select>
                    <h3 class="mt-3">Ottieni</h3>
                    <b-form-input
                      style="text-align: center"
                      class="my-3"
                      type="text"
                      placeholder="Punti..."
                      v-model="selected_activity.wrong.points"
                    ></b-form-input>
                    <h3 class="mb-3">punti</h3>
                  </b-col>
                </b-row>
                <h5 class="pt-3">Elementi dell'attività</h5>
                <b-list-group-item
                  v-for="(element, index) in selected_activity.elements"
                  :key="index"
                  class="px-0 py-2 my-1"
                  style="width: 70%"
                >
                  {{ element.type }}
                </b-list-group-item>
              </b-col>
            </b-row>
          </b-col>
          <b-col
            class="m-0 p-0 scrollable-full-body-height"
            v-if="list_item_edit_mission[2].isActive"
            cols="10"
          >
            <b-container class="d-flex flex-column" fluid>
              <div class="m-3 d-flex flex-column align-items-center">
                <h5>Titolo</h5>
                <b-form-input
                  style="width: 50%"
                  class="m-2"
                  type="text"
                  v-model="mission.title"
                  required
                  maxlength="25"
                  placeholder="Inserisci il titolo..."
                ></b-form-input>
              </div>
              <div class="m-3 d-flex flex-column align-items-center">
                <h5>Attività d'inizio</h5>
                <b-form-select
                  style="width: 50%"
                  text-field="title"
                  value-field="key"
                  :options="mission.activities"
                  v-model="mission.first_activity"
                ></b-form-select>
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
            validatemission()
              ? { click: () => ok() }
              : { click: () => showAlertModal() }
          "
        >
          Salva
        </b-button>
        <unvalid-alert
          :empty_title="mission.title == ''"
          :empty_start_activity="mission.first_activity == null"
          :empty_activity="mission.activities.length == 0"
          :empty_connection="!connectionActivities()"
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
    availableFilteredActivities: function () {
      let a = [];
      this.activities.forEach((activity) => {
        if (activity.elements.length > 0) {
          if (this.activity_filter) {
            if (activity.title.includes(this.activity_filter)) a.push(activity);
          } else {
            a.push(activity);
          }
        }
      });
      return a;
    },
  },
  methods: {
    connectionActivities() {
      for (let i = 0; i < this.mission.activities.length; i++) {
        if (
          this.mission.activities[i].correct.key == null ||
          this.mission.activities[i].wrong.key == null
        )
          return false;
      }
      return true;
    },
    validatemission() {
      console.log(this.connectionActivities());
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/missions");
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
  components: {
    unvalidAlert: httpVueLoader("comp/editor/unvalid_alert.vue"),
  },
  mounted() {
    this.mission = JSON.parse(JSON.stringify(this.mission_to_edit));
  },
};
</script>

<style>
</style>