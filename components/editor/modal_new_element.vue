<template>
  <b-modal
    size="lg"
    id="modal-add-new-element"
    title="Aggiungi nuovo elemento"
    @hide="onCancel()"
  >
    <template #default>
      <b-container class="d-flex flex-column py-3 px-4" fluid>
        <h5>Titolo</h5>
        <b-form-input
          class="mb-3"
          type="text"
          v-model="title"
          maxlength="25"
          required
          placeholder="Inserisci il titolo..."
        ></b-form-input>
        <div
          class="d-flex flex-row justify-content-around my-2"
          v-if="category == 'Storie'"
        >
          <div class="d-flex flex-column align-items-center">
            <h5>Giocatore</h5>
            <div class="d-flex justify-content-center">
              <b-form-checkbox class="m-2" v-model="singolo"
                >Singolo</b-form-checkbox
              >
              <b-form-checkbox class="m-2" v-model="gruppo"
                >Gruppo</b-form-checkbox
              >
              <b-form-checkbox class="m-2" v-model="classe"
                >Classe</b-form-checkbox
              >
            </div>
          </div>
          <div class="d-flex flex-column align-items-center">
            <h5>Età</h5>
            <div class="d-flex justify-content-center">
              <b-form-checkbox class="m-2" v-model="sette"
                >7-10</b-form-checkbox
              >
              <b-form-checkbox class="m-2" v-model="undici"
                >11-14</b-form-checkbox
              >
              <b-form-checkbox class="m-2" v-model="quindici"
                >15-18</b-form-checkbox
              >
            </div>
          </div>
        </div>
      </b-container>
    </template>
    <template #modal-footer>
      <b-row d-flex justify-content-end>
        <b-button class="darker mx-1" @click="onCancel()"> Cancella </b-button>
        <b-button
          class="darker mx-1"
          v-on="
            validateCreateStory()
              ? { click: () => onSave() }
              : { click: () => showAlertModal() }
          "
        >
          Salva
        </b-button>
        <unvalid-alert
          :empty_title="title == ''"
          :invalid_story_type="
            category == 'Storie' ? !validateCreateStoryType() : false
          "
        >
        </unvalid-alert>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
module.exports = {
  data: function () {
    return {
      title: "",
      sette: false,
      undici: false,
      quindici: false,
      singolo: false,
      gruppo: false,
      classe: false,
    };
  },
  props: {
    category: {
      type: String,
    },
  },
  methods: {
    collectionName() {
      switch (this.category) {
        case "Storie":
          return "stories";
        case "Missioni":
          return "missions";
        case "Attività":
          return "activities";
      }
    },
    newElement() {
      switch (this.category) {
        case "Storie":
          return {
            key: String(Date.now()),
            title: this.title,
            paths: [],
            settings: {
              published: false,
              archived: false,
              player: {
                sette: this.sette,
                undici: this.undici,
                quindici: this.quindici,
                single: this.singolo,
                group: this.gruppo,
                class: this.classe,
              },
            },
          };
        case "Missioni":
          return {
            key: String(Date.now()),
            title: this.title,
            activities: [],
            first_activity: null,
            results: [
              {
                key: null,
                range_min: 0,
                range_max: null,
              },
            ],
          };
        case "Attività":
          return {
            key: String(Date.now()),
            title: this.title,
            elements: [],
            correct: {
              key: null,
              points: "100",
            },
            wrong: {
              key: null,
              points: "50",
            },
            time: null,
          };
      }
    },
    onSave() {
      fetch("/api/" + this.collectionName() + "/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.newElement()),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return fetch("/api/" + this.collectionName());
        })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          else return response.json();
        })
        .then((data) => {
          switch (this.category) {
            case "Storie": {
              this.$root.stories = data;
              break;
            }
            case "Missioni": {
              this.$root.missions = data;
              break;
            }
            case "Attività": {
              this.$root.activities = data;
              break;
            }
          }
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation",
            error
          );
          switch (this.category) {
            case "Storie": {
              this.$root.stories = null;
              break;
            }
            case "Missioni": {
              this.$root.missions = null;
              break;
            }
            case "Attività": {
              this.$root.activities = null;
              break;
            }
          }
        });
      this.onCancel();
    },
    onCancel() {
      this.$bvModal.hide("modal-add-new-element");
      this.title = "";
      this.sette = false;
      this.undici = false;
      this.quindici = false;
      this.singolo = false;
      this.gruppo = false;
      this.classe = false;
    },
    validateCreateStory() {
      if (this.category == "Storie")
        return this.title != "" && this.validateCreateStoryType();
      else return this.title != "";
    },
    validateCreateStoryType() {
      return (
        (this.sette || this.undici || this.quindici) &&
        (this.singolo || this.gruppo || this.classe)
      );
    },
    showAlertModal() {
      this.$bvModal.show("non-valid");
    },
  },
};
</script>

<style>
</style>