<template>
  <div id="player">
    <div v-if="player" class="d-flex flex-column">
      <div id="toolbar" class="px-3">
        <strong id="score" style="color: white"
          >Punteggio: {{ player.total_points }} / {{player.total_activities}}</strong
        >
        <b-button text="chat" class="chat-btn" v-b-toggle.sidebar-chat
          ><b-icon-chat-fill></b-icon-chat-fill
        ></b-button>
      </div>
      <div
        id="activity"
        :style="'background-image: url(' + this.story.settings.background + ')'"
      >
        <b-overlay
          class="activity-container my-5"
          :show="verifying_answer"
          variant="dark"
          v-if="current_activity"
        >
          <div id="activity-wrapper" class="p-5">
            <div id="activity-content">
              <h1>{{current_activity.title}}</h1>
              <component
                v-for="(element, index) in current_activity.elements"
                :key="index"
                :is="element.component.type"
                :element="element"
                :answer_confirmed="check_answer"
                :answer_verified="answer_verified"
                @answer-checked="check_answer = false"
                @verify-answer="verifyAnswer"
                @answer-sent="handleAnswer"
              >
              </component>
            </div>
          </div>
          <b-button id="next-button" @click="confirmAnswer()"
            ><strong>Invia</strong></b-button
          >
          <template #overlay>
            <div class="text-center">
              <b-spinner label="Spinning"></b-spinner>
              <div>Attendi la verifica della risposta...</div>
            </div></template
          >
        </b-overlay>
        <div
          v-else-if="current_mission.key == '-1'"
          class="activity-container my-5"
        >
          <div id="activity-wrapper" class="p-5">
            <div id="activity-content">
              <div class="mb-2">
                Hai completato la storia con {{ player.total_points }} /
                {{ player.total_activities }} punti
              </div>
              <div class="mb-2">
                Percentuale di completamento pari a
                {{ (player.total_points / player.total_activities) * 100 }}%
              </div>
              <a href="/" class="my-2">
                <img
                  src="https://site181982.tw.cs.unibo.it/public/images/logo2.png"
                  alt="Logo"
                  height="200"
                />
              </a>
              <div class="mt-2">Torna alla home</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="story-loading" class="full-centered">
      <b-spinner label="loading"></b-spinner>
      <strong class="mt-2">Caricamento della storia in corso</strong>
    </div>

    <!-- Chat -->
    <b-sidebar id="sidebar-chat" title="Chat" right shadow backdrop>
      <template #default>
        <div
          id="message-box"
          class="d-flex flex-column"
          style="height: 50%; overflow-y: auto"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.sender ? 'player-message' : 'tutor-message'"
            class="m-2 p-2 message"
          >
            {{ message.text }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex m-2">
          <b-button class="mr-2" @click="sendMessage()">Invia</b-button>
          <b-form-input v-model="message_input"></b-form-input>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      wsc: null,
      player_id: null,
      story_key: null,
      game_key: null,
      player: null,
      message_input: "",
      messages: [],
      story: null,
      current_activity: null,
      current_path: null,
      current_mission: null,
      check_answer: false,
      // overlay trigger
      verifying_answer: false,
      // received answer from tutor
      answer_verified: false,
    };
  },
  methods: {
    // Initialization
    initPlayer() {
      // fetch story
      fetch("/api/stories?key=" + this.story_key)
        .then((response) => response.json())
        .then((data) => {
          if (data.length == 1) {
            this.story = data[0];
            // fetch player
            fetch(
              "/api/player?game_key=" +
                this.game_key +
                "&player_id=" +
                this.player_id
            )
              .then((response) => response.json())
              .then((player_data) => {
                // check if gsmr is new or already started
                this.player = player_data;
                setInterval(this.updateStatus, 2000);
                let new_game = !this.player.status.path;
                this.current_path = new_game
                  ? this.story.paths[
                      Math.round(Math.random() * (this.story.paths.length - 1))
                    ]
                  : this.findObject(
                      this.story.paths,
                      this.player.status.path.key
                    );

                let mission_key = new_game
                  ? this.current_path.first_mission
                  : this.player.status.mission.key;

                this.current_mission = this.findObject(
                  this.current_path.missions,
                  mission_key
                );

                let activity_key = new_game
                  ? this.current_mission.first_activity
                  : this.player.status.activity.key;

                this.current_activity = this.findObject(
                  this.current_mission.activities,
                  activity_key
                );
                if (new_game) {
                  this.player.status.path = {
                    title: this.current_path.title,
                    key: this.current_path.key,
                  };
                  this.player.status.activity = {
                    title: this.current_activity.title,
                    key: this.current_activity.key,
                    max_time: this.current_activity.time * 60,
                  };
                  this.player.status.mission = {
                    title: this.current_mission.title,
                    key: this.current_mission.key,
                  };
                }
                this.updateStatus();
              });
          }
        });
    },
    initWebSocket() {
      let that = this;
      this.wsc = new WebSocketClient();
      this.wsc.open("wss://site181982.tw.cs.unibo.it");

      this.wsc.onmessage = function (data) {
        let message = JSON.parse(data.data);
        if (
          message.player_id == that.player_id &&
          message.story_key == that.story_key &&
          message.game_key == that.game_key &&
          message.sender == true
        ) {
          switch (message.type) {
            case "msg":
              that.messages.push({
                text: message.message,
                sender: false,
              });
              break;
            case "photo":
              that.handleAnswer(message.answer);
              break;
            default:
              break;
          }
        }
      };
    },
    // Send player data to server
    updateStatus() {
      this.player.status.time_stuck += 2;
      this.player.time += 2;
      fetch(
        "/api/player/update?game_key=" +
          this.game_key +
          "&player_id=" +
          this.player_id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(this.player),
        }
      )
        .then((response) => response.json())
        .then((data) => (this.player = data));
    },
    sendMessage() {
      if (this.message_input) {
        this.wsc.send(
          JSON.stringify({
            type: "msg",
            message: this.message_input,
            player_id: this.player_id,
            game_key: this.game_key,
            story_key: this.story_key,
            sender: false,
          })
        );
        this.messages.push({
          text: this.message_input,
          sender: true,
        });
        this.message_input = "";
        this.updateStatus();
      }
    },
    // Utilities
    findObject(array, key) {
      if (array && key) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].key == key) return array[i];
        }
        return -1;
      } else return null;
    },
    handleAnswer(answer) {
      this.verifying_answer = false;
      if (answer) this.player.status.time_stuck = 0;

      let result = answer
        ? this.current_activity.correct
        : this.current_activity.wrong;

      let activity_points = result.points;
      this.player.total_points += parseInt(activity_points);
      this.player.mission_points += parseInt(activity_points);
      this.player.mission_activities++;
      this.player.total_activities++;

      if (result.key != "-1") {
        // Missione non finita
        this.current_activity = this.findObject(
          this.current_mission.activities,
          result.key
        );
        this.player.status.activity = {
          title: this.current_activity.title,
          key: this.current_activity.key,
          max_time: this.current_activity.time * 60,
        };
      } else {
        // Missione finita
        let next_mission_key = this.findNextMissionKey(
          this.current_mission,
          this.player.mission_points
        );
        this.player.mission_activities = 1;
        this.player.mission_points = 0;
        if (next_mission_key != "-1") {
          // Storia non finita
          this.current_mission = this.findObject(
            this.current_path.missions,
            next_mission_key
          );
          this.current_activity = this.findObject(
            this.current_mission.activities,
            this.current_mission.first_activity
          );
          this.player.status.mission = {
            title: this.current_mission.title,
            key: this.current_mission.key,
          };
          this.player.status.activity = {
            title: this.current_activity.title,
            key: this.current_activity.key,
            max_time: this.current_activity.time * 60,
          };
        } else {
          // Storia finita
          this.player.status.mission = {
            title: "Partita finita",
            key: "-1",
          };
          this.player.status.activity = {
            title: "Partita finita",
            key: "-1",
            max_time: 10000000000,
          };
          this.current_mission = this.findObject(
            this.current_path.missions,
            next_mission_key
          );
          this.current_activity = null;
        }
      }
    },
    findNextMissionKey(mission, mission_points) {
      let percentage = (mission_points / this.player.mission_activities) * 100;
      for (let i = 0; i < mission.results.length; i++) {
        if (
          percentage >= mission.results[i].range_min &&
          percentage <= mission.results[i].range_max
        ) {
          return mission.results[i].key;
        }
      }
      console.log("ERROR ON NEXT MISSION KEY");
    },
    verifyAnswer(answer, question) {
      this.verifying_answer = true;
      this.wsc.send(
        JSON.stringify({
          type: "photo",
          answer: answer,
          question: question,
          player_id: this.player_id,
          game_key: this.game_key,
          story_key: this.story_key,
          sender: false,
        })
      );
    },
    confirmAnswer() {
      this.check_answer = true;
    },
  },
  components: {
    Collega: httpVueLoader("comp/player/collega.vue"),
    Descrizione: httpVueLoader("comp/player/descrizione.vue"),
    Domanda: httpVueLoader("comp/player/domanda.vue"),
    Foto: httpVueLoader("comp/player/foto.vue"),
    Immagine: httpVueLoader("comp/player/immagine.vue"),
    Memory: httpVueLoader("comp/player/memory.vue"),
    "Scelta-Multipla": httpVueLoader("comp/player/scelta_multipla.vue"),
    Testo: httpVueLoader("comp/player/testo.vue"),
    Video: httpVueLoader("comp/player/video.vue"),
  },
  created: function () {
    let urlParams = new URLSearchParams(window.location.search);
    this.game_key = urlParams.get("game_key");
    this.story_key = urlParams.get("story_key");
    this.player_id = urlParams.get("player_id");
    this.initPlayer();
    this.initWebSocket();
    let that;
    window.onbeforeunload = function () {
      that.updateStatus();
    };
  },
};

