<template>
  <div id="player">
    <div v-if="player" class="d-flex flex-column">
      <div id="toolbar" class="px-3">
        <strong id="score" style="color: white">Punteggio: {{ points }}</strong>
        <b-button v-b-toggle.sidebar-chat
          ><b-icon-chat-fill></b-icon-chat-fill
        ></b-button>
      </div>
      <div id="activity">
        <div id="activity-container" class="mt-5">
          <div id="activity-wrapper" class="p-5">
            <div id="activity-content">
              <component
                v-for="(element, index) in current_activity.elements"
                :key="index"
                :is="element.component.type"
                :element="element"
                :answer_confirmed="check_answer"
                @answer-checked="check_answer = false"
                @answer-sent="handleAnswer"
              >
              </component>
            </div>
          </div>
          <b-button id="next-button" @click="confirmAnswer()"
            ><strong>Invia</strong></b-button
          >
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
          style="height: 100%; overflow-y: auto"
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
      check_answer: null,
      points: 0,
    };
  },
  methods: {
    // Initialization
    initPlayer() {
      fetch("/api/stories?key=" + this.story_key)
        .then((response) => response.json())
        .then((data) => {
          if (data.length == 1) {
            this.story = data[0];
            this.current_path = this.story.paths[
              Math.round(Math.random() * (this.story.paths.length - 1))
            ];
            this.current_mission = this.findObject(
              this.current_path.missions,
              this.current_path.first_mission
            );
            this.current_activity = this.findObject(
              this.current_mission.activities,
              this.current_mission.first_activity
            );
            fetch(
              "/api/player?game_key=" +
                this.game_key +
                "&player_id=" +
                this.player_id
            )
              .then((response) => response.json())
              .then((data) => {
                this.player = data;
                setInterval(this.updateStatus, 2000);
              });
          }
        });
    },
    initWebSocket() {
      let that = this;
      this.wsc = new WebSocketClient();

      this.wsc.open("ws://localhost:8080");

      this.wsc.onmessage = function (data) {
        let message = JSON.parse(data.data);
        if (
          message.player_id == that.player_id &&
          message.story_key == that.story_key &&
          message.game_key == that.game_key &&
          message.sender == true
        ) {
          that.messages.push({
            text: message.message,
            sender: false,
          });
        }
      };
    },
    // Send player data to server
    updateStatus() {
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
      for (let i = 0; i < array.length; i++) {
        if ((array[i].key = key)) return array[i];
      }
    },
    handleAnswer(answer) {
      console.log(this.current_activity);

      let result = answer
        ? this.current_activity.correct
        : this.current_activity.wrong;
      let activity_points = result.points;
      let next_activity = this.findObject(
        this.current_mission.activities,
        result.key
      );
      //this.current_activity = next_activity;
      // TODO: handle last activity of the mission, mission switch, last mission of the path
      this.points += parseInt(activity_points);
    },
    confirmAnswer() {
      console.log(this.current_activity);
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
    Scelta_Multipla: httpVueLoader("comp/player/scelta_multipla.vue"),
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
    switch (e.code) {
      case 1000: // CLOSE_NORMAL
        console.log("WebSocket: closed");
        break;
      default:
        // Abnormal closure
        this.reconnect(e);
        break;
    }
    this.onclose(e);
  };
  this.instance.onerror = (e) => {
    switch (e.code) {
      case "ECONNREFUSED":
        this.reconnect(e);
        break;
      default:
        this.onerror(e);
        break;
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

#player {
  font-family: "Lato", sans-serif;
  background-color: #ffffff;
  color: #001427;
}

.full-centered {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#toolbar {
  height: 60px;
  background-color: #001427;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#activity {
  display: flex;
  justify-content: center;
  height: calc(100vh - 60px);
}

#activity-container {
  background-color: #6666ff;
  border-radius: 10px;
  height: 80%;
  min-height: 300px;
  max-width: 600px;
  width: 90vw;
}

#activity-wrapper {
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

#activity-content {
  height: auto;
}

#next-button {
  height: 60px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #8e44ad;
  border: none;
  color: white;
  cursor: pointer;
}

.player-message {
  background-color: #d7d7d7;
  text-align: end;
  margin-left: 40px !important;
}

.tutor-message {
  background-color: #ffffff;
  text-align: left;
  margin-right: 40px !important;
}

.message {
  border: 1px solid #001427;
  border-radius: 5px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>