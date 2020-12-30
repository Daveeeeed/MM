<template>
  <div id="app">
    <div style="height: 100vh; width: 100vw" class="d-flex flex-column">
      <div class="topbar d-flex align-items-center justify-content-center">
        <div style="font-size: 5vh">
          <h4>{{ selected_section.title }}</h4>
        </div>
      </div>
      <div class="d-flex" style="height: 80%">
        <div class="scrollable mx-5">
          <b-list-group v-if="selected_section == sections[0]">
            <b-list-group-item
              v-for="(player, index) in game.players"
              :key="index"
              class="px-2 player-row"
            >
              <div class="d-flex align-items-center">
                <div class="ml-3" style="width: 44%">
                  {{ player.name }}
                </div>
                <div class="flex-grow-1">
                  {{ player.username }}
                </div>
                <div class="mr-3">
                  <b-button
                    class="status-button"
                    @click="showInfo(player)"
                    :class="setPlayerClass1(player)"
                  >
                    <b-icon-info-circle></b-icon-info-circle>
                  </b-button>
                  <b-button
                    class="status-button"
                    @click="openChat(player)"
                    :class="setPlayerClass3(player)"
                  >
                    <b-icon-chat></b-icon-chat>
                  </b-button>
                  <b-button
                    class="status-button"
                    @click="showPhotoModal(player)"
                    :class="photoButtonClass(player)"
                  >
                    <b-icon-camera></b-icon-camera>
                  </b-button>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>

          <b-list-group v-if="selected_section == sections[1]">
            <b-list-group-item
              v-for="(player, index) in ordinate_player"
              :key="index"
              class="px-2 player-row"
            >
              <div class="d-flex align-items-center">
                <div class="ml-3" style="width: 30%">
                  {{ player.name }}
                </div>
                <div style="width: 30%">
                  {{ player.username }}
                </div>
                <div class="flex-grow-1">Tempo totale: {{ player.time }}</div>
                <div class="mr-3">Punteggio: {{ player.points }}</div>
              </div>
            </b-list-group-item>
          </b-list-group>

          <b-modal
            id="info-modal"
            size="lg"
            @ok="updatePlayer()"
            @show="setInfoModal"
          >
            <template #modal-header>
              <h4 class="m-0" v-if="selected_player">
                {{ selected_player.name }}
              </h4>
            </template>
            <template #default>
              <div v-if="selected_player" style="height: 60vh">
                <div
                  class="d-flex flex-column"
                  style="width: 100%; height: 100%; overflow-y: auto"
                >
                  <h4 class="mt-4 ml-4">Modifica il nome del giocatore</h4>
                  <b-form-input
                    max-lenght="50"
                    style="width: 50%"
                    class="ml-4 mt-4"
                    type="text"
                    v-model="name_to_edit"
                    placeholder="Inserisci il nome..."
                  ></b-form-input>
                  <h4 class="mt-4 ml-4">Stato del giocatore</h4>
                  <h5 class="mt-4 ml-4">Missione corrente</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.status.mission.title }}
                  </h5>

                  <h5 class="mt-4 ml-4">Attività corrente</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.status.activity.title }}
                  </h5>
                  <h5 class="mt-4 ml-4">Time stuck</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.status.time_stuck }}
                  </h5>
                  <h5 class="mt-4 ml-4">Tempo totale</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.time }}
                  </h5>
                  <h5 class="mt-4 ml-4">Punti</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.points }}
                  </h5>
                </div>
              </div>
            </template>
            <template #modal-footer="{ hide, ok }">
              <div class="d-flex justify-content-end">
                <b-button class="m-1" @click="hide()"> Indietro </b-button>
                <b-button class="m-1" @click="ok()"> Salva </b-button>
              </div>
            </template>
          </b-modal>

          <b-modal id="chat-modal" size="lg">
            <template #modal-header>
              <h4 class="m-0" v-if="selected_player">
                Chat con {{ selected_player.name }}
              </h4>
            </template>
            <template #default>
              <div v-if="selected_player" style="height: 60vh">
                <div
                  class="d-flex flex-column"
                  style="width: 100%; height: 100%; overflow-y: auto"
                >
                  <div
                    v-for="(message, index) in messages[selected_player.id]"
                    :key="index"
                    :class="message.sender ? 'player-message' : 'tutor-message'"
                    class="m-2 p-2 message"
                  >
                    {{ message.text }}
                  </div>
                </div>
              </div>
            </template>
            <template #modal-footer>
              <div class="d-flex" style="width: 100%">
                <b-button @click="sendMessage()" class="m-1">Invia</b-button>
                <b-form-input class="m-1" v-model="message"></b-form-input>
              </div>
            </template>
          </b-modal>

          <!-- Photo modal -->
          <b-modal
            id="photo-modal"
            size="lg"
            hide-footer
            :title="selected_player ? 'Foto da ' + selected_player.name : ''"
          >
            <div v-if="selected_player_id">
              <div
                v-if="photos[selected_player_id].question"
                class="d-flex flex-column align-items-center"
              >
                <div class="mt-4 mb-2">
                  Il giocatore ha risposta alla domanda
                </div>
                <h6 class="m-2">
                  " {{ photos[selected_player_id].question }} "
                </h6>
                <div class="m-2">con la seguente foto</div>
                <img
                  :src="photos[selected_player_id].answer"
                  width="70%"
                  height="auto"
                  class="m-2"
                />
                <div class="m-2">La foto risulta corretta o sbagliata?</div>
                <div
                  class="d-flex justify-content-center mt-2 mb-4"
                  style="width: 100%"
                >
                  <b-button class="mx-2 py-3" style="width: 35%" @click="photoResponse(false)">
                    Rifiuta
                  </b-button>
                  <b-button class="mx-2 py-3" style="width: 35%" @click="photoResponse(true)">
                    Accetta
                  </b-button>
                </div>
              </div>
              <div v-else class="my-5 d-flex flex-column align-items-center">
                Nessuna foto in attesa di valutazione
              </div>
            </div>
          </b-modal>
          <b-container
            v-if="selected_section == sections[2]"
            style="height: 100%; width: 100vw"
          >
            <div
              style="height: 90%; width: 100%"
              class="esp d-flex align-items-center justify-content-center"
            >
              <b-button
                class="esporta ml-2 mr-2"
                style="height: 25vh; width: 70%"
              >
                <h3>Scarica file JSon</h3>
              </b-button>
            </div>
            <div style="height: 10%" class="d-flex justify-content-center">
              <h3>Chiave d'accesso alla partita: {{ game_key }}</h3>
            </div>
          </b-container>
        </div>
      </div>
      <div class="d-flex py-1 px-1" style="height: 10%">
        <b-button class="flex-fill m-1" @click="selected_section = sections[0]">
          <b-icon icon="person-fill"></b-icon>
        </b-button>
        <b-button class="flex-fill m-1" @click="selected_section = sections[1]">
          <b-icon icon="bar-chart-fill"></b-icon>
        </b-button>
        <b-button class="flex-fill m-1" @click="selected_section = sections[2]">
          <b-icon icon="gear-fill"></b-icon>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      wsc: null,
      game: {
        players: [],
      },
      game_key: "",
      story_key: "",
      selected_player_id: "",
      message: "",
      name_to_edit: "",
      messages: {},
      photos: {},
      sections: [
        {
          title: "GIOCATORI",
        },
        {
          title: "CLASSIFICA",
        },
        {
          title: "IMPOSTAZIONI",
        },
      ],
      selected_section: null,
    };
  },
  computed: {
    selected_player: function () {
      if (this.selected_player_id) {
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.players[i].id == this.selected_player_id)
            return this.game.players[i];
        }
      } else {
        return null;
      }
      return null;
    },
    ordinate_player: function () {
      let a = JSON.parse(JSON.stringify(this.game.players));

      for (let i = 0; i < a.length; i++) {
        var swapped = new Boolean(false);
        for (let j = 1; j < a.length - i; j++) {
          if (a[j - 1].points == a[j].points) {
            if (a[j - 1].time > a[j].time) {
              let temp = a[j - 1];
              a[j - 1] = a[j];
              a[j] = temp;
              swapped = true;
            }
          }
          if (a[j - 1].points < a[j].points) {
            let temp = a[j - 1];
            a[j - 1] = a[j];
            a[j] = temp;
            swapped = true;
          }
        }
        if (!swapped) break;
      }
      return a;
    },
  },
  methods: {
    initTutor() {
      fetch("/api/tutor?game_key=" + this.game_key)
        .then((response) => response.json())
        .then((data) => {
          this.game = data;
          this.game.players.forEach((player) => {
            if (this.messages[player.id] == undefined)
              this.messages[player.id] = [];
            if (this.photos[player.id] == undefined)
              this.photos[player.id] = {};
          });
          setInterval(this.updateTutor, 2000);
        });
    },
    initWebSocket() {
      let that = this;
      this.wsc = new WebSocketClient();

      this.wsc.open("ws://localhost:8080");

      this.wsc.onmessage = function (data) {
        let message = JSON.parse(data.data);
        if (
          message.story_key == that.story_key &&
          message.game_key == that.game_key &&
          message.sender == false
        ) {
          switch (message.type) {
            case "msg":
              that.messages[message.player_id].push({
                text: message.message,
                sender: false,
              });
              break;
            case "photo":
              that.photos[message.player_id].answer = message.answer;
              that.photos[message.player_id].question = message.question;
              break;
            default:
              break;
          }
        }
      };
    },
    updateTutor() {
      fetch("/api/tutor/update?game_key=" + this.game_key)
        .then((response) => response.json())
        .then((data) => {
          this.game = data[0];
          this.game.players.forEach((player) => {
            if (this.messages[player.id] == undefined)
              this.messages[player.id] = [];
            if (this.photos[player.id] == undefined)
              this.photos[player.id] = {};
          });
        });
    },
    updatePlayer() {
      fetch(
        "/api/tutor/update?player_id=" +
          this.selected_player_id +
          "&game_key=" +
          this.game_key +
          "&story_key=" +
          this.story_key,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name_to_edit,
          }),
        }
      ).then((response) => {
        this.selected_player.name = this.name_to_edit;
      });
    },
    setInfoModal() {
      this.name_to_edit = JSON.parse(JSON.stringify(this.selected_player.name));
    },
    openChat(player) {
      this.selected_player_id = player.id;
      this.$bvModal.show("chat-modal");
    },
    showInfo(player) {
      this.selected_player_id = player.id;
      this.$bvModal.show("info-modal");
    },
    sendMessage() {
      if (this.message) {
        this.wsc.send(
          JSON.stringify({
            type: "msg",
            message: this.message,
            player_id: this.selected_player.id,
            game_key: this.game_key,
            story_key: this.story_key,
            sender: true,
          })
        );
        this.messages[this.selected_player.id].push({
          text: this.message,
          sender: true,
        });
        this.message = "";
      }
    },
    setPlayerClass1(player) {
      return {
        blue: item.status.time_stuck > item.status.activity.max_time,
      };
    },
    photoButtonClass(player) {
      return {
        orange: this.photos[player.id].question,
      };
    },
    setPlayerClass3(player) {
      return {
        red: player.status.need_help,
      };
    },
    setPlayerClass4(player) {
      return {
        green: player.status.chat,
      };
    },
    showPhotoModal(player) {
      this.selected_player_id = player.id;
      this.$bvModal.show("photo-modal");
    },
    photoResponse(answer) {
      this.wsc.send(
        JSON.stringify({
          type: "photo",
          answer: answer,
          player_id: this.selected_player.id,
          game_key: this.game_key,
          story_key: this.story_key,
          sender: true,
        })
      );
      this.photos[this.selected_player_id] = {};
    },
  },
  created: function () {
    let urlParams = new URLSearchParams(window.location.search);
    this.game_key = urlParams.get("game_key");
    this.story_key = urlParams.get("story_key");
    this.selected_section = this.sections[0];
    this.initTutor();
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
body {
  color: var(--text-color);
  background-color: var(--primary-color);
}

.topbar {
  height: 10%;
  background-color: var(--secondary-color);
}

.scrollable {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.btn {
  background-color: var(--form-color);
  color: var(--text-color);
  margin: 0;
  border: none;
  outline: none;
}

.btn:focus {
  background-color: var(--hover-color);
  outline: none;
  border: none;
}

.player-row {
  background-color: var(--object-color);
  border: 0px;
  border-radius: 4px;
  color: var(--text-color);
  white-space: nowrap;
  text-align: left;
  margin-top: 15px;
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

.modal-header {
  background-color: var(--secondary-color);
  border: none;
}

.modal-footer {
  padding: 0;
  border: none;
  height: 68px;
  background-color: var(--secondary-color);
}

.modal-body {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.modal-body {
  padding: 0px;
}
.orange {
  background-color: orange;
}
.red {
  background-color: red;
}
.green {
  background-color: green;
}
.blue {
  background-color: blue;
}

.player-message {
  color: var(--text-color);
  text-align: end;
}

.tutor-message {
  color: #5affcb;
  text-align: left;
}

.message {
  border: 1px solid #ffffff;
  border-radius: 5px;
  background-color: #28293d;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.esp .esporta {
  background-color: #1a1c2c;
  color: #ffffff;
  margin: 0;
  outline: none;
  border: 5px solid;
  border-color: #00ca5b;
}

.status-button:focus {
  background-color: unset;

}
</style>
