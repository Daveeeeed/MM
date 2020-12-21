<template>
  <div>
    <b-modal
      size="lg"
      id="modal-add-new-element"
      title="Aggiungi nuovo elemento"
      @hide="reset()"
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
          <b-button class="darker mx-1" @click="reset()"> Cancella </b-button>
          <b-button
            class="darker mx-1"
            v-on="
              valid ? { click: () => save() } : { click: () => notifyErrors() }
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
  computed: {
    valid: function () {
      return (
        this.valid_title &&
        (this.category == "Storie" ? this.valid_options : true)
      );
    },
    valid_title: function () {
      return this.title != "";
    },
    valid_options: function () {
      return (
        (this.sette || this.undici || this.quindici) &&
        (this.singolo || this.gruppo || this.classe)
      );
    },
    new_element: function () {
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
          };
        case "Attività":
          return {
            key: String(Date.now()),
            title: this.title,
            elements: [],
            time: null,
          };
        default:
          return {};
      }
    },
  },
  methods: {
    save() {
      this.$emit("add-element", this.new_element);
      this.reset();
    },
    reset() {
      this.$bvModal.hide("modal-add-new-element");
      this.title = "";
      this.sette = false;
      this.undici = false;
      this.quindici = false;
      this.singolo = false;
      this.gruppo = false;
      this.classe = false;
    },
    notifyErrors() {
      this.$emit("found-errors", this.calculateErrors());
    },
    calculateErrors() {
      let a = [];
      if (!this.valid_title) a.push("Il titolo non può essere vuoto");
      if (this.category == "Storie" && !this.valid_options)
        a.push("Specifica una categoria per Età e Giocatore");
      return a;
    },
  },
};
</script>

<style>
</style>