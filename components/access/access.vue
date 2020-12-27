<template>
  <div id="app">
    <b-container
      fluid
      class="d-flex flex-column align-items-center justify-content-center"
    >
      <a class="mb-4 mt-3" href="/">
        <img src="../public/images/logo2.png" alt="Logo" height="150"
      /></a>
      <b-button
        class="m-3 darker"
        style="height: 25vh; width: 90vw"
        @click="openPlayerModal"
      >
        <h1>GIOCA</h1>
      </b-button>
      <b-modal id="player-modal" centered ok-only>
        <template #default>
          <b-container
            fluid
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <h5>Inserisci il codice d'accesso fornito dal tutor</h5>
            <b-form-input
              class="m-1"
              required
              v-model="player_game_key"
              placeholder="Inserisci il codice"
              :state="correctInput"
            ></b-form-input>
            <b-form-invalid-feedback id="input-live-feedback">
              Controlla il codice e riprova.
            </b-form-invalid-feedback>
          </b-container>
        </template>
        <template #modal-footer>
          <b-row d-flex justify-content-end>
            <b-button @click="confirmPlayer"> Ok </b-button>
          </b-row>
        </template>
      </b-modal>
      <b-button
        class="m-3 darker"
        style="height: 25vh; width: 90vw"
        @click="openTutorModal"
      >
        <h1>SNITCHA</h1>
      </b-button>
      <b-modal id="tutor-modal" centered ok-only @ok="confirmTutor">
        <b-container
          fluid
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <h5>Fornisci il seguente codice agli utenti</h5>
          <h1>{{ tutor_game_key }}</h1>
        </b-container>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      story_key: null,
      tutor_game_key: null,
      player_game_key: null,
      correct_input: true,
    };
  },
  computed: {
    correctInput() {
      if (!this.correct_input) {
        if (this.player_game_key) {
          this.correct_input = true;
        } else return false;
      } else return null;
    },
  },
  methods: {
    openPlayerModal() {
      this.$bvModal.show("player-modal");
    },
    openTutorModal() {
      this.tutor_game_key = String(Math.round(Math.random() * 9999));
      this.$bvModal.show("tutor-modal");
    },
    confirmTutor() {
      fetch(
        "/api/tutor?game_key=" +
          this.tutor_game_key +
          "&story_key=" +
          this.story_key,
        {
          method: "POST",
        }
      ).then(
        (response) =>
          (window.location =
            "/tutor?game_key=" +
            this.tutor_game_key +
            "&story_key=" +
            this.story_key)
      );
    },
    confirmPlayer() {
      let player_id = String(Date.now());
      fetch(
        "api/player?game_key=" +
          this.player_game_key +
          "&story_key=" +
          this.story_key +
          "&player_id=" +
          player_id,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            window.location =
              "/player?game_key=" +
              this.player_game_key +
              "&story_key=" +
              this.story_key +
              "&player_id=" +
              player_id;
          } else {
            this.player_game_key = "";
            this.correct_input = false;
          }
        });
    },
  },
  mounted() {
    let urlParams = new URLSearchParams(window.location.search);
    this.story_key = urlParams.get("key");
  },
};
</script>

<style>
body {
  background-color: #090a11;
  color: #ffffff;
  margin: 0px;
}

.modal-header {
  background-color: #1c1e2b;
  border: 0px;
}

.modal-footer {
  background-color: #1c1e2b;
  border: 0px;
}

.modal-content {
  background-color: #1c1e2b;
  color: #ffffff;
}

.modal-body {
  height: 20vh;
}

.btn {
  background-color: #171926;
  color: #ffffff;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 2px 0 #00bd58;
  overflow-y: auto;
  outline: 0;
}

.form-control {
  background-color: #1a1c2c;
  color: #ffffff;
  border-radius: 10px;
}

.form-control:focus {
  background-color: #1a1c2c;
  color: #ffffff;
  box-shadow: none;
}
</style>
