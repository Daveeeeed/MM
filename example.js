var page_index = 0;

$(document).ready(function () {

    $('#right_arrow').click(function () {
        var text = $('#textbox');
        page_index++;
        setCorrectText(text);
    });
    $('#left_arrow').click(function () {
        var text = $('#textbox');
        page_index--;
        setCorrectText(text);
    });
});

function setCorrectText(text) {
    $.getJSON('example.json', function (data) {
        text.text(data.items[page_index].name);
    });
}