var jsonDoc = {
    "timestamp" : null,
    "team1": {
        "name" : null,
        "players" : []
    },
    "team2": {
        "name" : null,
        "players" : []
    }
}
var doUpdate = false;
var timestampOld = 0;

var animating = false;
var t1n = '';
var t1size = 0;
var t2n = '';
var t2size = 0;
var timestamps = {
    1:[],
    2:[]
}
var alignments = {};

function init(){
    window.onerror = function(msg, url, linenumber) {
        alert(msg+' Line Number: '+linenumber + '\nNotify Jolteo_');
    }

    let startAnimations = anime.timeline();

    startAnimations.add({
        targets:'#team2TitlePlate',
        rotateY: ['0deg', '180deg'],
        duration:0
    }).add({
        targets:['#team1TitlePlate', '#team2TitlePlate'],
        opacity:[0,1],
        translateX: [-100, 0],
        easing: 'easeOutExpo',
        duration: 500,
        complete: getAlignments
    });
}

async function loadData(){
    return new Promise((resolve, reject) => {
        fetch("../json/crewbattle_data.json").then(response => response.json()).then((response) => {
            jsonDoc = response;
            resolve();
        }).catch((err) => {
            console.log(err)
            reject(err);
        });
    });
}

function pollHandler(){
    loadData().then(() => {
        if(timestampOld != jsonDoc.timestamp){
            doUpdate = true;
            timestampOld = jsonDoc.timestamp;
        }
        if(doUpdate && !animating){
            doUpdate = false;
            updateBoard();
        }
    });
}

async function getAlignments(){
    fetch("../json/align.json").then(response => response.json()).then((response) => {
        let fullAlign = response;
        alignments = fullAlign["Crew Battle"];
        window.setInterval(pollHandler, 100)
    }).catch((err) => {
        getAlignments();
    });
}

async function resizeTeam(team) {
    return new Promise((resolve, reject) => {
        let size = jsonDoc[`team${team}`].players.length;
        let children = Array.from(document.getElementById(`team${team}`).querySelectorAll('.playerPlate'));
        let teamDiv = document.getElementById(`team${team}`);

        while(children.length > size) {
            teamDiv.removeChild(children.pop());
        }
        while(getAllPlayers(team).length < size) {
            createBlankPlayer(team)
        }
        resolve();
    });
}

function createBlankPlayer(team) {
    let teamDiv = document.getElementById(`team${team}`);

    let plate = document.createElement("div");
    plate.classList.add()

    let nameDiv = document.createElement("div");
    nameDiv.classList.add("playerName");
    if (team == 1) {
        plate.classList.add("playerPlate", "team1");
        nameDiv.classList.add("alignNameLeft");
    } else {
        plate.classList.add("playerPlate", "team1");
        nameDiv.classList.add("alignNameRight");
    }
    let characterDiv = document.createElement("img");
    characterDiv.classList.add("character");

    let pinImg = document.createElement("img");
    pinImg.classList.add("character-pin")

    plate.appendChild(nameDiv);
    plate.appendChild(characterDiv);
    plate.appendChild(pinImg);

    teamDiv.appendChild(plate);
}

function editPlayers(team, indexes){
    return new Promise((resolve, reject) => {
        let playerList = getPlayers(team, indexes);
        for(i in playerList){
            player = playerList[i];
            playerProfile = jsonDoc[`team${team}`].players[indexes[i]-1]

            let nameDiv = player.querySelectorAll(".playerName")[0];
            nameDiv.innerHTML = playerProfile.name;
            let characterImg = player.querySelectorAll(".character")[0];
            characterImg.src = `../images/characters/${playerProfile.character}.png`;

            let shadow = playerProfile.character.slice(0,6);
            let name = "";
            if(shadow=="Shadow") name=playerProfile.character.slice(7);
            else name = playerProfile.character;

            characterImg.style.left = `${alignments[name].left}px`
            characterImg.style.top = `${alignments[name].top}px`
            characterImg.style.height = `${alignments[name].height}px`
            
            characterImg.style['-webkit-mask-position'] = `${96-alignments[name].left}px ${0-alignments[name].top}px`

            let pinDiv = player.querySelectorAll(".character-pin")[0];
            pinDiv.src=`../images/characters/character_pins/${playerProfile.character}.png`

            switch(playerProfile.lives){
                case 2:
                    player.className = `playerPlate team${team}`
                    nameDiv.classList.remove('deadFilter')
                    pinDiv.className = "character-pin"
                    characterImg.className = 'character'
                    break;
                case 1:
                    player.className = `playerPlate team${team}`
                    nameDiv.classList.remove('deadFilter')
                    pinDiv.className = "character-pin strike1"
                    characterImg.className = 'character'
                    break;
                case 0:
                    player.className = `playerPlate team${team} dim`
                    nameDiv.classList.add('deadFilter')
                    pinDiv.className = "character-pin strike2 deadFilter dim"
                    characterImg.className = 'character deadFilter'
                    break;
                case _:
                    player.className = `playerPlate team${team}`
                    pinDiv.className = "character-pin"
                    characterImg.className = 'character'
            }
        }
        resolve();
    });
}

