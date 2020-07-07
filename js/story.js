var head = new Vue({
    el: '#head',
    data: {
        story_title: "test"
    }
})

var test = new Vue({
    el: '#test',
    data: {
        items: []
    }

})

$(document).ready(() => {
    updateList();
})

function updateList() {
    fetch('/api/stories/fetch')
        .then(response => response.json())
        .then(json => test.$data.items = json);
}

function add() {
    fetch('/api/stories/add?name=' + $('#storyname')[0].value)
        .then(() => {
            $('#storyname')[0].value = "";
            updateList();
        });
}

function remove() {
    fetch('api/stories/remove?name=' + $('#storyname')[0].value)
        .then(() => {
            $('#storyname')[0].value = "";
            updateList();
        });
}