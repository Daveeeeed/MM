<template>
  <b-modal @hide="onHide()" @ok="onSave()" size="xl" :id="activity_prop.key">
    <template #modal-header>
      <b-container fluid class="d-flex align-items-center">
        <h4 class="py-3">{{ activity_prop.title }}</h4>
      </b-container>
    </template>

    <template #default>
      <b-container fluid class="p-0 m-0">
        <b-row class="p-0 m-0">
          <b-col class="p-0 m-0 menu-column" cols="2">
            <b-list-group>
              <b-list-group-item
                button
                v-for="(item, index) in list_item_edit_activity"
                :key="index"
                @click="onEditMenuClick(item)"
                :class="{ active: item.isActive }"
              >
                <h6 class="my-0">{{ item.name }}</h6>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col cols="5" v-if="list_item_edit_activity[0].isActive">
            <h3 style="height: 34px; margin-bottom: 12px" class="p-0 mt-2">
              Componenti
            </h3>
            <div class="scrollable p-0 m-0 pad">
              <h5 class="my-2">Necessari</h5>
              <p>(obbligatorio uno e uno solo per attività)</p>
              <div class="d-flex flex-wrap mission-group-item">
                <b-button
                  v-for="(component, index) in components_special"
                  :key="index"
                  class="m-2 list-group-item"
                  @click="onComponentClick(component)"
                  :disabled="disableSpecial"
                  :class="checkSelected(component)"
                  style="height: 75px; width: 130px"
                >
                  {{ component.type }}
                </b-button>
              </div>
              <h5 class="my-2">Aggiuntivi</h5>
              <div class="d-flex flex-wrap mission-group-item">
                <b-button
                  v-for="(component, index) in components"
                  :key="index"
                  class="m-2 list-group-item"
                  @click="onComponentClick(component)"
                  :disabled="disableDefault"
                  :class="checkSelected(component)"
                  style="height: 75px; width: 130px"
                >
                  {{ component.type }}
                </b-button>
              </div>
              <h5 class="my-2">Minigiochi</h5>
              <p>(per attività mono-componente)</p>
              <div class="d-flex flex-wrap mission-group-item">
                <b-button
                  v-for="(component, index) in minigames"
                  :key="index"
                  class="m-2 list-group-item"
                  @click="onComponentClick(component)"
                  :disabled="disableMinigames"
                  :class="checkSelected(component)"
                  style="height: 75px; width: 130px"
                >
                  {{ component.type }}
                </b-button>
              </div>
            </div>
          </b-col>
          <b-col cols="5" v-if="list_item_edit_activity[0].isActive">
            <b-row class="m-0 p-0">
              <b-col cols="auto" class="p-0 mr-auto mt-2 mb-1">
                <h3 style="height: 34px">Struttura</h3>
              </b-col>
              <b-col cols="auto" class="my-2 px-0">
                <b-button @click="$bvModal.show('activity-preview')">
                  Anteprima
                </b-button>
              </b-col>
              <b-modal id="activity-preview" size="md" scrollable>
                <b-container fluid>
                  <b-row
                    v-for="(element, index) in activity.elements"
                    :key="index"
                  >
                    ANTEPRIMA DA FARE
                  </b-row>
                </b-container>
              </b-modal>
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
                  @click="openComponentModal(element)"
                >
                  <span class="mr-auto ml-1">
                    {{ element.type }}
                  </span>
                  <div>
                    <b-button
                      v-if="element.type"
                      class="align-self-start mx-1"
                      @click="editComponent(element)"
                    >
                      <b-icon-pencil></b-icon-pencil>
                    </b-button>
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
                      <b-container
                        class="my-3 d-flex flex-column justify-content-around"
                      >
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
                        <div
                          v-if="component_selected.type == 'Scelta Multipla'"
                        >
                          <h5>Domanda</h5>
                          <p>
                            Per superare l'attività sarà richiesto di
                            selezionare una delle 4 risposte
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
                            Sarà richiesto lo scatto di una foto come risposta
                            alla seguente domanda
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
                            Per superare questa attività non sarà richiesta
                            nessuna azione
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
                            L'utente dovrà ricollegare correttamente tutte le
                            frasi, proposte spezzate in ordine casuale
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
                          <p>
                            La seguente immagine sarà mostrata nella schermata
                          </p>
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
                              validateComponent()
                                ? { click: () => onSaveComponentModal() }
                                : { click: () => showAlertModal() }
                            "
                          >
                            Salva
                          </b-button>
                        </div>
                        <unvalid-alert
                          v-if="component_selected"
                          :unvalid_component="!validateComponent()"
                        ></unvalid-alert>
                      </b-container>
                    </b-overlay>
                  </template>
                </b-modal>
              </b-container>
            </b-row>
          </b-col>

          <b-col
            class="m-0 p-0 scrollable-full-body-height"
            v-if="list_item_edit_activity[1].isActive"
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

    <template #modal-footer="{ hide, ok }">
      <b-row d-flex justify-content-end>
        <b-button class="darker mx-1" @click="hide()"> Indietro </b-button>
        <b-button
          class="darker mx-1"
          v-on="
            validate()
              ? { click: () => ok() }
              : { click: () => showAlertModal() }
          "
        >
          Salva
        </b-button>
        <unvalid-alert
          v-if="!component_selected"
          :empty_title="activity.title == ''"
          :empty_time="activity.time == null"
          :empty_element="!validateStructure()"
          :missing_special="!disableSpecial"
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
      isSaved: false,
      component_selected: null,
      element_selected: null,
      is_element_removed: false,
      to_upload: [],
      overlay_edit_component: false,
    };
  },
  props: {
    activity_prop: {
      type: Object,
    },
  },
  computed: {
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
  },
  methods: {
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
    // Controlla se il componente è selezionato
    checkSelected(component) {
      if (this.component_selected) {
        if (this.component_selected.type == component.type)
          return "selected-component";
      }
    },
    // Verifica che tutti gli elementi non siano vuoti
    validateStructure() {
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (this.activity.elements[i].type == "") return false;
      }
      return true;
    },
    // Verifica tutti i requisiti prima del salvataggio
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
    // Verifica la completezza del modal di un componente
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
    },
    // Mostra un modal d'avviso se ci sono campi incompleti prima di un salvataggio
    showAlertModal() {
      this.$bvModal.show("non-valid");
    },
    // Cambia sezione nel menù laterale
    onEditMenuClick(item) {
      this.list_item_edit_activity.forEach(
        (element) => (element.isActive = false)
      );
      item.isActive = true;
    },
    // Imposta il componente selezionato quando ne viene cliccato uno
    onComponentClick(component) {
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
    // Aggiunge un elemento dall'attività
    addElement() {
      this.activity.elements.push({
        key: String(Date.now()),
        type: "",
      });
    },
    // Rimuove un elemento dall'attività
    removeElement(element) {
      this.is_element_removed = true;
      for (let i = 0; i < this.activity.elements.length; i++) {
        if (this.activity.elements[i] === element) {
          this.activity.elements.splice(i, 1);
          i--;
        }
      }
    },
    // Apre il modal di modifica di un componente quando ne è selezionato uno e si clicca un elemento
    openComponentModal(element) {
      if (this.component_selected && !this.is_element_removed) {
        this.element_selected = element;
        this.$bvModal.show("edit-component-modal");
      } else this.is_element_removed = false;
    },
    // Apre il modal di modifica di un componente quando si clicca sul suo bottone di modifica nell'elemento
    editComponent(element) {
      this.element_selected = element;
      this.component_selected = element;
      this.$bvModal.show("edit-component-modal");
    },
    // Il modal di modifica di un componenete viene nascosto
    onHideComponentModal() {
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
    // Il modal di modifica di un'attività viene nascosto
    onHide() {
      this.$bvModal.hide(this.modalId);
      this.component_selected = null;
      this.element_selected = null;
      if (!this.isSaved) {
        this.activity = JSON.parse(JSON.stringify(this.activity_prop));
      }
      this.isSaved = false;
    },
    // Il modal di modifica di un'attività viene salvato
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
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/activities");
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
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
  components: {
    unvalidAlert: httpVueLoader("comp/editor/unvalid_alert.vue"),
  },
  mounted() {
    this.activity = JSON.parse(JSON.stringify(this.activity_prop));
  },
};
</script>

<style>
</style>