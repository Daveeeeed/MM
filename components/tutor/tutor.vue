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
              v-for="(item, index) in game.players"
              :key="index"
              class="px-2 player-row"
            >
              <div class="d-flex align-items-center">
                <div class="ml-3" style="width: 44%">
                  {{ item.name }}
                </div>
                <div class="flex-grow-1">
                  {{ item.username }}
                </div>
                <div class="mr-3">
                  <b-button
                    @click="showInfo(item)"
                    :class="setPlayerClass1(item)"
                  >
                    <b-icon-info-circle></b-icon-info-circle>
                  </b-button>
                  <b-button
                    @click="openChat(item)"
                    :class="setPlayerClass3(item)"
                  >
                    <b-icon-chat></b-icon-chat>
                  </b-button>
                  <b-button
                    @click="showPhoto(item)"
                    :class="setPlayerClass2(item)"
                  >
                    <b-icon-camera></b-icon-camera>
                  </b-button>
                  <b-button :class="setPlayerClass4(item)">
                    <b-icon icon="bell"></b-icon>
                  </b-button>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>

          <b-list-group v-if="selected_section == sections[1]">
            <b-list-group-item
              v-for="(item, index) in ordinate_player"
              :key="index"
              class="px-2 player-row"
            >
              <div class="d-flex align-items-center">
                <div class="ml-3" style="width: 30%">
                  {{ item.name }}
                </div>
                <div style="width: 30%">
                  {{ item.username }}
                </div>
                <div class="flex-grow-1">Tempo totale: {{ item.time }}</div>
                <div class="mr-3">Punteggio: {{ item.points }}</div>
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
                    {{ selected_player.status.mission }}
                  </h5>

                  <h5 class="mt-4 ml-4">Attività corrente</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.status.activity }}
                  </h5>
                  <h5 class="mt-4 ml-4">Time stuck</h5>
                  <h5 class="mt-4 ml-4">
                    {{ selected_player.status.time_stuck }}
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

          <b-modal id="photo-modal" size="lg">
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
                  <h1>Foto</h1>
                </div>
              </div>
            </template>
            <template #modal-footer>
              <div class="d-flex justify-content-center" style="width: 100%">
                <b-button class="flex-fill m-1" @click="rejectPhoto">
                  Rifiuta
                </b-button>
                <b-button class="flex-fill m-1" @click="confirmPhoto">
                  Accetta
                </b-button>
              </div>
            </template>
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
          that.messages[message.player_id].push({
            text: message.message,
            sender: false,
          });
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
    openChat(item) {
      this.selected_player_id = item.id;
      this.$bvModal.show("chat-modal");
    },
    showInfo(item) {
      this.selected_player_id = item.id;
      this.$bvModal.show("info-modal");
    },
    sendMessage() {
      if (this.message) {
        this.wsc.send(
          JSON.stringify({
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
    setPlayerClass1(item) {
      return {
        blue: item.status.time_stuck > 6,
      };
    },
    setPlayerClass2(item) {
      return {
        orange: item.status.photo_sent,
      };
    },
    setPlayerClass3(item) {
      return {
        red: item.status.need_help,
      };
    },
    setPlayerClass4(item) {
      return {
        green: item.status.chat,
      };
    },
    showPhoto(item) {
      this.selected_player_id = item.id;
      this.$bvModal.show("photo-modal");
    },
    confirmPhoto() {},
    rejectPhoto() {},
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
</style>
