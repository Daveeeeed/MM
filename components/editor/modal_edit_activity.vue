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
            <!-- Components  -->
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
                  positioning=""
                  triggers="hover focus"
                  >Un componente necessario è richiesto in ogni attività, ne
                  determina il tipo e non ne può essere aggiunto più di
                  uno.</b-popover
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
                  positioning=""
                  triggers="hover focus"
                  >I componenti aggiuntivi vengono usati per arricchire
                  l'attività di dettagli, possono essere aggiunti senza
                  limiti.</b-popover
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
                  positioning=""
                  triggers="hover focus"
                  >I minigiochi sono componenti indipendenti ed unici, possono
                  essere aggiunti soltanto ad un'attività vuota.</b-popover
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
                  <b-button> Anteprima </b-button>
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
                      {{ element.type }}
                    </div>
                    <div>
                      <b-button
                        class="red align-self-start mx-1"
                        @click="removeElement(element)"
                      >
                        <b-icon-x></b-icon-x>
                      </b-button>
                    </div>
                  </b-list-group-item>
                  <b-list-group-item
                    @click="addElement"
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
                <div class="m-4 d-flex flex-column align-items-center">
                  <h5>Titolo</h5>
                  <b-form-input
                    style="width: 50%"
                    class="m-2"
                    type="text"
                    v-model="activity.title"
                    maxlength="25"
                    placeholder="Inserisci il titolo..."
                  ></b-form-input>
                </div>
                <div class="m-4 d-flex flex-column align-items-center">
                  <h5>Tempo stimato</h5>
                  <p>in minuti</p>
                  <b-form-input
                    style="width: 50%"
                    class="m-2"
                    v-model="activity.time"
                    type="number"
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
          <b-button class="darker mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="darker mx-1"
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
    <b-modal
      v-if="component_selected"
      id="edit-component-modal"
      size="lg"
      :title="component_selected.type"
      @hide="onHideComponentModal()"
      @hidden="
        component_selected = null;
        disableSpecial;
      "
      hide-footer
    >
      <template #default="{ hide }">
        <b-overlay :show="overlay_edit_component">
          <b-container class="my-3 d-flex flex-column justify-content-around">
            <!-- DOMANDA -->
            <div v-if="component_selected.type == 'Domanda'">
              <h5>Domanda</h5>
              <b-form-input
                class="mb-2"
                type="text"
                v-model="component_selected.question"
                placeholder="Inserisci la domanda..."
              ></b-form-input>
              <h5>Risposte</h5>
              <b-form-tags
                placeholder="Risposte..."
                v-model="component_selected.answers"
              ></b-form-tags>
            </div>

            <!-- SCELTA MULTIPLA -->
            <div v-if="component_selected.type == 'Scelta Multipla'">
              <h5>Domanda</h5>
              <p>
                Per superare l'attività sarà richiesto di selezionare una delle
                4 risposte
              </p>
              <b-form-input
                class="mb-2"
                type="text"
                v-model="component_selected.question"
                placeholder="Inserisci la domanda..."
              ></b-form-input>
              <h5>Risposte</h5>
              <b-form-radio
                class="my-1"
                v-model="component_selected.correct_answer"
                name="answers"
                :value="component_selected.answers[0]"
              >
                <b-form-input
                  type="text"
                  v-model="component_selected.answers[0]"
                  placeholder="Risposta..."
                ></b-form-input>
              </b-form-radio>
              <b-form-radio
                class="my-1"
                v-model="component_selected.correct_answer"
                name="answers"
                :value="component_selected.answers[1]"
              >
                <b-form-input
                  type="text"
                  v-model="component_selected.answers[1]"
                  placeholder="Risposta..."
                ></b-form-input>
              </b-form-radio>
              <b-form-radio
                class="my-1"
                v-model="component_selected.correct_answer"
                name="answers"
                :value="component_selected.answers[2]"
              >
                <b-form-input
                  type="text"
                  v-model="component_selected.answers[2]"
                  placeholder="Risposta..."
                ></b-form-input>
              </b-form-radio>
              <b-form-radio
                class="my-1"
                v-model="component_selected.correct_answer"
                name="answers"
                :value="component_selected.answers[3]"
              >
                <b-form-input
                  type="text"
                  v-model="component_selected.answers[3]"
                  placeholder="Risposta..."
                ></b-form-input>
              </b-form-radio>
            </div>

            <!-- FOTO -->
            <div v-if="component_selected.type == 'Foto'">
              <h5>Domanda</h5>
              <p>
                Sarà richiesto lo scatto di una foto come risposta alla seguente
                domanda
              </p>
              <b-form-input
                class="mb-2"
                type="text"
                v-model="component_selected.question"
                placeholder="Inserisci la domanda..."
              ></b-form-input>
            </div>

            <!-- TESTO -->
            <div v-if="component_selected.type == 'Testo'">
              <h5>Descrizione</h5>
              <p>
                Per superare questa attività non sarà richiesta nessuna azione
              </p>
              <b-form-textarea
                class="my-2"
                v-model="component_selected.text"
                placeholder="Inserisci il testo..."
                no-resize
                rows="5"
              ></b-form-textarea>
            </div>

            <!-- COLLEGA -->
            <div v-if="component_selected.type == 'Collega'">
              <h5>Risposte</h5>
              <p>
                L'utente dovrà ricollegare correttamente tutte le frasi,
                proposte spezzate in ordine casuale
              </p>
              <div class="d-flex flex-row justify-content-around">
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[0].first"
                  placeholder="Prima parte..."
                ></b-form-input>
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[0].second"
                  placeholder="Seconda parte..."
                ></b-form-input>
              </div>
              <div class="d-flex flex-row justify-content-around">
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[1].first"
                  placeholder="Prima parte..."
                ></b-form-input>
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[1].second"
                  placeholder="Seconda parte..."
                ></b-form-input>
              </div>
              <div class="d-flex flex-row justify-content-around">
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[2].first"
                  placeholder="Prima parte..."
                ></b-form-input>
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[2].second"
                  placeholder="Seconda parte..."
                ></b-form-input>
              </div>
              <div class="d-flex flex-row justify-content-around">
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[3].first"
                  placeholder="Prima parte..."
                ></b-form-input>
                <b-form-input
                  class="m-1"
                  type="text"
                  v-model="component_selected.answers[3].second"
                  placeholder="Seconda parte..."
                ></b-form-input>
              </div>
            </div>

            <!-- DESCRIZIONE -->
            <div v-if="component_selected.type == 'Descrizione'">
              <h5>Descrizione</h5>
              <b-form-textarea
                class="my-2"
                v-model="component_selected.text"
                placeholder="Inserisci il testo..."
                no-resize
                rows="5"
              ></b-form-textarea>
            </div>

            <!-- IMMAGINE -->
            <div v-if="component_selected.type == 'Immagine'">
              <h5>Immagine</h5>
              <p>La seguente immagine sarà mostrata nella schermata</p>
              <b-form-file
                accept="image/*"
                placeholder="Seleziona foto..."
                v-model="component_selected.name"
                @input="uploadFile"
              ></b-form-file>
            </div>

            <!-- VIDEO -->
            <div v-if="component_selected.type == 'Video'">
              <h5>Video</h5>
              <p>Il seguente video sarà mostrato nella schermata</p>
              <p>E' richiesto l'URL embedded</p>
              <b-form-input
                class="mb-2"
                type="text"
                v-model="component_selected.text"
                placeholder="Inserisci il link qui..."
              ></b-form-input>
            </div>

            <!-- BOTTONI -->
            <div class="d-flex justify-content-end mt-3">
              <b-button class="darker mx-1" @click="hide()">
                Indietro
              </b-button>
              <b-button
                class="darker mx-1"
                v-on="
                  valid_component
                    ? { click: () => onSaveComponentModal() }
                    : { click: () => notifyErrors() }
                "
              >
                Salva
              </b-button>
            </div>
          </b-container>
        </b-overlay>
      </template>
    </b-modal>
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
      ],
      components: [
        {
          type: "Descrizione",
          description: "",
        },
        {
          type: "Immagine",
          photo_key: "",
          name: null,
        },
        {
          type: "Video",
          text: "",
        },
      ],
      minigames: [
        {
          type: "Word Invaders",
          words: [],
        },
        {
          type: "Memory",
          images: [],
        },
      ],

      activity: null,
      into_component_edit: false,
      component_selected: null,
      
      element_selected: null,
      is_element_removed: false,
      to_upload: [],
      overlay_edit_component: false,
      adding_component: false,
    };
  },
  props: {
    activity_prop: {
      type: Object,
    },
  },
  computed: {
    // Disable if added minigame
    disableDefault: function () {
      // La riga successiva serve per "forzare" l'update della computed
      if (this.element_selected);
      let a = false;
      this.activity.elements.forEach((element) => {
        this.minigames.forEach((component) => {
          if (element.type == component.type) a = true;
        });
      });
      return a;
    },
    // Disable if there is already a special
    disableSpecial: function () {
      // La riga successiva serve per "forzare" l'update della computed
      if (this.element_selected);
      let a = false;
      this.activity.elements.forEach((element) => {
        this.components_special.forEach((component) => {
          if (element.type == component.type) a = true;
        });
        this.minigames.forEach((component) => {
          if (element.type == component.type) a = true;
        });
      });
      return a;
    },
    // Disable if there is already a component
    disableMinigames: function () {
      // La riga successiva serve per "forzare" l'update della computed
      if (this.element_selected);
      let a = false;
      this.activity.elements.forEach((element) => {
        this.components.forEach((component) => {
          if (element.type == component.type) a = true;
        });
        this.components_special.forEach((component) => {
          if (element.type == component.type) a = true;
        });
        this.minigames.forEach((component) => {
          if (element.type == component.type) a = true;
        });
      });
      return a;
    },
    valid_title: function () {
      return this.activity.title != "";
    },
    valid_time: function () {
      return this.activity.time != "";
    },
    valid_structure: function () {
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (this.activity.elements[i].type == "") return false;
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
    valid_component: function () {
      if (this.component_selected) {
        switch (this.component_selected.type) {
          case "Domanda": {
            if (
              this.component_selected.question != "" &&
              this.component_selected.answers.length > 0
            )
              return true;
            else return false;
          }
          case "Scelta Multipla": {
            if (
              this.component_selected.question == "" ||
              this.component_selected.correct_answer == null
            ) {
              return false;
            } else {
              for (let i = 0; i < this.component_selected.answers.length; i++) {
                if (this.component_selected.answers[i] == "") return false;
              }
              return true;
            }
          }
          case "Foto": {
            return this.component_selected.question;
          }
          case "Testo": {
            return this.component_selected.text;
          }
          case "Collega": {
            for (let i = 0; i < this.component_selected.answers.length; i++) {
              if (
                this.component_selected.answers[i].first == "" ||
                this.component_selected.answers[i].second == ""
              )
                return false;
            }
            return true;
          }
          case "Riempi": {
          }
          case "Descrizione": {
            return this.component_selected.description;
          }
          case "Immagine": {
            return this.component_selected.photo_key;
          }
          case "Video": {
            return this.component_selected.text;
          }
        }
      }
      return false;
    },
  },
  methods: {
    // Main actions
    init() {
      this.active_section = this.sections[0];
    },
    reset() {
      this.$bvModal.hide("modal-edit-activity");
      this.into_component_edit = false;
      this.component_selected = null;
      this.element_selected = null;
      this.is_element_removed = false;
      this.to_upload = [];
      this.overlay_edit_component = false;
      this.adding_component = false;
    },
    save() {
      this.$emit("activity-updated", this.activity);
      this.reset();
    },

    // Components 
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
    addElement() {
      this.activity.elements.push({
        key: String(Date.now()),
        type: "",
      });
    },
    removeElement(element) {
      this.is_element_removed = true;
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (this.activity.elements[i] === element) {
          this.activity.elements.splice(i, 1);
          i--;
        }
      }
    },

    // Validation and errors
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (this.into_component_edit) {
        if (!this.valid_component)
          a.push("Controlla di aver riempito correttamente tutti i campi");
      } else {
        if (!this.valid_title) a.push("Il titolo non può essere vuoto");
        if (!this.valid_time) a.push("Il tempo non può essere nullo");
        if (!this.valid_structure)
          a.push("Una o più elementi dell'attività sono incompleti");
        if (!this.disableSpecial)
          a.push("Aggiungi un componente necessario o un minigioco");
      }
      return a;
    },

    editComponent(element) {
      if (!this.is_element_removed) {
        this.into_component_edit = true;
        this.element_selected = element;
        if (!this.component_selected && element.type != "") this.component_selected = element;
        this.adding_component = true;
        console.log("faccelo vede")
        this.$bvModal.show("edit-component-modal");
      } else this.is_element_removed = false;
    },
    // Apre il modal di modifica di un componente quando ne è selezionato uno e si clicca un elemento
    /*openComponentModal(element) {
      if (this.component_selected && !this.is_element_removed) {
        this.element_selected = element;
        this.$bvModal.show("edit-component-modal");
        this.adding_component = true;
      } else this.is_element_removed = false;
    },
    // Apre il modal di modifica di un componente quando si clicca sul suo bottone di modifica nell'elemento
    editComponent(element) {
      this.element_selected = element;
      this.component_selected = element;
      this.$bvModal.show("edit-component-modal");
      this.adding_component = true;
    },
    */
   // Quando nel componente foto un file è caricato dal file input si aggiunge alla coda degli upload
    uploadFile(file) {
      let key = String(Date.now());
      this.to_upload = [
        {
          key: key,
          data: file,
        },
      ];
      this.component_selected.photo_key = key;
    },
    // Il modal di modifica di un componenete viene nascosto
    onHideComponentModal() {
      this.into_component_edit = false;
      this.element_selected = null;
      this.to_upload = [];
      this.$bvModal.hide("edit-component-modal");
    },
    // Il modal di modifica di un componenete viene salvato
    onSaveComponentModal() {
      this.overlay_edit_component = true;
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (this.activity.elements[i].key === this.element_selected.key) {
          this.activity.elements[i] = this.component_selected;
          this.activity.elements[i].key = this.element_selected.key;
          this.overlay_edit_component = false;
          this.onHideComponentModal();
        }
      }
    },
  },
  watch: {
    activity_prop(new_value) {
      this.activity = JSON.parse(JSON.stringify(new_value));
    },
  },
};
</script>

<style>
</style>