// Implementazione presa da https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect

function WebSocketClient() {
  this.autoReconnectInterval = 1000; // ms
}
WebSocketClient.prototype.open = function (url) {
  this.url = url;
  this.instance = new WebSocket(this.url);
  this.instance.onopen = () => {
    this.onopen();
  };
  this.instance.onmessage = (data, flags) => {
    this.number++;
    this.onmessage(data, flags, this.number);
  };
  this.instance.onclose = (e) => {
    if (e.code == 1000) {
      console.log("WebSocket: closed");
    } else {
      this.reconnect(e);
    }
    this.onclose(e);
  };
  this.instance.onerror = (e) => {
    if (e.code == "ECONNREFUSED") {
      this.reconnect(e);
    } else {
      this.onerror(e);
    }
  };
};
WebSocketClient.prototype.send = function (data, option) {
  try {
    this.instance.send(data, option);
  } catch (e) {
    this.instance.emit("error", e);
  }
};
WebSocketClient.prototype.reconnect = function (e) {
  console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
  var that = this;
  setTimeout(function () {
    console.log("WebSocketClient: reconnecting...");
    that.open(that.url);
  }, this.autoReconnectInterval);
};
WebSocketClient.prototype.onopen = function (e) {
  console.log("WebSocketClient: open", arguments);
};
WebSocketClient.prototype.onmessage = function (data, flags, number) {
  console.log("WebSocketClient: message", arguments);
};
WebSocketClient.prototype.onerror = function (e) {
  console.log("WebSocketClient: error", arguments);
};
WebSocketClient.prototype.onclose = function (e) {
  console.log("WebSocketClient: closed", arguments);
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

html {
  height: 100%;
  width: 100%;
}

body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

#player {
  font-family: "Lato", sans-serif;
  background-color: var(--primary-color);
  color: var(--text-color);
  height: 100%;
  width: 100%;
}