function fadePlayersIn(team, playerList, startx=-100, endx=0) {
    let timeline = anime.timeline();
    if(team==2){
        timeline.add({
            targets: playerList,
            rotateY: ['0deg', '180deg'],
            duration:0
        })
    }
    timeline.add({
        targets: playerList,
        translateX: [startx, endx],
        easing: 'easeOutExpo',
        opacity:[0,1],
        duration: 500,
        delay: anime.stagger(70),
        complete: () => { animating = false }
    })
}

function fadePlayersOut(team, playerList, startx=0, endx=-100) {
    return new Promise((resolve, reject) => {
        animating = true;
        let timeline = anime.timeline();
        if(team==2){
            timeline.add({
                targets: playerList,
                rotateY: ['0deg', '180deg'],
                duration:0
            })
        }
        timeline.add({
            targets: playerList,
            translateX: [startx, endx],
            easing: 'easeInExpo', 
            opacity:[1,0],
            duration: 500,
            delay: anime.stagger(70),
            complete: () => { 
                animating = false;
                resolve();
            }
        })
    })
}

function getAllPlayers(team) {
    return Array.from(document.getElementById(`team${team}`).querySelectorAll('.playerPlate'));
}

function getPlayer(team, index) {
    let playerList = Array.from(document.getElementById(`team${team}`).querySelectorAll('.playerPlate'));
    return playerList[index-1];
}

function getPlayers(team, indexes) {
    let playerList = Array.from(document.getElementById(`team${team}`).querySelectorAll('.playerPlate'));
    let players = [];
    for(let i=0; i<indexes.length; i++) {
        players.push(playerList[indexes[i]-1]);
    }
    return players;
}

function getFadeIns(team, outs){
    let indexes = [];
    let teamLength = jsonDoc[`team${team}`].players.length
    for(let i=1; i<=teamLength; i++) {
        if(outs.includes(i) || i > getAllPlayers(team).length){ 
            indexes.push(i);
        }
    }
    return indexes;
}

function getFadeOuts(team){
    let playerList = Array.from(document.getElementById(`team${team}`).querySelectorAll('.playerPlate'));
    if(playerList.length != jsonDoc[`team${team}`].players.length) {
        for(let i in jsonDoc[`team${team}`].players){
            timestamps[team][i] = jsonDoc[`team${team}`].players[i].timestamp;
        }
        return Array.from({length:playerList.length}, (_,i)=>i+1)
    }
    let indexes = [];
    for(let i = 0; i < jsonDoc[`team${team}`].players.length; i++) {
        if(timestamps[team][i] != jsonDoc[`team${team}`].players[i].timestamp){
            indexes.push(i+1)
            timestamps[team][i] = jsonDoc[`team${team}`].players[i].timestamp
        }
    }
    return indexes;
}

function fadeNameOut(target, newName="", startx=0, endx=100){
    return new Promise((resolve, reject) => {
        let timeline = anime.timeline();
        timeline.add({
            targets: target,
            opacity: [1,0],
            translateX: [startx, endx],
            easing: 'easeInExpo',
            duration: 500,
            complete: () => {
                $(target).html(newName)
                resolve()
            }
        });
    })
}

function fadeNameIn(target, startx=100, endx=0){
    return new Promise((resolve, reject) => {
        let timeline = anime.timeline();
        timeline.add({
            targets: target,
            opacity: [0,1],
            translateX: [startx, endx],
            easing: 'easeOutExpo',
            duration: 500,
            complete: () => {
                animating = false;
                resolve();
            }
        });
    })
}

function updateBoard(){
    animating = true;

    if(jsonDoc.team1.name != t1n){
        t1n = jsonDoc.team1.name;
        fadeNameOut('#team1Title', t1n).then(() => {
            fadeNameIn('#team1Title')
        })
    }
    if(jsonDoc.team2.name != t2n){
        t2n = jsonDoc.team2.name;
        fadeNameOut('#team2Title', t2n, 0, -100).then(() => {
            fadeNameIn('#team2Title', -100, 0)
        })
    }

    let fade = {
        out: {
            1:[],
            2:[]
        },
        in: {
            1:[],
            2:[]
        }
    }
    for (let i=1; i<=2; i++){
        fade.out[i] = getFadeOuts(i);
        fade.in[i] = getFadeIns(i, fade.out[i]);
    }
    
    // God forgive me for laddering this
    for (let i=1; i<=2; i++){
        if(fade.out[i].length > 0 || fade.in[i].length > 0){
            animating = true;
            fadePlayersOut(i, getPlayers(i, fade.out[i])).then(() => {
                resizeTeam(i).then(() => {
                    editPlayers(i, fade.in[i]).then(() => {
                        fadePlayersIn(i, getPlayers(i, fade.in[i]))
                    })
                })
            });
        } else {
            animating = false;
        }
    }
}

