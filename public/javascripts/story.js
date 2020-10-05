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
        message.player_id == vm.$data.player_id &&
        message.story_key == vm.$data.story_key &&
        message.game_key == vm.$data.game_key &&
        message.sender == true
    ) {
        vm.$data.messages.push({
            text: message.message,
            sender: false,
        });
    }
};

Vue.component("Collega", {
    data(){
        return {

        }
    },
    props: {
        element: {
            type: Object
        }
    },
    template: "#Collega",
})

var vm = new Vue({
    el: "#app",
    data: {
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
    },
    computed: {},
    methods: {
        renderElement(element){
            return JSON.stringify(element)
        },
        sendMessage() {
            wsc.send(
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
            updateStatus();
        },
    },
});

$(document).ready(() => {
    let urlParams = new URLSearchParams(window.location.search);
    vm.$data.game_key = urlParams.get("game_key");
    vm.$data.story_key = urlParams.get("story_key");
    vm.$data.player_id = urlParams.get("player_id");
    initPlayer();
});

function findObject(array, key){
    for (let i = 0; i < array.length; i++){
        if (array[i].key = key) return array[i]
    }
}

function initPlayer() {
    fetch("/api/stories?key=" + vm.$data.story_key)
        .then((response) => response.json())
        .then((data) => {
            if ((data.length == 1)) {
                vm.$data.story = data[0];
                vm.$data.current_path = vm.$data.story.paths[Math.round(Math.random() * (vm.$data.story.paths.length - 1))]
                vm.$data.current_mission = findObject(vm.$data.current_path.missions, vm.$data.current_path.first_mission)
                vm.$data.current_activity = findObject(vm.$data.current_mission.activities,vm.$data.current_mission.first_activity)
                fetch(
                    "/api/player?game_key=" +
                        vm.$data.game_key +
                        "&player_id=" +
                        vm.$data.player_id
                )
                    .then((response) => response.json())
                    .then((data) => {
                        vm.$data.player = data;
                        setInterval(updateStatus, 2000);
                    });
            }
        });
}

function updateStatus() {
    fetch(
        "/api/player/update?game_key=" +
            vm.$data.game_key +
            "&player_id=" +
            vm.$data.player_id,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vm.$data.player),
        }
    )
        .then((response) => response.json())
        .then((data) => (vm.$data.player = data));
}
