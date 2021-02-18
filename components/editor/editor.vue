<template>
  <div id="editor">
    <!-- Navbar -->
    <b-navbar sticky id="topbar" type="dark" class="py-0 px-0">
      <b-navbar-brand class="py-0 mx-5" href="/">
        <img src="../public/images/logo2.png" alt="Logo" height="46" />
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item
          v-for="(item, index) in sections"
          :key="index"
          :class="{ active: item === active_section }"
          @click="setActiveSection(index)"
          class="py-2 px-4"
        >
          {{ item.navbar_name }}
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <!-- Page content -->
    <b-container class="editor-wrapper" fluid v-if="active_section">
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
            responsive
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
            <template v-slot:cell(storyAccessibility)="data">
              <div v-if="storyAccessibleContent(data)" class="cell-true">✓</div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(missionCompleted)="data">
              <div v-if="missionCompletedContent(data)" class="cell-true">
                ✓
              </div>
              <div v-else class="cell-false">✗</div>
            </template>
            <template v-slot:cell(missionAccessibility)="data">
              <div v-if="missionAccessibleContent(data)" class="cell-true">
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
            <template v-slot:cell(activityAccessibility)="data">
              <div v-if="activityAccessibleContent(data)" class="cell-true">
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
                title="Pubblica"
              >
                <b-icon-play-fill></b-icon-play-fill>
              </b-button>
              <b-button
                v-if="active_section == sections[0]"
                size="sm"
                style="background-color: #003086"
                @click="onArchive(data)"
                title="Archivia"
              >
                <b-icon-archive-fill></b-icon-archive-fill>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #ff3d4a"
                @click="onDelete(data, active_section.navbar_name)"
                title="Elimina"
              >
                <b-icon-trash-fill></b-icon-trash-fill>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #00bec8"
                @click="onEdit(data)"
                title="Modifica"
              >
                <b-icon-pencil-square></b-icon-pencil-square>
              </b-button>
              <b-button
                size="sm"
                style="background-color: #ffa300"
                @click="onClone(data)"
                title="Duplica"
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
    <new-element
      :category="active_section.navbar_name"
      @add-element="onAddElement"
      @found-errors="onShowErrorAlert"
    ></new-element>

    <modal-edit-story
      :story_prop="active_element"
      :missions="missions"
      :activities="activities"
      @found-errors="onShowErrorAlert"
      @story-updated="onElementUpdated($event, 'stories')"
    ></modal-edit-story>

    <modal-edit-mission
      :mission_prop="active_element"
      :activities="activities"
      @found-errors="onShowErrorAlert"
      @mission-updated="onElementUpdated($event, 'missions')"
    ></modal-edit-mission>

    <modal-edit-activity
      :activity_prop="active_element"
      @found-errors="onShowErrorAlert"
      @activity-updated="onElementUpdated($event, 'activities')"
    ></modal-edit-activity>

    <b-modal id="error-alert" title="Attenzione">
      <b-container class="mt-2" fluid>
        <h5>Sono stati trovati i seguenti errori:</h5>
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            {{ error }}
          </li>
        </ul>
      </b-container>
    </b-modal>
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
              thStyle: "width: 27%;",
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
              key: "storyAccessibility",
              label: "Accessibilità",
              thStyle: "text-align:center;  width: 9%;",
            },
            {
              key: "actions",
              label: "Azioni",
              thStyle: "width: 17%;",
              tdClass: "cell-default",
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
              key: "missionAccessibility",
              label: "Accessibilità",
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
              key: "activityAccessibility",
              label: "Accessibilità",
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

      // Utility data
      active_element: null,
      errors: [],
    };
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
    onElementUpdated(element, category) {
      fetch("/api/" + category + "/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(element),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + category);
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return response.json();
        })
        .then((data) => {
          this.setCollectionByName(category, data);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation",
            error
          );
          this.setCollectionByName(category, null);
        });
    },
    onAddElement(element) {
      let collection_name = this.collectionName(
        this.active_section.navbar_name
      );
      fetch("/api/" + collection_name + "/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(element),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + collection_name);
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return response.json();
        })
        .then((data) => {
          this.setCollectionByName(collection_name, data);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation",
            error
          );
          this.setCollectionByName(collection_name, null);
        });
    },
    setActiveSection(index) {
      this.active_section = this.sections[index];
    },
    addNewElement() {
      this.$bvModal.show("modal-add-new-element");
    },
    onShowErrorAlert(errors_from_component) {
      this.errors = errors_from_component;
      this.$bvModal.show("error-alert");
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
      switch (name) {
        case "Storie":
          return "stories";
        case "Missioni":
          return "missions";
        case "Attività":
          return "activities";
        default:
          break;
      }
    },
    setCollectionByName(name, value) {
      switch (name) {
        case "stories":
          this.stories = value;
          break;
        case "missions":
          this.missions = value;
          break;
        case "activities":
          this.activities = value;
          break;
        default:
          break;
      }
    },
    onPublish(data) {
      if (data.item.paths.length && !data.item.settings.archived) {
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
          .then((stories) => {
            this.stories = stories;
            this.isBusy = false;
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation",
              error
            );
            this.stories = null;
          });
      } else {
        if (data.item.settings.archived) {
          this.onShowErrorAlert([
            "Una storia archiviata non può essere pubblicata",
          ]);
        } else {
          this.onShowErrorAlert([
            "Per pubblicare la storia è necessario almeno un perscorso",
          ]);
        }
      }
    },
    onArchive(data) {
      if (!data.item.settings.published) {
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
          .then((data_stories) => {
            this.stories = data_stories;
            this.isBusy = false;
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation",
              error
            );
            this.stories = null;
          });
      } else {
        this.onShowErrorAlert([
          "Una storia pubblicata non può essere archiviata",
        ]);
      }
    },
    onDelete(data, name) {
      this.isBusy = true;
      let section_name = this.active_section.navbar_name;
      let collection_name = this.collectionName(section_name);
      fetch("/api/" + collection_name + "/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: data.item.key }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + collection_name);
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return response.json();
        })
        .then((data_collection) => {
          this.setCollectionByName(collection_name, data_collection);
          this.isBusy = false;
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation",
            error
          );
          this.setCollectionByName(collection_name, null);
        });
    },
    onEdit(data) {
      this.active_element = data.item;
      switch (this.active_section.navbar_name) {
        case "Storie":
          this.$bvModal.show("modal-edit-story");
          break;
        case "Missioni":
          this.$bvModal.show("modal-edit-mission");
          break;
        case "Attività":
          this.$bvModal.show("modal-edit-activity");
          break;
        default:
          break;
      }
    },
    onClone(data) {
      this.isBusy = true;
      let section_name = this.active_section.navbar_name;
      let collection_name = this.collectionName(section_name);
      let cloned = {};
      switch (section_name) {
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
      fetch("/api/" + collection_name + "/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cloned),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + collection_name);
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return response.json();
        })
        .then((data_collection) => {
          this.setCollectionByName(collection_name, data_collection);
          this.isBusy = false;
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation",
            error
          );
          this.setCollectionByName(collection_name, null);
        });
    },
    onUpdateStories(updated_data) {
      this.stories = updated_data;
    },
    onUpdateMissions(updated_data) {
      this.missions = updated_data;
    },
    onUpdateActivities(updated_data) {
      this.activities = updated_data;
    },
    fetchData() {
      this.fetchStories();
      this.fetchMissions();
      this.fetchActivities();
    },
    fetchStories() {
      fetch("/api/stories")
        .then((response) => response.json())
        .then((data) => {
          this.stories = data;
        });
    },
    fetchMissions() {
      fetch("/api/missions")
        .then((response) => response.json())
        .then((data) => {
          this.missions = data;
        });
    },
    fetchActivities() {
      fetch("/api/activities")
        .then((response) => response.json())
        .then((data) => {
          this.activities = data;
        });
    },
    /* DA CONTROLLARE */
    storyAccessibleContent(data) {
      let a = true;
      data.item.paths.forEach((path) => {
        path.missions.forEach((mission) => {
          if (mission.key != "-1") {
            mission.activities.forEach((activity) => {
              activity.elements.forEach((element) => {
                if (
                  element.component.type == "Foto" ||
                  element.component.type == "Video" ||
                  element.component.type == "Memory"
                )
                  a = false;
              });
            });
          }
        });
      });
      data.item.settings.accessible = a;
      return a;
    },
    missionCompletedContent(data) {
      return data.item.activities.length > 0 ? true : false;
    },
    missionAccessibleContent(data) {
      let a = true;
      data.item.activities.forEach((activity) => {
        activity.elements.forEach((element) => {
          if (
            element.component.type == "Foto" ||
            element.component.type == "Video" ||
            element.component.type == "Memory"
          )
            a = false;
        });
      });
      return a;
    },
    activityCompletedContent(data) {
      return data.item.elements.length > 0 ? true : false;
    },
    activityAccessibleContent(data) {
      let a = true;
      data.item.elements.forEach((element) => {
        if (
          element.component.type == "Foto" ||
          element.component.type == "Video" ||
          element.component.type == "Memory"
        )
          a = false;
      });
      return a;
    },
  },
  components: {
    newElement: httpVueLoader("comp/editor/new_element.vue"),
    modalEditStory: httpVueLoader("comp/editor/modal_edit_story.vue"),
    modalEditMission: httpVueLoader("comp/editor/modal_edit_mission.vue"),
    modalEditActivity: httpVueLoader("comp/editor/modal_edit_activity.vue"),
  },
  created: function () {
    this.fetchData();
    this.setActiveSection(0);
  },
};
</script>

