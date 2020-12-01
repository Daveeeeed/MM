<template>
  <div id="editor">
    <!-- Navbar -->
    <b-navbar sticky id="topbar" type="dark" class="py-0 px-0">
      <b-navbar-brand class="py-0 mx-5">
        <img src="../public/images/logo2.png" alt="Logo" height="46" />
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item
          v-for="(item, index) in sections"
          :key="index"
          :class="{ active: item === active_section }"
          @click="active_section = item"
          class="py-2 px-4"
        >
          {{ item.navbar_name }}
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <!-- Page content -->
    <b-container fluid v-if="active_section">
      <!-- Section header -->
      <b-row>
        <b-col cols="auto" class="mr-auto ml-4">
          <b-list-group class="tabs" horizontal>
            <b-list-group-item
              button
              v-for="(item, index) in active_section.tabs"
              :key="index"
              class="px-2"
              :class="{ active: item == active_section.tab_active }"
              @click="active_section.tab_active = item"
            >
              <h3>{{ item }}</h3>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col cols="4" class="my-2 px-0">
          <b-input-group id="searchbar" class="px-1">
            <b-input-group-prepend is-text>
              <b-icon-search></b-icon-search>
            </b-input-group-prepend>
            <b-form-input
              spellcheck="false"
              type="search"
              placeholder="Cerca..."
              v-model="active_section.table_filter"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="auto" class="my-2 mr-3 px-0">
          <b-button class="px-4" @click="addNewElement()">{{
            active_section.add_new_placeholder
          }}</b-button>
        </b-col>
      </b-row>
      <!-- Section table -->
      <b-row>
        <b-col>
          <b-table
            borderless
            hover
            :busy="isBusy"
            :filter="active_section.table_filter"
            :filter-included-fields="filter_field"
            :items="active_section.table_items"
            :fields="active_section.table_fields"
            tbody-tr-class="table-row"
            thead-class="cell-default"
          >
            <template v-slot:cell(storyForHandicapped)="data">
              <div v-if="storyForHandicappedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(missionCompleted)="data">
              <div v-if="missionCompletedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(missionForHandicapped)="data">
              <div v-if="missionForHandicappedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(activityCompleted)="data">
              <div v-if="activityCompletedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(activityForHandicapped)="data">
              <div v-if="activityForHandicappedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(actions)="data">
              <b-button
                v-if="active_section == sections[0]"
                size="sm"
                style="background-color: #8f65fc"
                @click="onPublish(data)"
              >
                <b-icon-play-fill></b-icon-play-fill>
              </b-button>
              <b-button
                v-if="active_section == sections[0]"
                size="sm"
                style="background-color: #003086"
                @click="onArchive(data)"
              >
                <b-icon-archive-fill></b-icon-archive-fill>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #ff3d4a"
                @click="onDelete(data, active_section.navbar_name)"
              >
                <b-icon-trash-fill></b-icon-trash-fill>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #00bec8"
                @click="onEdit(data)"
              >
                <modal-edit-story
                  v-if="active_section.navbar_name == 'Storie'"
                  :story_to_edit="data.item"
                  :missions="missions"
                  :activities="activities"
                ></modal-edit-story>

                <modal-edit-mission
                  v-if="active_section.navbar_name == 'Missioni'"
                  :mission_to_edit="data.item"
                  :activities="activities"
                ></modal-edit-mission>

                <modal-edit-activity
                  v-if="active_section.navbar_name == 'Attività'"
                  :activity_prop="data.item"
                ></modal-edit-activity>

                <b-icon-pencil-square></b-icon-pencil-square>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #ffa300"
                @click="onClone(data, active_section.navbar_name)"
              >
                <b-icon-back></b-icon-back>
              </b-button>
            </template>
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>

    <!-- Modals -->
    <modal-new-element
      :category="active_section.navbar_name"
    ></modal-new-element>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      // Main Array
      stories: null,
      missions: null,
      activities: null,

      // Sections
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
              thStyle: "width: 30%;",
            },
            {
              key: "settings.published",
              label: "Pubblicata",
              formatter: "tableFormatter",
              tdClass: "cellFormatter",
              thStyle: "text-align:center; width: 6%;",
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
              key: "storyForHandicapped",
              label: "Accessibile",
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
              key: "missionCompleted",
              label: "Utilizzabile",
              thStyle: "text-align:center;  width: 7%;",
            },
            {
              key: "missionForHandicapped",
              label: "Accessibile",
              thStyle: "text-align:center;  width: 7%;",
            },
            {
              key: "actions",
              label: "Azioni",
              thStyle: "width: 7%;",
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
              key: "activityCompleted",
              label: "Utilizzabile",
              thStyle: "text-align:center;  width: 7%;",
            },
            {
              key: "activityForHandicapped",
              label: "Accessibile",
              thStyle: "text-align:center;  width: 7%;",
            },
            {
              key: "actions",
              label: "Azioni",
              thStyle: "width: 7%;",
            },
          ],
          table_filter: null,
          table_items: null,
          tabs: ["Attività"],
        },
      ],
      active_section: null,

      // Tables
      filter_field: ["title"],
      isBusy: false,
    };
  },
  props: {},
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
    addNewElement() {
      this.$bvModal.show("modal-add-new-element");
    },
    storyForHandicappedContent(data) {
      let a = true;
      data.item.paths.forEach((path) => {
        path.missions.forEach((mission) => {
          mission.activities.forEach((activity) => {
            activity.elements.forEach((element) => {
              if (
                element.type == "Foto" ||
                element.type == "Immagine" ||
                element.type == "Video" ||
                element.type == "Word Invaders" ||
                element.type == "Memory"
              )
                a = false;
            });
          });
        });
      });
      return a;
    },
    missionCompletedContent(data) {
      return data.item.activities.length > 0 ? true : false;
    },
    missionForHandicappedContent(data) {
      let a = true;
      data.item.activities.forEach((activity) => {
        activity.elements.forEach((element) => {
          if (
            element.type == "Foto" ||
            element.type == "Immagine" ||
            element.type == "Video" ||
            element.type == "Word Invaders" ||
            element.type == "Memory"
          )
            a = false;
        });
      });
      return a;
    },
    activityCompletedContent(data) {
      return data.item.elements.length > 0 ? true : false;
    },
    activityForHandicappedContent(data) {
      let a = true;
      data.item.elements.forEach((element) => {
        if (
          element.type == "Foto" ||
          element.type == "Immagine" ||
          element.type == "Video" ||
          element.type == "Word Invaders" ||
          element.type == "Memory"
        )
          a = false;
      });
      return a;
    },
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/stories");
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/stories");
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + this.collectionName(name));
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
            elements: data.item.elements,
            correct: data.item.correct,
            wrong: data.item.wrong,
            time: data.item.time,
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + this.collectionName(name));
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
  watch: {},
  components: {
    modalNewElement: httpVueLoader("comp/editor/modal_new_element.vue"),
    modalEditStory: httpVueLoader("comp/editor/modal_edit_story.vue"),
    modalEditMission: httpVueLoader("comp/editor/modal_edit_mission.vue"),
    modalEditActivity: httpVueLoader("comp/editor/modal_edit_activity.vue"),
  },
  created: function () {
    fetchData(this);
    this.active_section = this.sections[0];
  },
};

