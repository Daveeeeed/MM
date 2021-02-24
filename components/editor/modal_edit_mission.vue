<template>
  <div>
    <!-- Modal edit mission -->
    <b-modal @show="init()" @hide="reset()" size="xl" id="modal-edit-mission">
      <template #modal-header>
        <b-container fluid class="d-flex align-items-center">
          <h4 class="py-3">{{ mission_prop.title }}</h4>
        </b-container>
      </template>

      <template #default>
        <b-container fluid class="p-0 m-0">
          <b-row class="p-0 m-0">
            <!-- Menu sections -->
            <b-col class="p-0 m-0 menu-column" cols="2">
              <b-list-group>
                <b-list-group-item
                  button
                  v-for="(item, index) in sections"
                  :key="index"
                  @click="active_section = item"
                  :class="{ active: item == active_section }"
                >
                  <h6 class="my-0">{{ item }}</h6>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <!-- Available activities -->
            <b-col cols="6" v-if="active_section == sections[0]">
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
                  <h6 v-if="!available_filtered_activities.length">
                    Nessuna attività disponibile...
                  </h6>
                  <b-list-group>
                    <b-list-group-item
                      v-for="(activity, index) in available_filtered_activities"
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
            <!-- Selected activities -->
            <b-col cols="4" v-if="active_section == sections[0]">
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
            <!-- Selected activities -->
            <b-col cols="3" v-if="active_section == sections[1]">
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
                      :class="activityClass(activity)"
                      button
                      @click="
                        showActivityInfos(
                          selected_activity == activity ? null : activity
                        )
                      "
                    >
                      {{ activity.title }}
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </b-col>
            <!-- Outcome selection -->
            <b-col cols="7" v-if="active_section == sections[1]">
              <div
                v-if="!selected_activity"
                class="d-flex align-items-center justify-content-center"
                style="height: 100%"
              >
                <h6>Nessuna attività selezionata.</h6>
              </div>
              <b-row v-else class="p-0 scrollable-full-body-height">
                <b-col
                  class="p-0 m-0 d-flex flex-column align-items-center mission-group-item"
                >
                  <h3 class="p-0 mt-2 mb-1">
                    {{ selected_activity.title }}
                  </h3>
                  <h5 class="pt-3">Collegamenti con le altre attività</h5>
                  <b-row class="m-0 justify-content-center" style="width: 100%">
                    <b-col
                      cols="4"
                      style="
                        background-color: #171926;
                        text-align: center;
                        border-radius: 10px;
                        box-shadow: 0 2px 0#00bd58;
                        outline: 0;
                      "
                      class="mx-3"
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
                        class="mb-2"
                        :options="next_activity_select"
                        v-model="selected_activity.correct.key"
                      ></b-form-select>
                    </b-col>
                    <b-col
                      v-if="selected_activity.wrong"
                      cols="4"
                      style="
                        background-color: #171926;
                        text-align: center;
                        border-radius: 10px;
                        box-shadow: 0 2px 0#FF3D4A;
                        outline: 0;
                      "
                      class="mx-3"
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
                        class="mb-2"
                        :options="next_activity_select"
                        v-model="selected_activity.wrong.key"
                      ></b-form-select>
                    </b-col>
                  </b-row>
                  <h5 class="pt-3">Elementi dell'attività</h5>
                  <b-list-group-item
                    v-for="(element, index) in selected_activity.elements"
                    :key="index"
                    class="px-0 py-2 my-1"
                    style="width: 70%"
                  >
                    {{ element.component.type }}
                  </b-list-group-item>
                </b-col>
              </b-row>
            </b-col>
            <!-- Settings -->
            <b-col
              class="m-0 p-0 scrollable-full-body-height"
              v-if="active_section == sections[2]"
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
                    v-model="mission.title"
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

      <template #modal-footer>
        <b-row d-flex justify-content-end>
          <b-button class="mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="mx-1"
            v-on="
              valid_mission
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
      // Menu sections
      sections: ["Attività", "Esiti", "Impostazioni"],
      active_section: null,
      activity_filter: "",
      selected_activity: null,
      mission: null,
    };
  },
  props: {
    activities: {
      type: Array,
    },
    mission_prop: {
      type: Object,
    },
  },
  computed: {
    available_filtered_activities: function () {
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
    next_activity_select: function () {
      let a = JSON.parse(JSON.stringify(this.mission.activities));
      a.push({
        key: "-1",
        title: "Fine missione",
      });
      return a;
    },
    valid_title: function () {
      return this.mission.title;
    },
    valid_starting_activity: function () {
      return this.mission.first_activity;
    },
    valid_activity_presence: function () {
      return this.mission.activities.length;
    },
    valid_mission_activities: function () {
      for (let i = 0; i < this.mission.activities.length; i++) {
        let wrong_presence = this.mission.activities[i].wrong != null;
        if (
          this.mission.activities[i].correct.key == null ||
          (wrong_presence
            ? this.mission.activities[i].wrong.key == null
            : false)
        )
          return false;
      }
      return true;
    },
    valid_mission: function () {
      return (
        this.valid_title &&
        this.valid_starting_activity &&
        this.valid_activity_presence &&
        this.valid_mission_activities
      );
    },
  },
  methods: {
    // Utilities
    init() {
      this.active_section = this.sections[0];
      this.mission = JSON.parse(JSON.stringify(this.mission_prop));
    },
    reset() {
      this.$bvModal.hide("modal-edit-mission");
      this.activity_filter = "";
      this.selected_activity = null;
    },
    save() {
      this.$emit("mission-updated", this.mission);
      this.reset();
    },

    // Validation and errors
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (!this.valid_title) a.push("Il titolo non può essere vuoto");
      if (!this.valid_starting_activity) a.push("Manca l'attività iniziale");
      if (!this.valid_activity_presence) a.push("Nessuna attività aggiunta");
      if (!this.valid_mission_activities)
        a.push("Inserisci gli esiti delle attività");
      return a;
    },
    activityClass(activity) {
      return {
        unavailable: activity != this.selected_activity,
      };
    },
    showActivityInfos(activity) {
      this.selected_activity = activity;
    },
    onAvailableActivityClick(activity) {
      let a = JSON.parse(JSON.stringify(activity));
      a.key = String(Date.now());
      a.correct = {
        key: null,
        points: 1,
      };
      if (this.activityCanBeWrong(activity))
        a.wrong = {
          key: null,
          points: 0,
        };
      else a.wrong = null;
      this.mission.activities.push(a);
    },
    activityCanBeWrong(activity) {
      let response = true;
      activity.elements.forEach((element) => {
        if (element.component.type == "Testo") response = false;
        if (element.component.type == "Memory") response = false;
      });
      return response;
    },
    removeActivity(activity) {
      let index = this.mission.activities.indexOf(activity);
      this.mission.activities.splice(index, 1);
      if (activity.key == this.mission.first_activity)
        this.mission.first_activity = null;
    },
  },
  watch: {
    mission_prop(new_value) {
      this.mission = JSON.parse(JSON.stringify(new_value));
    },
  },
};
</script>

<style></style>
