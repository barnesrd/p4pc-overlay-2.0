var timestampOld = 0;

var jsonDoc = {
    "timestamp": null,
    "c1name": null,
    "c1nav": null,
    "c1plug": null,
    "c2name": null,
    "c2nav": null,
    "c2plug": null
}

animating = false;
doUpdate = false;

function init(){
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }

    anime({
        targets:['#c2nav', '#c2navbg', '#c2navef'],
        rotateY:['0deg','180deg'],
        duration:0
    });

    window.setInterval(pollHandler, 100)
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

function updateByTag(tag, startx=0, endx=0){
    animating = true;
    anime.timeline({
        targets: tag,
        duration: 500
    }).add({
        opacity:[1,0],
        translateX:[startx, endx],
        easing: 'easeInExpo',
        complete: () => { $(tag).html(jsonDoc[tag.slice(1)]) }
    }, 0).add({
        opacity:[0,1],
        translateX: [endx, startx],
        easing: 'easeOutExpo',
        complete: () => { animating = false }
    }, 500);
}

function loadData(){
    fetch("../json/comms_data.json").then(response => response.json()).then((response) => {
        timestampOld = jsonDoc.timestamp;
        jsonDoc = response;
    }).catch((err) => {
        console.log("Error loading json file at overlay/html-overlays/js/comms_data.json. Ensure that the file exists before reloading.");
    });
}

function updateBoard(){
    if ($('#c1name').html() != jsonDoc.c1name) {
        updateByTag('#c1name', 0, 250);
    }
    
    if ($('#c2name').html() != jsonDoc.c2name) {
        updateByTag('#c2name', 0, -250);
    }

    if ($('#c1plug').html() != jsonDoc.c1plug){
        updateByTag('#c1plug', 0, 200);
    }
    
    if ($('#c2plug').html() != jsonDoc.c2plug){
        updateByTag('#c2plug', 0, -200)
    }
    
    if ($('#c1nav').html() != jsonDoc.c1nav){
        animating=true;
        anime.timeline({
            targets:['#c1nav', '#c1navbg', '#c1navef'],
            duration:500
        }).add({
            translateX:[0,100],
            opacity:[1,0],
            easing:'easeInExpo',
            complete: () => {
                $('#c1nav').attr('src', `../images/navs/${jsonDoc.c1nav}.png`).html(jsonDoc.c1nav);
                $('#c1navbg').attr('src', `../images/navs/${jsonDoc.c1nav}BG.png`);
                $('#c1navef').attr('src', `../images/navs/${jsonDoc.c1nav}EF.png`);
            }
        }).add({
            translateX:[100,0],
            opacity:[0,1],
            easing:'easeOutExpo',
            complete: () => {
                anime.timeline({
                    loop:true
                }).add({
                    targets:'#c1navbg',
                    scale:[1,1.1],
                    easing:'easeOutCirc',
                    duration:500,
                    direction:'alternate'
                },0).add({
                    targets:'#c1navef',
                    opacity:[1,0],
                    scale:[1,1.5],
                    easing:'easeOutCirc',
                    duration:500
                },0);
                animating=false;
            }
        });
    }
    
    if ($('#c2nav').html() != jsonDoc.c2nav){
        animating=true;
        anime.timeline({
            targets:['#c2nav', '#c2navbg', '#c2navef'],
            duration:500
        }).add({
            translateX:[0,100],
            opacity:[1,0],
            easing:'easeInExpo',
            complete: () => {
                $('#c2nav').attr('src', `../images/navs/${jsonDoc.c2nav}.png`).html(jsonDoc.c2nav);
                $('#c2navbg').attr('src', `../images/navs/${jsonDoc.c2nav}BG.png`);
                $('#c2navef').attr('src', `../images/navs/${jsonDoc.c2nav}EF.png`);
            }
        },0).add({
            rotateY:['0deg', '180deg']
        },500).add({
            translateX:[100,0],
            opacity:[0,1],
            easing:'easeOutExpo',
            complete: () => {
                anime.timeline({
                    loop:true
                }).add({
                    targets:'#c2navbg',
                    scale:[1,1.1],
                    easing:'easeOutCirc',
                    duration:500,
                    direction:'alternate'
                },0).add({
                    targets:'#c2navef',
                    opacity:[1,0],
                    scale:[1,1.5],
                    easing:'easeOutCirc',
                    duration:500
                },0);
                animating=false;
            }
        },500);				
    }
    
    doUpdate = false;
}