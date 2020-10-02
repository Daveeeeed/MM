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

var wsc = new WebSocketClient();

wsc.open("ws://192.168.178.21:8080");

wsc.onmessage = function (data, flags, number) {
    let message = JSON.parse(data.data);
    if (
        message.story_key == vm.$data.story_key &&
        message.game_key == vm.$data.game_key &&
        message.sender == false
    ) {
        vm.$data.messages[message.player_id].push({
            text: message.message,
            sender: false,
        });
    }
};

var vm = new Vue({
    el: "#app",
    data: {
        game: null,
        game_key: "",
        story_key: "",
        selected_player_id: "",
        message: "",
        name_to_edit: "",
        messages: {},
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
    },
    methods: {
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
            this.name_to_edit = JSON.parse(
                JSON.stringify(this.selected_player.name)
            );
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
            wsc.send(
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
    },

    created() {
        this.game = {
            players: [],
        };
    },
});

function updateTutor() {
    fetch("/api/tutor/update?game_key=" + vm.$data.game_key)
        .then((response) => response.json())
        .then((data) => {
            vm.$data.game = data[0];
            vm.$data.game.players.forEach(player => {
                if (vm.$data.messages[player.id] == undefined) vm.$data.messages[player.id] = [];
            });
        });
}

function fetchTutor() {
    fetch("/api/tutor?game_key=" + vm.$data.game_key)
        .then((response) => response.json())
        .then((data) => {
            vm.$data.game = data;
            vm.$data.game.players.forEach(player => {
                if (vm.$data.messages[player.id] == undefined) vm.$data.messages[player.id] = [];
            });
            setInterval(updateTutor, 2000);
        });
}

$(document).ready(() => {
    let urlParams = new URLSearchParams(window.location.search);
    vm.$data.game_key = urlParams.get("game_key");
    vm.$data.story_key = urlParams.get("story_key");
    fetchTutor();
});
