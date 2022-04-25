var timestampOld;
var timestamp;
var pName1;
var pScore1;
var pName2;
var pScore2;
var mText3;

var xmlDoc;

var xhr = new XMLHttpRequest();

var animating = false;
var doUpdate = false;

function init() {
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
        //window.stop();
        //return true;
    }

    xhr.overrideMimeType('text/xml');
    
    var timeout = this.window.setInterval(function() {
        pollHandler();
    }, 100);

    $('#pName1').html('');
    $('#pScore1').html('');
    $('#pName2').html('');
    $('#pScore2').html('');
    $('#mText3').html('');
    var boardtimeline = anime.timeline({
        duration:500,
        easing:'easeOutExpo'
    });
    boardtimeline.add({
        targets:'#board',
        opacity: [0,1],
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
}

function pollHandler()
{
    loadData();
    if (timestamp != timestampOld) {
        doUpdate = true;
    }
    if (!animating && doUpdate) {
        updateBoard();
    }
}

function loadData() {
    xhr.open('GET', '../xml/streamcontrol.xml');
    xhr.send();
    xhr.onreadystatechange = function(){
            xmlDoc = xhr.responseXML;
            try{
            pName1 = getValueFromTag(xmlDoc,'pName1');
            pName2 = getValueFromTag(xmlDoc,'pName2');
            pScore1 = getValueFromTag(xmlDoc,'pScore1');
            pScore2 = getValueFromTag(xmlDoc,'pScore2');
            mText3 = getValueFromTag(xmlDoc,'mText3');
            timestampOld = timestamp;
            timestamp = getValueFromTag(xmlDoc,'timestamp');
            }catch(err){}
            
    }
}

function updateBoard() {
    if ($('#pName1').html() != pName1) {
        animating = true;
        var p1nametimeline = anime.timeline({
            targets:'#pName1',
            duration:500
        });
        p1nametimeline.add({
            opacity:[1,0],
            translateX:[0,100],
            easing: 'easeInExpo',
            complete:function(){
                $('#pName1').html(pName1);
            }
        },0)
        .add({
            opacity:[0,1],
            translateX:[100,0],
            easing: 'easeOutExpo',
            complete:function(){
                animating=false;
            }
        },500);
    }
    
    if ($('#pName2').html() != pName2) {
        animating = true;
        var p2nametimeline = anime.timeline({
            targets:'#pName2',
            duration:500
        });
        p2nametimeline.add({
            opacity:[1,0],
            translateX:[0,-100],
            easing: 'easeInExpo',
            complete:function(){
                $('#pName2').html(pName2);
            }
        },0)
        .add({
            opacity:[0,1],
            translateX:[-100,0],
            easing: 'easeOutExpo',
            complete:function(){
                animating=false;
            }
        },500);
    }
    
    if ($('#pScore1').html() != pScore1) {
        animating = true;
        var p1scoretimeline = anime.timeline({
            targets:'#pScore1',
            duration:500
        });
        p1scoretimeline.add({
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                $('#pScore1').html(pScore1);
            }
        })
        .add({
            opacity:[0,1],
            easing:'easeOutExpo',
            complete:function(){
                animating=false;
            }
        });
    }
    
    if ($('#pScore2').html() != pScore2) {
        animating = true;
        var p2scoretimeline = anime.timeline({
            targets:'#pScore2',
            duration:500
        });
        p2scoretimeline.add({
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                $('#pScore2').html(pScore2);
            }
        })
        .add({
            opacity:[0,1],
            easing:'easeOutExpo',
            complete:function(){
                animating=false;
            }
        });
    }
    
    if ($('#mText3').html() != mText3) {
        animating = true;
        var titletimeline = anime.timeline({
            targets:'#mText3',
            duration:500
        });
        titletimeline.add({
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                $('#mText3').html(mText3);
            }
        })
        .add({
            opacity:[0,1],
            easing:'easeOutExpo',
            complete:function(){
                animating=false;
            }
        });
    }
    
    doUpdate = false;
}

function getValueFromTag (xmlDoc,tag) {
    if (xmlDoc.getElementsByTagName(tag).length != 0 ) {
        if (xmlDoc.getElementsByTagName(tag)[0].childNodes.length == 0) {
                return '';
            } else {
                return xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
        }
    } else {
        return '';
    }
}