function fetchData(vue) {
  fetchStories(vue);
  fetchMissions(vue);
  fetchActivities(vue);
}

function fetchStories(vue) {
  fetch("/api/stories")
    .then((response) => response.json())
    .then((data) => {
      vue.stories = data;
    });
}

function fetchMissions(vue) {
  fetch("/api/missions")
    .then((response) => response.json())
    .then((data) => {
      vue.missions = data;
    });
}

function fetchActivities(vue) {
  fetch("/api/activities")
    .then((response) => response.json())
    .then((data) => {
      vue.activities = data;
    });
}
</script>

<style>
/* NAVBAR */
#editor {
  background-color: #121421;
  width: 100vw;
  height: 100vh;
}

.navbar {
  background-color: #1c1e2b;
}

.navbar .nav-item {
  box-sizing: border-box;
  transition: 0.5s;
  color: #848689;
}

.navbar .nav-item.active {
  box-shadow: 0 2px 0 #00bd58;
  color: #ffffff;
}

.navbar .nav-item:hover {
  background-color: #28293d;
}

/* TAB DELLE SCHERMATE (es. Storie e Archiviate) */
.tabs .list-group-item {
  background-color: transparent;
  border: 0px;
  color: #848689;
  white-space: nowrap;
}

.tabs .list-group-item:focus {
  outline: 0;
}

.tabs .list-group-item.active {
  color: white;
}

