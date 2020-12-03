<template>
  <b-modal
    @hide="reset()"
    size="lg"
    id="modal-edit-component"
    hide-header
    hide-footer
  >
    <template #default>
      <b-container class="my-3 d-flex flex-column justify-content-around">
        <!-- DOMANDA -->
        <div v-if="component.type == 'Domanda'">
          <h5>Domanda</h5>
          <b-form-input
            class="mb-2"
            type="text"
            v-model="component.question"
            placeholder="Inserisci la domanda..."
          ></b-form-input>
          <h5>Risposte</h5>
          <b-form-tags
            placeholder="Risposte..."
            v-model="component.answers"
          ></b-form-tags>
        </div>

        <!-- SCELTA MULTIPLA -->
        <div v-if="component.type == 'Scelta Multipla'">
          <h5>Domanda</h5>
          <p>
            Per superare l'attività sarà richiesto di selezionare una delle 4
            risposte
          </p>
          <b-form-input
            class="mb-2"
            type="text"
            v-model="component.question"
            placeholder="Inserisci la domanda..."
          ></b-form-input>
          <h5>Risposte</h5>
          <b-form-radio
            class="my-1"
            v-model="component.correct_answer"
            name="answers"
            value="0"
          >
            <b-form-input
              type="text"
              v-model="component.answers[0]"
              placeholder="Risposta..."
            ></b-form-input>
          </b-form-radio>
          <b-form-radio
            class="my-1"
            v-model="component.correct_answer"
            name="answers"
            value="1"
          >
            <b-form-input
              type="text"
              v-model="component.answers[1]"
              placeholder="Risposta..."
            ></b-form-input>
          </b-form-radio>
          <b-form-radio
            class="my-1"
            v-model="component.correct_answer"
            name="answers"
            value="2"
          >
            <b-form-input
              type="text"
              v-model="component.answers[2]"
              placeholder="Risposta..."
            ></b-form-input>
          </b-form-radio>
          <b-form-radio
            class="my-1"
            v-model="component.correct_answer"
            name="answers"
            value="3"
          >
            <b-form-input
              type="text"
              v-model="component.answers[3]"
              placeholder="Risposta..."
            ></b-form-input>
          </b-form-radio>
        </div>

        <!-- FOTO -->
        <div v-if="component.type == 'Foto'">
          <h5>Domanda</h5>
          <p>
            Sarà richiesto lo scatto di una foto come risposta alla seguente
            domanda
          </p>
          <b-form-input
            class="mb-2"
            type="text"
            v-model="component.question"
            placeholder="Inserisci la domanda..."
          ></b-form-input>
        </div>

        <!-- TESTO -->
        <div v-if="component.type == 'Testo'">
          <h5>Descrizione</h5>
          <p>Per superare questa attività non sarà richiesta nessuna azione</p>
          <b-form-textarea
            class="my-2"
            v-model="component.text"
            placeholder="Inserisci il testo..."
            no-resize
            rows="5"
          ></b-form-textarea>
        </div>

        <!-- COLLEGA -->
        <div v-if="component.type == 'Collega'">
          <h5>Risposte</h5>
          <p>
            L'utente dovrà ricollegare correttamente tutte le frasi, proposte
            spezzate in ordine casuale
          </p>
          <div class="d-flex flex-row justify-content-around">
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[0].first"
              placeholder="Prima parte..."
            ></b-form-input>
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[0].second"
              placeholder="Seconda parte..."
            ></b-form-input>
          </div>
          <div class="d-flex flex-row justify-content-around">
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[1].first"
              placeholder="Prima parte..."
            ></b-form-input>
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[1].second"
              placeholder="Seconda parte..."
            ></b-form-input>
          </div>
          <div class="d-flex flex-row justify-content-around">
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[2].first"
              placeholder="Prima parte..."
            ></b-form-input>
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[2].second"
              placeholder="Seconda parte..."
            ></b-form-input>
          </div>
          <div class="d-flex flex-row justify-content-around">
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[3].first"
              placeholder="Prima parte..."
            ></b-form-input>
            <b-form-input
              class="m-1"
              type="text"
              v-model="component.answers[3].second"
              placeholder="Seconda parte..."
            ></b-form-input>
          </div>
        </div>

        <!-- DESCRIZIONE -->
        <div v-if="component.type == 'Descrizione'">
          <h5>Descrizione</h5>
          <b-form-textarea
            class="my-2"
            v-model="component.description"
            placeholder="Inserisci il testo..."
            no-resize
            rows="5"
          ></b-form-textarea>
        </div>

        <!-- IMMAGINE -->
        <div v-if="component.type == 'Immagine'">
          <h5>Immagine</h5>
          <p>La seguente immagine sarà mostrata nella schermata</p>
          <b-form-file
            accept="image/*"
            placeholder="Seleziona foto..."
            v-model="component.name"
            @input="uploadFile"
          ></b-form-file>
        </div>

        <!-- VIDEO -->
        <div v-if="component.type == 'Video'">
          <h5>Video</h5>
          <p>Il seguente video sarà mostrato nella schermata</p>
          <p>E' richiesto l'URL embedded</p>
          <b-form-input
            class="mb-2"
            type="text"
            v-model="component.text"
            placeholder="Inserisci il link qui..."
          ></b-form-input>
        </div>

        <!-- BOTTONI -->
        <div class="d-flex justify-content-end mt-3">
          <b-button class="darker mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="darker mx-1"
            v-on="
              valid_component
                ? { click: () => save() }
                : { click: () => notifyErrors() }
            "
          >
            Salva
          </b-button>
        </div>
      </b-container>
    </template>
  </b-modal>
</template>

<script>
module.exports = {
  data() {
    return {
      component: null,
    };
  },
  props: {
    component_prop: {
      type: Object,
    },
  },
  computed: {
    valid_component: function () {
      let component = this.component;
      switch (component.type) {
        case "Domanda": {
          return component.question && component.answers.length;
        }
        case "Scelta Multipla": {
          if (component.question && component.correct_answer) {
            for (let i = 0; i < component.answers.length; i++) {
              if (!component.answers[i]) return false;
            }
            return true;
          } else return false;
        }
        case "Foto": {
          return component.question;
        }
        case "Testo": {
          return component.text;
        }
        case "Collega": {
          for (let i = 0; i < component.answers.length; i++) {
            if (!component.answers[i].first || !component.answers[i].second)
              return false;
          }
          return true;
        }
        case "Descrizione": {
          return component.description;
        }
        case "Immagine": {
          return true;
        }
        case "Video": {
          return true;
        }
        case "Memory": {
          return true;
        }
        default: {
          return false;
        }
      }
    },
  },
  methods: {
    reset() {
      this.$bvModal.hide("modal-edit-component");
      this.component = JSON.parse(JSON.stringify(this.component_prop));
    },
    save() {
      this.$emit("component-edited", this.component);
      this.reset();
    },
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (!this.valid_component)
        a.push("Controlla di aver riempito correttamente tutti i campi");
      return a;
    },
  },
  watch: {
    component_prop(new_value) {
      this.component = JSON.parse(JSON.stringify(new_value));
    },
  },
};
</script>

<style>
</style>