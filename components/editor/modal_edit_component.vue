<template>
  <b-modal
    @hide="reset()"
    size="lg"
    id="modal-edit-component"
    hide-header
    hide-footer
  >
    <template #default>
      <b-container
        class="my-3 d-flex flex-column justify-content-around"
        style="width: 100%"
      >
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
            class="white-text"
            placeholder="Risposte..."
            v-model="component.answers"
          ></b-form-tags>
        </div>

        <!-- SCELTA MULTIPLA -->
        <div v-if="component.type == 'Scelta-Multipla'">
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
        <div v-if="component.type == 'Immagine'" style="width: 100%">
          <h5>Immagine</h5>
          <p>La seguente immagine sarà mostrata nella schermata</p>
          <div
            class="d-flex flex-column align-items-center"
            style="width: 100%"
          >
            <div
              class="image-container"
              @click="openImageSelector()"
              :style="'background-image: url(' + component.url + ')'"
            >
              <b-icon
                font-scale="4"
                v-show="!component.url"
                icon="plus"
              ></b-icon>
            </div>
            <label class="mt-4" for="image-description"
              >Descrizione dell'immagine (opzionale)</label
            >
            <b-form-textarea
              id="image-description"
              v-model="component.description"
              placeholder="Descrizione..."
              no-resize
              rows="3"
            ></b-form-textarea>
            <b-form-file
              v-model="photo_file_input"
              accept="image/*"
              id="image-photo-selector"
              style="display: none"
              ref="imageFileInput"
            ></b-form-file>
          </div>
        </div>

        <!-- VIDEO -->
        <div v-if="component.type == 'Video'">
          <h5>Video</h5>
          <p>Il seguente video sarà mostrato nella schermata</p>
          <div
            class="d-flex justify-content-center flex-column"
            style="width: 100%"
          >
            <b-button @click="openVideoSelector()"> Carica </b-button>
            <video
              v-if="component.url"
              :src="component.url"
              class="mt-2 background-preview"
              controls
            ></video>
            <b-form-file
              v-model="photo_file_input"
              accept="video/mp4,video/webm,video/ogg"
              id="video-selector"
              style="display: none"
              ref="videoFileInput"
            ></b-form-file>
          </div>
        </div>

        <!-- MEMORY -->
        <div v-if="component.type == 'Memory'" style="width: 100%">
          <h5>Memory</h5>
          <div class="my-2">Seleziona 6 foto per il memory</div>
          <div
            class="d-flex justify-content-center flex-wrap"
            style="width: 100%; margin-bottom: 1em"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              class="image-container"
              @click="openSelector(index)"
              :style="'background-image: url(' + image.url + ')'"
            >
              <b-icon font-scale="4" v-show="!image.url" icon="plus"></b-icon>
            </div>
            <b-form-file
              v-model="memory_file_input"
              accept="image/*"
              id="memory-photo-selector"
              style="display: none"
              ref="memoryFileInput"
            ></b-form-file>
          </div>
          <div class="my-2">
            Seleziona una foto per il background (opzionale)
          </div>
          <div
            class="d-flex justify-content-center flex-wrap"
            style="width: 100%; margin-bottom: 1em"
          >
            <div
              class="background-container"
              @click="openBackgroundSelector()"
              :style="'background-image: url(' + component.background.url + ')'"
            >
              <b-icon
                font-scale="4"
                v-show="!component.background.url"
                icon="plus"
              ></b-icon>
            </div>
            <b-form-file
              v-model="background_file_input"
              accept="image/*"
              id="background-photo-selector"
              style="display: none"
              ref="backgroundFileInput"
            ></b-form-file>
          </div>
        </div>

        <!-- BOTTONI -->
        <div class="d-flex justify-content-end mt-3">
          <b-button class="mx-1" @click="reset()"> Indietro </b-button>
          <b-button
            class="mx-1"
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
      current_loaded_index: 0,
      memory_file_input: null,
      photo_file_input: null,
      background_file_input: null,
    };
  },
  props: {
    component_prop: {
      type: Object,
    },
  },
  computed: {
    images: function () {
      return this.component.images;
    },
    valid_component: function () {
      let component = this.component;
      switch (component.type) {
        case "Domanda": {
          return component.question && component.answers.length;
        }
        case "Scelta-Multipla": {
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
          return component.url;
        }
        case "Video": {
          return component.url;
        }
        case "Memory": {
          for (let i = 0; i < component.images.length; i++) {
            if (!component.images[i].url) return false;
          }
          return true;
        }
        default: {
          return false;
        }
      }
    },
  },
  methods: {
    openImageSelector() {
      let el = document.getElementById("image-photo-selector");
      if (el) el.click();
    },
    openVideoSelector() {
      let el = document.getElementById("video-selector");
      if (el) el.click();
    },
    openSelector(index) {
      this.current_loaded_index = index;
      let el = document.getElementById("memory-photo-selector");
      if (el) el.click();
    },
    openBackgroundSelector() {
      let el = document.getElementById("background-photo-selector");
      if (el) el.click();
    },
    reset() {
      this.$bvModal.hide("modal-edit-component");
      this.component = JSON.parse(JSON.stringify(this.component_prop));
      this.current_loaded_index = 0;
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
    memory_file_input(file) {
      if (file) {
        let formData = new FormData();
        formData.append("photo", file);

        fetch("/api/uploadPhoto", {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              this.component.images[this.current_loaded_index].url = data.path;
            });
          }
        });

        this.$refs.memoryFileInput.reset();
      }
    },
    photo_file_input(file) {
      if (file) {
        let formData = new FormData();
        formData.append("photo", file);

        fetch("/api/uploadPhoto", {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              this.component.url = data.path;
            });
          }
        });
        if (this.$refs.imageFileInput) this.$refs.imageFileInput.reset();
        else this.$refs.videoFileInput.reset();
      }
    },
    background_file_input(file) {
      if (file) {
        let formData = new FormData();
        formData.append("photo", file);

        fetch("/api/uploadPhoto", {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              this.component.background.url = data.path;
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