/* BOTTONE */
.btn {
  background-color: #1a1c2c;
  border: none;
  border-radius: 10px;
}

.btn.darker {
  background-color: #090a11;
}

/* LENTE INGRANDIMENTO INPUT */
.input-group-text {
  background-color: #1a1c2c;
  color: #848689;
  border: none;
  border-radius: 10px;
}

/* TEXT BOX INPUT */
.form-control {
  background-color: #1a1c2c;
  color: #ffffff;
  border: none;
  border-radius: 10px;
}

.form-control:focus {
  background-color: #1a1c2c;
  color: #ffffff;
  border: none;
  box-shadow: none;
}

/* TABELLA STORIE/MISSIONI/ATTIVITA' */
.b-table {
  border-collapse: separate;
  border-spacing: 0px 15px;
}

.table-row {
  background-color: #171926;
  color: #ffffff;
}

.cell-default {
  color: #ffffff;
}

.cell-true {
  color: #00ca5b;
  font-size: 14px;
  text-align: center;
}

.cell-false {
  color: #ff3d4a;
  font-size: 14px;
  text-align: center;
}

.table td,
.table th {
  vertical-align: middle;
}

/* MODAL */

.modal-header {
  background-color: #1c1e2b;
  border: 0px;
}

.modal-footer {
  background-color: #1c1e2b;
  border: 0px;
}

.modal-content {
  background-color: #121421;
  color: #ffffff;
}

.modal-body {
  padding: 0px;
}

.modal-xl .modal-header {
  padding: 0px;
  background-color: #1c1e2b;
  border: 0px;
  height: 60px;
}

.modal-xl .modal-footer {
  background-color: #1c1e2b;
  border: 0px;
  height: 68px;
}

.modal-xl .modal-content {
  background-color: #121421;
  color: #ffffff;
  height: calc(100vh - 56px);
}

.modal-xl .modal-body {
  padding: 0px;
  height: calc(100vh - 60px - 68px - 56px);
}

/* ELEMENTO MISSIONE NEL MODAL */
.mission-group-item .list-group-item {
  background-color: #171926;
  color: #ffffff;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 0 #00bd58;
  overflow-y: auto;
  outline: 0;
}

.mission-group-item .list-group-item:hover {
  background-color: #1c1e2b;
}

.mission-group-item .list-group-item:focus {
  background-color: #1c1e2b;
}

/* ELEMENTO INATTIVO MISSIONE NEL MODAL */
.mission-group-item .list-group-item.unavailable {
  color: #848689;
  box-shadow: 0 2px 0 #848689;
}

/* PRIMA COLONNA DEL MODAL */
.menu-column {
  height: calc(100vh - 60px - 68px - 28px - 28px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #090a11;
}

.menu-column .list-group-item {
  background-color: transparent;
  border: 0px;
  color: #848689;
  box-sizing: border-box;
  transition: 0.5s;
  outline: 0;
  border-radius: 0px;
}

.menu-column .list-group-item:hover {
  background-color: #28293d;
}

.menu-column .list-group-item:focus {
  background-color: #28293d;
}

.menu-column .list-group-item.active {
  color: white;
  box-shadow: 0px 3px 0px #00bd58;
}

.activity-button {
  width: 100%;
  height: 70px;
  padding: 12px;
}

.scrollable {
  height: calc(100vh - 60px - 68px - 56px - 54px);
  overflow-y: auto;
  overflow-x: hidden;
}

.scrollable-full-body-height {
  height: calc(100vh - 60px - 68px - 56px);
  overflow-y: auto;
  overflow-x: hidden;
}

.mission-group-item .list-group-item.selected_path {
  background-color: #00bd58;
}

.selezionate {
  border-right-color: white;
  border-right-width: 1px;
  border-right-style: solid;
  color: #ffffff;
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 64px - 68px - 56px);
}

.edit-title {
  display: inline-block;
}

.bv-no-focus-ring {
  text-align: center;
}

.path-label {
  color: #ffffff;
  background-color: transparent;
}

.unavailable .path-label {
  color: #848689;
}

.path-label:disabled {
  background-color: transparent;
}

.path-label:hover {
  background-color: transparent;
}

.red {
  background-color: #848689;
}

.red:hover {
  background-color: #ff3d4a;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #28293d;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.pad .mission-group-item .selected-component {
  background-color: #00bd58;
}
</style>