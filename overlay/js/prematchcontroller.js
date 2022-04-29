var timestampOld = 0;

var xhr = new XMLHttpRequest()

var jsonDoc = {
    "timestamp": null,
    "p1n": null,
    "p1c": null,
    "p2n": null,
    "p2c": null,
    "match": ''
}

var p1c;
var p2c;

var container = document.getElementById('board');

var doUpdate = false;
var animating = false;

function init(){
    window.onerror = () => {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }

    xhr.overrideMimeType('application/json');

    anime.timeline({
        duration:500,
        easing:'easeOutExpo',
        opacity: [0,1]
    }).add({
        targets: '#p1board',
        translateX: [150,0]
    }, 0)
    .add({
        targets:'#p2board',
        rotateY: ['0deg', '180deg'],
        duration:0
    },0)
    .add({
        targets:'#p2board',
        translateX: [150,0],
    },0);

    window.setInterval(pollHandler, 100);
}

function loadData(){
    xhr.open("GET", "../xml/prematch_data.json", false);
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

function completeAnimation(tag, name, p1){
    $(tag).removeAttr('height').removeAttr('width');
    $(tag).attr('src', `../images/characters/${name}.png`).html(name).on('load', () => {
        let ratio = $(tag).width()/$(tag).height();
        if(name =="Chie Satonaka" || name =="Shadow Chie Satonaka"){
            $(tag).attr('height', 800).attr('width', 800*ratio);
        }
        else{
            $(tag).attr('height', 850).attr('width', 850*ratio);
        }
        if(p1){
            anime.timeline({
                targets: tag,
                duration: 500
            }).add({
                translateX: [0-$(tag).width(), 0],
                easing: 'easeOutExpo',
                opacity: [0,1],
                complete: () => { animating = false }
            })
        }
        else{
            $(tag).css({'transform':'rotateY(180deg)'})
            anime.timeline({
                targets: tag,
                duration: 500
            }).add({
                translateX: [-1920-$(tag).width(), -1920+$(tag).width()],
                easing: 'easeOutExpo',
                opacity: [0,1],
                complete: () => { animating = false }
            }, 000)
        }
    })
}

function updateBoard(){
    if ($('#p1n').html() != jsonDoc.p1n) {
        updateByTag('#p1n', 0, 400)
    }

    if ($('#p2n').html() != jsonDoc.p2n) {
        updateByTag('#p2n', 0, -400);
    }

    if (p1c != jsonDoc.p1c) {
        animating = true;
        anime.timeline({
            targets: '#p1c',
            duration: 500
        }).add({
            translateX: [0, 0-$('#p1c').width()],
            opacity: [1,0],
            easing:'easeInExpo',
            complete: () => {
                p1c = jsonDoc.p1c;
                completeAnimation('#p1c', jsonDoc.p1c, true)
            }
        }, 0).add({
            targets:'#p1chartitle',
            rotateZ:['0deg', '30deg'],
            duration:0
        },0).add({
            targets:'#p1chartitle',
            translateX:[0,-400],
            translateY:[0, 350],
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                let shadow = jsonDoc.p1c.slice(0,6);
                let name = "";
                if(shadow=="Shadow") name=jsonDoc.p1c.slice(7);
                else name = jsonDoc.p1c;
                $('#p1chartitle').attr('src', `../images/titles/${name} Title.png`).attr('height', 150).attr('width', 338);
            }
        },0).add({
            targets:'#p1chartitle',
            translateX:[-400,0],
            translateY:[350,0],
            opacity:[0,1],
            easing:'easeOutExpo',
            complete:function(){
                anime.timeline({
                    targets:'#p1chartitle',
                    duration:2000,
                    loop:true
                })
                .add({
                    scale:[1,1.05],
                    easing:'easeInOutQuad'
                })
                .add({
                    scale:[1.05,1],
                    easing:'easeInOutQuad'
                })
                animating=false
            }
        },500);
    }

    if(p2c != jsonDoc.p2c){
        animating=true;
        anime.timeline({
            targets:'#p2c',
            duration:500
        }).add({
            translateX:[1920-$('#p2c').width(), 1920+$('#p2c').width()],
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                p2c = jsonDoc.p2c;
                completeAnimation('#p2c', jsonDoc.p2c, false);
            }
        }, 0).add({
            targets:'#p2chartitle',
            translateX:[0,400],
            translateY:[0,150],
            opacity:[1,0],
            easing:'easeInExpo',
            complete:function(){
                let shadow = jsonDoc.p2c.slice(0,6);
                let name = "";
                if(shadow=="Shadow") name = jsonDoc.p2c.slice(7);
                else name = jsonDoc.p2c;
                $('#p2chartitle').attr('src', `../images/titles/${name} Title.png`).attr('height', 150).attr('width', 338)
            }
        },0).add({
            targets:'#p2chartitle',
            translateX:[400,0],
            translateY:[150,0],
            opacity:[0,1],
            easing:'easeOutExpo',
            complete:function(){
                anime.timeline({
                    targets:'#p2chartitle',
                    duration:2000,
                    loop:true
                })
                .add({
                    scale:[1,1.05],
                    easing:'easeInOutQuad'
                })
                .add({
                    scale:[1.05,1],
                    easing:'easeInOutQuad'
                })
            }
        },500);
    }

    if ($('#title').html() != jsonDoc.match || $('#bg').opacity() == 0){
        animating=true;
        anime.timeline({
            duration:500
        }).add({
            targets:"#bg",
            opacity:[1,0],
            easing:"easeInExpo",
            complete:function(){
                $('#bg').attr('src', `../images/${jsonDoc.match}.png`);
            }
        }, 0)
        .add({
            targets:"#title",
            opacity:[1,0],
            easing:"easeInExpo",
            complete:function(){
                $('#title').html(jsonDoc.match);
            }
        }, 0)
        .add({
            targets:"#bg",
            opacity:[0,1],
            easing:"easeOutQuad",
        }, 500)
        .add({
            targets:"#title",
            opacity:[0,1],
            easing:"easeOutQuad",
            complete:function(){
                animating=false;
            }
        }, 500);
    }
}