<style>
/* NAVBAR */

::-moz-selection {
  color: var(--text-color);
  background: var(--selection-color);
}

::selection {
  color: var(--text-color);
  background: var(--selection-color);
}

#editor {
  background-color: var(--primary-color);
  width: 100vw;
  height: 100vh;
  color: var(--text-color);
}

body {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.navbar {
  background-color: var(--secondary-color);
}

.navbar .nav-item {
  box-sizing: border-box;
  transition: 0.5s;
  color: var(--disabled-color);
}

.navbar .nav-item.active {
  box-shadow: 0 2px 0 var(--active-color);
  color: var(--text-color);
}

.navbar-dark .navbar-nav .active > .nav-link,
.navbar-dark .navbar-nav .nav-link.active,
.navbar-dark .navbar-nav .nav-link.show,
.navbar-dark .navbar-nav .show > .nav-link {
  color: var(--text-color);
}

.navbar .nav-item:hover {
  background-color: var(--hover-color);
}

/* TAB DELLE SCHERMATE (es. Storie e Archiviate) */
.tabs .list-group-item {
  background-color: transparent;
  border: 0px;
  color: var(--disabled-color);
  white-space: nowrap;
}

.tabs .list-group-item:focus {
  outline: 0;
}

.tabs .list-group-item.active {
  color: var(--text-color);
}

/* BOTTONE */
.btn {
  background-color: var(--form-color);
  border: none;
  border-radius: 10px;
}

.btn:hover {
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

/* LENTE INGRANDIMENTO INPUT */
.input-group-text {
  background-color: var(--form-color);
  color: var(--disabled-color);
  border: none;
  border-radius: 10px;
}

/* TEXT BOX INPUT */
.form-control {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  border-radius: 10px;
}

.form-control:focus {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  box-shadow: none;
}

.custom-select {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  border-radius: 10px;
}

/* TABELLA STORIE/MISSIONI/ATTIVITA' */
.b-table {
  border-collapse: separate;
  border-spacing: 0px 15px;
}

.table-row {
  background-color: var(--object-color);
  color: var(--text-color);
}

.cell-default {
  color: var(--text-color);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
  white-space: nowrap;
}

.table-hover tbody tr:hover {
  background-color: var(--hover-color);
}

/* MODAL */

.modal-header {
  background-color: var(--secondary-color);
  border: 0px;
}

.modal-footer {
  background-color: var(--secondary-color);
  border: 0px;
}

.modal-content {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.modal-body {
  padding: 0px;
}

.modal-xl .modal-header {
  padding: 0px;
  background-color: var(--secondary-color);
  border: 0px;
  height: 60px;
}

.modal-xl .modal-footer {
  background-color: var(--secondary-color);
  border: 0px;
  height: 68px;
}

.modal-xl .modal-content {
  background-color: var(--primary-color);
  color: var(--text-color);
  height: calc(100vh - 56px);
}

.modal-xl .modal-body {
  padding: 0px;
  height: calc(100vh - 60px - 68px - 56px);
}

/* ELEMENTO MISSIONE NEL MODAL */
.mission-group-item .list-group-item {
  background-color: var(--object-color);
  color: var(--text-color);
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 0 var(--active-color);
  overflow: hidden;
  outline: 0;
}

.mission-group-item .list-group-item:hover {
  background-color: var(--hover-color);
}

.mission-group-item .list-group-item:focus {
  background-color: var(--hover-color);
}

/* ELEMENTO INATTIVO MISSIONE NEL MODAL */
.mission-group-item .list-group-item.unavailable {
  color: var(--disabled-color);
  box-shadow: 0 2px 0 var(--disabled-color);
}

/* PRIMA COLONNA DEL MODAL */
.menu-column {
  height: calc(100vh - 60px - 68px - 28px - 28px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--tertiary-color);
}

.menu-column .list-group-item {
  background-color: transparent;
  border: 0px;
  color: var(--disabled-color);
  box-sizing: border-box;
  transition: 0.5s;
  outline: 0;
  border-radius: 0px;
}

.menu-column .list-group-item:hover {
  background-color: var(--hover-color);
}

.menu-column .list-group-item:focus {
  background-color: var(--hover-color);
}

.menu-column .list-group-item.active {
  color: var(--text-color);
  box-shadow: 0px 3px 0px var(--active-color);
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
  background-color: var(--active-color);
}

.selezionate {
  border-right-color: white;
  border-right-width: 1px;
  border-right-style: solid;
  color: var(--text-color);
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
  color: var(--text-color);
  background-color: transparent;
}

.unavailable .path-label {
  color: var(--disabled-color);
}

.path-label:disabled {
  background-color: transparent;
}

.path-label:hover {
  background-color: transparent;
}

.pad .mission-group-item .selected-component {
  background-color: var(--active-color);
}

.custom-control-label::before {
  background: transparent !important;
  border-color: var(--text-color);
}

.custom-control-input:checked ~ .custom-control-label::before {
  background: transparent !important;
  border-color: var(--active-color);
}

.b-form-tag {
  background-color: var(--disabled-color);
}

.background-preview {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 3px 3px 5px rgb(0, 0, 0);
  border-radius: 10px;
}

.image-container {
  width: 200px;
  height: 200px;
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 1em;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  background-color: var(--object-color);
  box-shadow: 3px 3px 5px rgb(0, 0, 0);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.image-container:hover {
  transition: 0.5s;
  background-color: var(--hover-color);
}

.background-container {
  width: 664px;
  height: 498px;
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 1em;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  background-color: var(--object-color);
  box-shadow: 3px 3px 5px rgb(0, 0, 0);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.background-container:hover {
  transition: 0.5s;
  background-color: var(--hover-color);
}

#memory {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#memory-grid {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: var(--object-color);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s ease 0s;
  margin-bottom: 1em;
}

.memory-card {
  box-sizing: border-box;
  border: white solid 2px;
  width: calc(100% / 4);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: brightness(0);
  transition: all 0.3s ease 0s;
}

.b-form-tags {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  border-radius: 10px;
}

.b-form-tags.focus {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  box-shadow: none;
}

.b-form-tags-input {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  border-radius: 10px;
}
</style>