.full-centered {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#toolbar {
  height: 60px;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
}

.chat-btn {
  background: var(--form-color);
  color: var(--text-color);
  border: none;
}

.chat-btn:focus {
  background: var(--form-color);
}

.chat-btn:hover {
  background: var(--hover-color);
}

#activity {
  position: fixed;
  justify-content: center;
  bottom: 0px;
  left: 0px;
  right: 0px;
  top: 60px;
  display: flex;
  overflow-y: auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.activity-container {
  background-color: var(--secondary-color);
  border-radius: 10px;
  height: 80%;
  min-height: 300px;
  max-width: 600px;
  width: 90vw;
  opacity: 0.95;
}

#activity-wrapper {
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

#activity-content {
  height: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
}

#next-button {
  height: 60px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: var(--form-color);
  border: none;
  color: var(--text-color);
  cursor: pointer;
}

.btn {
  background-color: var(--form-color);
  border: none;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 10px;
}

.btn:hover {
  background-color: var(--hover-color);
  border: none;
}

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

.close {
  color: var(--text-color) !important;
}

.player-message {
  background-color: var(--secondary-color);
  text-align: end;
  margin-left: 60px !important;
}

.tutor-message {
  background-color: var(--form-color);
  text-align: left;
  margin-right: 60px !important;
}

.message {
  border-radius: 5px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  box-shadow: 3px 3px 8px black;
}

.b-sidebar-footer {
  position: fixed;
  bottom: 0px;
  right: 0px;
  width: 100%;
}

.b-sidebar {
  height: 100% !important;
  background-color: var(--primary-color) !important;
  color: var(--text-color) !important;
}

.activity-image {
  height: auto;
  max-width: 90%;
  border-style: solid;
  border-width: 2px;
  border-color: var(--text-color);
  margin-bottom: 20px;
}

.activity-webcam {
  height: auto;
  max-width: 90%;
  border-style: solid;
  border-width: 5px;
  border-color: var(--form-color);
}

.activity-text {
  margin-bottom: 20px;
  width: 100%;
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
</style>
