var jsonDoc = {

}
var doUpdate = false;
var timestampOld = 0;

var xhr = new XMLHttpRequest()


function init(){
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }
    xhr.overrideMimeType('application/json');

    window.setInterval(pollHandler, 100)
}

function loadData(){
    xhr.open("GET", "../json/crewbattle_data.json", false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            timestampOld = jsonDoc.timestamp;
            jsonDoc = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
}

function pollHandler(){
    loadData();
    if(timestampOld != jsonDoc.timestamp){
        doUpdate = true;
    }
    if(doUpdate && !animating){
        updateBoard()
    }
}

function updateBoard(){
    animating = true;
}