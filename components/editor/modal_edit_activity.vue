<template>
  <div>
    <!-- Modal edit activity -->
    <b-modal @show="init()" @hide="reset()" size="xl" id="modal-edit-activity">
      <template #modal-header>
        <b-container fluid class="d-flex align-items-center">
          <h4 class="py-3">{{ activity_prop.title }}</h4>
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
            <!-- Components -->
            <b-col cols="5" v-if="active_section == sections[0]">
              <div class="scrollable-full-body-height p-0 m-0 pad">
                <h5 class="mb-2 mt-3">
                  Necessari
                  <sup
                    ><b-icon
                      icon="info-circle"
                      id="info-required-component"
                    ></b-icon
                  ></sup>
                </h5>
                <b-popover
                  target="info-required-component"
                  placement="right"
                  triggers="hover focus"
                  >Un componente necessario è<br />
                  richiesto in ogni attività, ne<br />
                  determina il tipo e non ne può<br />
                  essere aggiunto più di uno.</b-popover
                >
                <div class="d-flex flex-wrap mission-group-item">
                  <b-button
                    v-for="(component, index) in components_special"
                    :key="index"
                    class="m-2 list-group-item"
                    @click="selectComponent(component)"
                    :disabled="disableSpecial"
                    :class="checkSelected(component)"
                    style="height: 75px; width: 130px"
                  >
                    {{ component.type }}
                  </b-button>
                </div>
                <h5 class="mb-2 mt-3">
                  Aggiuntivi
                  <sup
                    ><b-icon icon="info-circle" id="info-component"></b-icon
                  ></sup>
                </h5>
                <b-popover
                  target="info-component"
                  placement="right"
                  triggers="hover focus"
                  >I componenti aggiuntivi <br />
                  vengono usati per arricchire<br />
                  l'attività di dettagli, possono<br />
                  essere aggiunti senza limiti.</b-popover
                >
                <div class="d-flex flex-wrap mission-group-item">
                  <b-button
                    v-for="(component, index) in components"
                    :key="index"
                    class="m-2 list-group-item"
                    @click="selectComponent(component)"
                    :disabled="disableDefault"
                    :class="checkSelected(component)"
                    style="height: 75px; width: 130px"
                  >
                    {{ component.type }}
                  </b-button>
                </div>
                <h5 class="mb-2 mt-3">
                  Minigiochi
                  <sup
                    ><b-icon icon="info-circle" id="info-minigames"></b-icon
                  ></sup>
                </h5>
                <b-popover
                  target="info-minigames"
                  placement="right"
                  triggers="hover focus"
                  >I minigiochi sono componenti<br />
                  indipendenti ed unici, possono<br />
                  essere aggiunti soltanto ad <br />
                  un'attività vuota.</b-popover
                >
                <div class="d-flex flex-wrap mission-group-item">
                  <b-button
                    v-for="(component, index) in minigames"
                    :key="index"
                    class="m-2 list-group-item"
                    @click="selectComponent(component)"
                    :disabled="disableMinigames"
                    :class="checkSelected(component)"
                    style="height: 75px; width: 130px"
                  >
                    {{ component.type }}
                  </b-button>
                </div>
              </div>
            </b-col>
            <!-- Structure -->
            <b-col cols="5" v-if="active_section == sections[0]">
              <b-row class="m-0 p-0">
                <b-col cols="auto" class="p-0 mr-auto mt-2 mb-1">
                  <h3 style="height: 34px">Struttura</h3>
                </b-col>
                <b-col cols="auto" class="my-2 px-0">
                  <b-button @click="showPreview"> Anteprima </b-button>
                </b-col>
              </b-row>
              <b-row class="scrollable p-0 m-0">
                <b-container
                  fluid
                  class="d-flex flex-column align-items-center justify-content-center py-3 mission-group-item"
                >
                  <b-list-group-item
                    button
                    v-for="(element, index) in activity.elements"
                    :key="index"
                    class="my-1 activity-button d-flex align-items-center justify-content-between"
                    @click="editComponent(element)"
                  >
                    <div class="mr-auto ml-1">
                      {{
                        element.component.type
                          ? element.component.type
                          : "Nuovo elemento"
                      }}
                    </div>
                    <div>
                      <b-button
                        class="align-self-start mx-1"
                        @click.stop="removeElement(element)"
                      >
                        <b-icon-x></b-icon-x>
                      </b-button>
                    </div>
                  </b-list-group-item>
                  <b-list-group-item
                    @click="addElement()"
                    class="my-1 activity-button d-flex align-items-center justify-content-center"
                    button
                    style="overflow: hidden"
                    ><h2>+</h2>
                  </b-list-group-item>
                </b-container>
              </b-row>
            </b-col>
            <!-- Settings -->
            <b-col
              class="m-0 p-0 scrollable-full-body-height"
              v-if="active_section == sections[1]"
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
                    v-model="activity.title"
                    placeholder="Inserisci il titolo..."
                  ></b-form-input>
                </div>
                <div class="m-3 d-flex flex-column align-items-center">
                  <h5>Tempo stimato</h5>
                  <p>in minuti</p>
                  <b-form-input
                    style="width: 50%"
                    type="number"
                    v-model="activity.time"
                    placeholder="Inserisci un valore..."
                  ></b-form-input>
                </div>
              </b-container>
            </b-col>
          </b-row>
        </b-container>
      </template>

      <template #modal-footer>
        <div d-flex justify-content-end>
          <b-button class="mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="mx-1"
            v-on="
              valid_activity
                ? { click: () => save() }
                : { click: () => notifyErrors() }
            "
          >
            Salva
          </b-button>
        </div>
      </template>
    </b-modal>

    <!-- Modal edit component -->
    <modal-edit-component
      :component_prop="component_edited"
      @component-edited="updateComponent"
      @found-errors="$emit('found-errors', $event)"
    ></modal-edit-component>

    <modal-preview :activity="activity"> </modal-preview>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      // Menu sections
      sections: ["Componenti", "Impostazioni"],
      active_section: null,

      // Components
      components_special: [
        {
          type: "Domanda",
          question: "",
          answers: [],
          nr_answer_required: 1,
        },
        {
          type: "Scelta-Multipla",
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
      ],
      components: [
        {
          type: "Descrizione",
          description: "",
        },
        {
          type: "Immagine",
          url: "",
          description: "",
        },
        {
          type: "Video",
          url: "",
        },
      ],
      minigames: [
        {
          type: "Memory",
          images: [
            {
              url: "",
            },
            {
              url: "",
            },
            {
              url: "",
            },
            {
              url: "",
            },
            {
              url: "",
            },
            {
              url: "",
            },
          ],
          background: { url: "" },
        },
      ],

      // Current activity
      activity: null,

      // Current selected component
      component_selected: null,

      // Current edited component
      component_edited: null,

      // Current edited element
      element_edited: null,
    };
  },
  props: {
    activity_prop: {
      type: Object,
    },
  },
  computed: {
    disableDefault: function () {
      let a = false;
      this.activity.elements.forEach((element) => {
        this.minigames.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
      });
      return a;
    },
    disableSpecial: function () {
      let a = false;
      this.activity.elements.forEach((element) => {
        this.components_special.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
        this.minigames.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
      });
      return a;
    },
    disableMinigames: function () {
      let a = false;
      this.activity.elements.forEach((element) => {
        this.components.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
        this.components_special.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
        this.minigames.forEach((component) => {
          if (element.component.type == component.type) a = true;
        });
      });
      return a;
    },
    valid_title: function () {
      return this.activity.title;
    },
    valid_time: function () {
      return this.activity.time;
    },
    valid_structure: function () {
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (!this.activity.elements[i].component.type) return false;
      }
      return true;
    },
    valid_activity: function () {
      return (
        this.valid_title &&
        this.valid_time &&
        this.valid_structure &&
        this.disableSpecial
      );
    },
  },
  methods: {
    // Utilities
    init() {
      this.active_section = this.sections[0];
      this.activity = JSON.parse(JSON.stringify(this.activity_prop));
    },
    reset() {
      this.$bvModal.hide("modal-edit-activity");
      this.component_selected = null;
    },
    save() {
      this.$emit("activity-updated", this.activity);
      this.reset();
    },

    // Component selection
    selectComponent(component) {
      if (this.component_selected) {
        if (this.component_selected.type == component.type) {
          this.component_selected = null;
        } else {
          this.component_selected = JSON.parse(JSON.stringify(component));
        }
      } else {
        this.component_selected = JSON.parse(JSON.stringify(component));
      }
    },
    checkSelected(component) {
      if (this.component_selected) {
        if (this.component_selected.type == component.type)
          return "selected-component";
      }
    },

    // Validation and errors
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (!this.valid_title) a.push("Il titolo non può essere vuoto");
      if (!this.valid_time) a.push("Il tempo non può essere nullo");
      if (!this.valid_structure)
        a.push("Una o più elementi dell'attività sono incompleti");
      if (!this.disableSpecial)
        a.push("Aggiungi un componente necessario o un minigioco");
      return a;
    },

    // Component editing
    editComponent(element) {
      if (this.component_selected) {
        this.element_edited = element;
        this.component_edited = this.component_selected;
        this.component_selected = null;
        this.$bvModal.show("modal-edit-component");
      } else {
        if (element.component.type) {
          this.element_edited = element;
          this.component_edited = element.component;
          this.$bvModal.show("modal-edit-component");
        }
      }
    },
    updateComponent(component_updated) {
      this.element_edited.component = component_updated;
    },

    // Element editing
    addElement() {
      this.activity.elements.push({
        component: {
          type: "",
        },
      });
    },
    removeElement(element) {
      let index = this.activity.elements.indexOf(element);
      if (index != -1) this.activity.elements.splice(index, 1);
    },

    showPreview() {
      this.$bvModal.show("modal-preview");
    },
  },
  watch: {
    activity_prop(new_value) {
      this.activity = JSON.parse(JSON.stringify(new_value));
    },
  },
  components: {
    modalEditComponent: httpVueLoader("comp/editor/modal_edit_component.vue"),
    modalPreview: httpVueLoader("comp/editor/modal_preview.vue"),
  },
};
</script>

<style></style>
