var page = 0;

$(document).ready(function () {
    $.getJSON('example.json', function (data) {
        var main = $("body");
        let string = "";
        string = string.concat(mergeChild(data.gui));
        main.html(string);
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