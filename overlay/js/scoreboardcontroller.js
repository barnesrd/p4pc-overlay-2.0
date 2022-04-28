var timestampOld;

var xhr = new XMLHttpRequest();

var jsonDoc = {
    "timestamp":null,
    "pName1":null,
    "pName2":null,
    "pScore1":null,
    "pScore2":null,
    "mText3":null
}

var animating = false;
var doUpdate = false;

function init() {
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }

    xhr.overrideMimeType('application/json');

    anime.timeline({
        duration:500,
        easing:'easeOutExpo'
    }).add({
        targets:'#board',
        opacity: [0,.85],
    },0)
    .add({
        targets:'#p1board',
        rotateY: ['0deg', '180deg'],
        duration:0
    },0)
    .add({
        targets:'#p2board',
        rotateY: ['0deg', '180deg'],
        duration:0
    },0)
    .add({
        targets:'#p1board',
        translateX:[-100,0]
    },0)
    .add({
        targets:'#p2board',
        translateX:[100,0]
    },0);

    this.window.setInterval(pollHandler, 100);
}

function pollHandler()
{
    loadData();
    if (jsonDoc.timestamp != timestampOld) {
        doUpdate = true;
    }
    if (!animating && doUpdate) {
        updateBoard();
    }
}

function loadData() {
    xhr.open("GET", "../xml/scoreboard_data.json", false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            timestampOld = jsonDoc.timestamp;
            jsonDoc = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
}

function updateByTag(tag, startx=0, endx=0){
    animating = true;
    anime.timeline({
        targets: tag,
        duration: 500
    }).add({
        opacity:[1,0],
        translateX:[startx, endx],
        easing: 'easeInExpo',
        complete: () => {
            $(tag).html(jsonDoc[tag.slice(1)]);
        }
    }, 0).add({
        opacity:[0,1],
        translateX: [endx, startx],
        easing: 'easeOutExpo',
        complete: () => {
            animating = false;
        }
    }, 500);
}

function updateBoard() {
    if ($('#pName1').html() != jsonDoc.pName1) {
        updateByTag("#pName1", 0, 100);
    }
    
    if ($('#pName2').html() != jsonDoc.pName2) {
        updateByTag("#pName2", 0, -100);
    }
    
    if ($('#pScore1').html() != jsonDoc.pScore1) {
        updateByTag("#pScore1")
    }
    
    if ($('#pScore2').html() != jsonDoc.pScore2) {
        updateByTag("#pScore2");
    }
    
    if ($('#mText3').html() != jsonDoc.mText3) {
        updateByTag("#mText3");
    }
    
    doUpdate = false;
}