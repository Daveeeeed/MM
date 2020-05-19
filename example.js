var page_index = -1;

$(document).ready(function () {
    $.getJSON('example.json', function (data) {
        let string = "";
        string = string.concat(mergeChild(data.gui));
        $("body").html(string);
        $('#avanti').click(function () {
            let title = $('#title');
            let content = $('#content');
            page_index++;
            title.text(data.items[page_index].name);
            content.text(data.items[page_index].content);
        })
        $('#indietro').click(function () {
            let title = $('#title');
            let content = $('#content');
            page_index--;
            title.text(data.items[page_index].name);
            content.text(data.items[page_index].content);
        })
    });
});

function parametersMerge(array) {
    let s = "";
    for (let i = 0; i < array.length; i++){
        s = s.concat(' ',array[i].key,'= "',array[i].value,'"');
    }
    return s;
}

function mergeChild(children) {
    let s = "";
    for (let i = 0; i < children.length; i++){
        s = s.concat("<", children[i].tag, parametersMerge(children[i].parameters), ">");
        s = s.concat(children[i].content);
        s = s.concat(mergeChild(children[i].children));
        s = s.concat("</",children[i].tag,">");
    }
    return s;
}