var timestampOld;

var jsonDoc = {
    "timestamp":null,
    "pName1":null,
    "pName2":null,
    "pScore1":null,
    "pScore2":null,
    "pCountry1":null,
    "pCountry2":null,
    "mText3":null
}

var animating = false;
var doUpdate = false;
var version = '64flat';

var p1country = '';
var p2country = '';

function init() {
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }

    animating = true;
    anime.timeline({
        duration:500,
        easing:'easeOutExpo'
    }).add({
        targets:'#board',
        opacity: [0,1],
    },0)
    .add({
        targets:'#p1board',
        rotateY: ['0deg', '180deg'],
        opacity: [0,.9],
        duration:0
    },0)
    .add({
        targets:'#p2board',
        opacity: [0,.9],
        duration:0
    },0)
    .add({
        targets:'#p1board',
        translateX:[-100,0]
    },0)
    .add({
        targets:'#p2board',
        translateX:[-100,0],
        complete: () =>{
            
        }
    },0);
    animating = false;
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
    fetch("../json/scoreboard_data.json").then(response => response.json()).then((response) => {
        timestampOld = jsonDoc.timestamp;
        jsonDoc = response;
    }).catch((err) => {
        console.log("Error loading json file at overlay/html-overlays/js/scoreboard_data.json. Ensure that the file exists before reloading.");
    });
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

function updateCountry(board, img, country, startx=0, endx=0){
    animating = true;
    if ($(board).css('opacity')==0){
        if(country == ""){
            animating = false;
            return
        }
        let image = new Image(85, 50);
        image.src = `../images/flags/${version}/${country}.png`
        image.onload = () => {
            $(img).attr('src', image.src)
            anime.timeline({
                targets: board,
                duration: 500
            }).add({
                opacity: [0, .9],
                translateX: [endx, startx],
                easing: 'easeOutExpo',
                complete: () => {
                    animating = false;
                }
            }, 500)
        }
    }
    else if (country == ""){
        anime.timeline({
            targets: board,
            duration: 500
        }).add({
            opacity: [.9, 0],
            translateX: [startx, endx],
            easing: 'easeInExpo',
            complete: () => {
                animating = false;
            }
        }, 500)
    }
    else{
        anime.timeline({
            targets: board,
            duration: 500
        }).add({
            translateX: [startx, endx],
            easing: 'easeInExpo',
            complete: () => {
                let image = new Image(85, 50);
                image.src = `../images/flags/${version}/${country}.png`
                image.onload = () => {
                    $(img).attr('src', image.src)
                    anime.timeline({
                        targets: board,
                        duration: 500
                    }).add({
                        translateX: [endx, startx],
                        easing: 'easeOutExpo',
                        complete: () => {
                            animating = false;
                        }
                    }, 500)
                }
            }
        }, 500)
    }
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

    if (p1country != jsonDoc.pCountry1){
        updateCountry('#p1countryboard', '#p1countryflag', jsonDoc.pCountry1, 0, 85)
        p1country = jsonDoc.pCountry1
    }

    if (p2country != jsonDoc.pCountry2){
        updateCountry('#p2countryboard', '#p2countryflag', jsonDoc.pCountry2, 0, -85)
        p2country = jsonDoc.pCountry2
    }
    
    doUpdate = false;
}