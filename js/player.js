Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
let sessionUUID = generateUUID()


//get elements
const video = document.querySelector('video')
const chatdiv = document.querySelector('.flex-container-right')
const fcl = document.querySelector('.flex-container-left')
const description_text = document.querySelector('#description')
const timeplayedel = document.querySelector('#time-played')
const barplayedel = document.querySelector('#bar-played')
const barbufferedel = document.querySelector('#bar-buffered')
const timeallel = document.querySelector('#time-all')
//const mainprevbtn = document.querySelector('#mainprevbtn')
//const touchprevbtn = document.querySelector('#touchprevbtn')
const mainplaybtn = document.querySelector('#mainplaybtn')
const touchplaybtn = document.querySelector('#touchplaybtn')
//const mainnextbtn = document.querySelector('#mainnextbtn')
//const touchnextbtn = document.querySelector('#touchnextbtn')
const mutebtn = document.querySelector('#mutebtn')
const screenshotbtn = document.querySelector('#screenshotbtn')
const settingsbtn = document.querySelector('#settingsbtn')
const settingsclosebtn = document.querySelector('.settings-bg')
const semifsbtn = document.querySelector('#semifsbtn')
const fsbtn = document.querySelector('#fsbtn')
//const secondarymutebtn = document.querySelector('#secondarymutebtn')
const primaryvolumebar = document.querySelector('#primaryvolumebar')
const primaryvolumechangebtn = document.querySelector('#primaryvolumechangebtn')
//const secondaryvolumebar = document.querySelector('#')
//const secondaryvolumechangebtn = document.querySelector('#')
const seekbarbtn = document.querySelector('#seekbarbtn')
const videosettingsdiv = document.querySelector('#videosettingsdiv')
const playeritself = document.querySelector('#playeritself')
const langsel = document.querySelector('#langsel')
const chatcollapsebutton = document.querySelector('#chatcollapsebutton')
const chatcollapse = document.querySelector('#chatcollapse')
const descriptioncollapsebutton = document.querySelector('#descriptioncollapsebutton')
const screenshotextsel = document.querySelector('#screenshotextsel')
const screenshotqsel = document.querySelector('#screenshotqsel')
const videocontrolsbackground = document.querySelector('#videocontrolsbackground')
const gaincontrolinput = document.querySelector('#gaincontrolinput')

let touchscreen = true;//switch betwwen touchscreen mode and mouse mode if user does so
window.addEventListener('mousemove', ()=> {
    if(ignoremousemove) return ignoremousemove = false;
    document.body.dataset.touchscreen = touchscreen = false
})
let ignoremousemove = false;
window.addEventListener('touchend', ()=>{
    ignoremousemove = true;
})
window.addEventListener('touchmove', ()=>{
    ignoremousemove = true;
    document.body.dataset.touchscreen = touchscreen = true
})
window.addEventListener('touchstart', ()=> {
    document.body.dataset.touchscreen = touchscreen = true
}, {passive: false})
/* Should passive: false be the default one?
 * Why without passive: false it creates passive event listeber?
 * Why this breaks another event listener for touchstart on volume and time bars, making event.cancellable == false?
 * Why it does so only on specific devices?
 * Why Artemka Reper tells me that I write bad code?
 * How that works?
 *
 * This doc says that non-passive event listener on touchstart can add at least 500ms delay to scrolling in 1% of scrolls.
 * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#the-problem
 * How? What you should do in that event handler to run for > 0.5s?
 * Why people keeps creating non-existing problems, solving it, and making real ones?
 * Who would read this? Why I wrote this?
 *
 * May be I should use CSS property touch-action: none; instead of event.preventDefault() but no one teaced me that.
 * I don't know how to write code, if you still haven't noticed.
 * Please someone answer all (or some) of this questions. You can contact me via:
 * telepathy,
 * vkontakte https://vk.com/misheus
 * Discord https://discord.com/invite/npe57eJ
 * Twitter https://twitter.com/Mysheus
 * instagram https://www.instagram.com/kawaiiaustralopithecus/
 * Telegram https://t.me/mysheus
 * Github https://github.com/Misheus (github has DMs? I don't know. But I know it has comments on commits!)
 * comments on this site (if in your future I wrote ones)
 */

//set video aspect ratio because CSS property not always work
video.style.height = fcl.scrollWidth/16*9+'px'//is it always working? I don't thinl so... Someone, plese fix this. fixme sometimes this fires too late. maybe defer is not good at all times
function ass() {//set chat height equal to video's
    chatdiv.style.height = video.scrollHeight + 'px'
}
window.addEventListener('resize', ass)
video.addEventListener('loadedmetadata', ()=>{
    //reset video aspect ratio because now it has video's metadata
    video.style.height = ''
    ass()
})
ass()

// Бля, с чего начать? Тут конь не валялся... Думаю, сначала нам нужны данные.
// Сейчас в другом файле я буду пытаться их получать.
//console.log(starttime, chatdata, description)

//convert dates to human form
const dateConverter = new Intl.DateTimeFormat(resolveLoc('lang_code'), {year:"numeric", month:"long",day:"numeric", hour: 'numeric', minute: 'numeric', second: 'numeric'})
const dateConverterNoTime = new Intl.DateTimeFormat(resolveLoc('lang_code'), {year:"numeric", month:"long",day:"numeric"})

document.querySelectorAll('time').forEach(el=>{
    el.innerText = el.dateTime.length>10?dateConverter.format(new Date(el.dateTime)):dateConverterNoTime.format(new Date(el.dateTime));//.format(new Date)
    })



const GET = Object.fromEntries(location.search.substr(1).split("&").map(v => v.split('=')).filter(v => v[0] && typeof v[1] !== "undefined").map(v => [v[0], decodeURIComponent(v[1])]));

if(GET.t){
    if(GET.t.match(/^\d*$/))
        videoSeek( parseInt(GET.t))
    else
        videoSeek(timeToSeconds(GET.t))
}
function timeToSeconds(time) {
    let ass = (/^((?<h>\d*):)?(?<m>\d*):(?<s>\d*)$/g.exec(time) || /^((?<h>\d*)h)?((?<m>\d*)m)?((?<s>\d*)s)?$/g.exec(time) || []).groups || {}
    return (ass.h?parseInt(ass.h)*3600:0)+(ass.m?parseInt(ass.m)*60:0)+(ass.s?parseInt(ass.s):0) || 0;
}

function parseTimecodedText(text) {
    return text.replaceAll('\n', '<br>').replace(/(?:\d{1,2}:)?\d{1,2}:\d{1,2}/g, '<a href="watch?v='+GET.v+'&t=$&" data-timecodelink="$&" data-video="'+GET.v+'">$&</a>')
}
document.addEventListener('click', e=>{
    if(e.target && e.target.dataset && e.target.dataset.timecodelink && e.target.dataset.video === GET.v)
    {
        e.preventDefault()
        videoSeek(timeToSeconds(e.target.dataset.timecodelink))
        history.replaceState(null, "", `/watch?v=${GET.v}&t=${e.target.dataset.timecodelink}`)
    }
})

description_text.innerHTML = parseTimecodedText(description)

let inactivity = 0;
let fullscreenmode = 0;//0 - nofs; 1 - semi-fs; 2 - fs

//fragments wathed. Yes, I cant use video.played.
let fragmentsWathed = [
    {start: 0}
]
let isSeeking = false
let lastTime = 0
video.addEventListener('play', ()=>{
    console.log('play', video.currentTime)
})
video.addEventListener('pause', ()=>{console.log('pause', video.currentTime)})//do I need this?
video.addEventListener('seeking', ()=>{//second
    isSeeking = true
    //console.log('seeking', video.currentTime)
})
video.addEventListener('seeked', ()=>{//forth
    isSeeking = false
    console.log('seeked', lastTime, '->', video.currentTime)
})
video.addEventListener('timeupdate', ()=>{//third
    //console.log('timeupdate', video.currentTime, isSeeking)
    //if(!isSeeking) lastTime = video.currentTime
    if(Math.abs(video.currentTime - lastTime) > 1){//seeked
        if(fragmentsWathed[fragmentsWathed.length-1].start === Math.round(lastTime))
            fragmentsWathed[fragmentsWathed.length-1].start = Math.round(video.currentTime)
        else {
            fragmentsWathed[fragmentsWathed.length-1].end = Math.round(lastTime)
            fragmentsWathed[fragmentsWathed.length] = {start:Math.round(video.currentTime)}
        }
    } else {
        fragmentsWathed[fragmentsWathed.length-1].end = Math.round(video.currentTime)
    }
    lastTime = video.currentTime
    //console.log(fragmentsWathed)
})
function videoSeek(newtime) {//first
    let oldtime = video.currentTime//Are there any other methods to seek the video than using my bar, keys or double tap?
    video.currentTime = newtime
    //console.log('videoSeek', oldtime, newtime)
}


//audio gain
video.addEventListener('play', ()=>{
    let audioContext = new AudioContext()//this shit can not be just writen because google is stupid and not allowing creation audiocontext before user clicks page ( https://goo.gl/7K7WLu ) But this is not autoplay. And how youtube has autoplay? Fuck you, google!
    let acVideo = audioContext.createMediaElementSource(video)
    let gainNode = new GainNode(audioContext, {gain: 1})
    acVideo.connect(gainNode)
    gainNode.connect(audioContext.destination)
    gaincontrolinput.addEventListener('change', ()=>{
        gainNode.gain.value = 10**(parseInt(gaincontrolinput.value)/20)
    })

    //audience retention logger. There is no consistant way of sending data on the end of the session, so we will send data
    //every 30 seconds and in backend using sesiionUUID will use last data recived from session. This way if data transmission
    //at the end of session fails, we will still have some data, just 30 seconds outdated.

    if(location.port === '2053') return//do not send statistics if we are on development port. (I use 2053 port for development server)
    setInterval(()=>{//video.played contain fragment just once ven if it was played many times. I need to write my implementation...
        let fragments = [];
        // for(let i = 0; i<video.played.length; i++) {
        //     fragments.push(Math.round(video.played.start(i))+'-'+Math.round(video.played.end(i)))
        // }
        for (let i = 0; i<fragmentsWathed.length; i++)
        {
            if(fragmentsWathed[i].end) fragments.push(fragmentsWathed[i].start+'-'+fragmentsWathed[i].end)
        }
        console.log(fragments.join(';'))
        fetch(`/api/register_event/fragments_wathed?sessionUUID=${sessionUUID}&v=${GET.v}`, {
            method: 'POST',
            body: fragments.join(';')
        })
    }, 30000)
    document.addEventListener('visibilitychange', function logData() {
        if (document.visibilityState === 'hidden') {//This not means ending session, but it will fire at ending session
            let fragments = [];                     //unload and beforeunload events are broken so this is the only variant
            // for(let i = 0; i<video.played.length; i++) {
            //     fragments.push(Math.round(video.played.start(i))+'-'+Math.round(video.played.end(i)))
            // }
            for (let i = 0; i<fragmentsWathed.length; i++)
            {
                if(fragmentsWathed[i].end) fragments.push(fragmentsWathed[i].start+'-'+fragmentsWathed[i].end)
            }
            navigator.sendBeacon(`/api/register_event/fragments_wathed?sessionUUID=${sessionUUID}&v=${GET.v}`, fragments.join(';'));
            //Somewhere I readed that some adblockers may also block navigator.sendBeacon(), so we still need to send data on timer.
        }
    });
}, {once: true})





fcl.addEventListener('mousemove', ()=> {
    if(touchscreen) return
    inactivity = 0
    playeritself.classList.remove('inactive')
})
setInterval(()=>{
    if(inactivity > 25) {
        playeritself.classList.add('inactive')
    } else if (!video.paused){
        inactivity++
    }
    //updating all shit
    //let buffer =  (video.buffered.length > 0 ? video.buffered.end(video.buffered.length-1):0.0);
    let buffer
    if(!video.buffered.length) buffer = 0.0
    else for(let i = video.buffered.length-1; i>=0; i--)
            if(video.buffered.start(i) < video.currentTime) {
                buffer = video.buffered.end(i);
                break;
            }

    timeplayedel.innerText = secondsToTime(video.currentTime)
    barbufferedel.style.width = (buffer/video.duration*100||0)+"%"
    barplayedel.style.width = (video.currentTime/video.duration*100||0)+"%"
    primaryvolumebar.style.width = video.volume*100+"%"

    if (video.paused) {
        mainplaybtn.firstElementChild.dataset.state =
            touchplaybtn.firstElementChild.dataset.state = 'play'
    } else {
        mainplaybtn.firstElementChild.dataset.state =
            touchplaybtn.firstElementChild.dataset.state = 'pause'
    }

    if(video.muted) mutebtn.firstElementChild.dataset.volume = "m"
    else {
        mutebtn.firstElementChild.dataset.volume = Math.round(video.volume*3)
    }

    if(fullscreenmode === 0) {
        semifsbtn.firstElementChild.dataset.state = 'enter'
        fsbtn.firstElementChild.dataset.fs = 'true'
    } else if(fullscreenmode === 1) {
        semifsbtn.firstElementChild.dataset.state = 'exit'
        fsbtn.firstElementChild.dataset.fs = 'true'
    } else if(fullscreenmode === 2) {
        semifsbtn.firstElementChild.dataset.state = 'enter'
        fsbtn.firstElementChild.dataset.fs = 'false'
    }
}, 100)
let clicked = false
let timeout = null
videocontrolsbackground.addEventListener('click', e => {
    if(e.target !== e.currentTarget) return//ignore childrens
    if (clicked) {
        clearTimeout(timeout)
        clicked = false
        timeout = null
        onvideodoubleclick(e)
    } else {
        clicked = true
        timeout = setTimeout(() => {
            clicked = false
            timeout = null
            onvideosingleclick(e)
        }, 250)
    }
})
function onvideodoubleclick(e) {
    if(touchscreen) {
        if(e.offsetX/videocontrolsbackground.clientWidth>0.5)
            videoSeek(video.currentTime+5)
        else videoSeek(video.currentTime-5)
    } else {
        if(fullscreenmode === 2) {//exit fs
            document.exitFullscreen()
            fullscreenmode = 0;
        } else {
            playeritself.requestFullscreen()
            fullscreenmode = 2;
        }
        playeritself.dataset.fullscreen = fullscreenmode
    }
}
function onvideosingleclick(e) {
    if(touchscreen) {
        if(inactivity<26) inactivity = 26
        else {
            inactivity = 0
            playeritself.classList.remove('inactive')
        }
    } else {
        inactivity = 0
        playeritself.classList.remove('inactive')
        if(video.paused) video.play()
        else video.pause()
    }
}


mainplaybtn.addEventListener('click', ()=>{
    if(video.paused) video.play()
    else video.pause()
})
touchplaybtn.addEventListener('click', ()=>{
    if(video.paused) video.play()
    else video.pause()
})
mutebtn.addEventListener('click', ()=>localStorage.setItem('mute', video.muted = !video.muted))
//secondarymutebtn.addEventListener('click', ()=>video.muted = !video.muted)
settingsbtn.addEventListener('click', ()=> {
    videosettingsdiv.style.display = ''
    //videosettingsdiv.focus()todo move focus to this shit
})
settingsclosebtn.addEventListener('click', ()=> {
    videosettingsdiv.style.display = 'none'
})
semifsbtn.addEventListener('click', ()=>{
    if(fullscreenmode === 1) {//exit fs
        document.exitFullscreen()
        fullscreenmode = 0;
    } else {
        playeritself.requestFullscreen()
        fullscreenmode = 1;
    }
    playeritself.dataset.fullscreen = fullscreenmode
})
fsbtn.addEventListener('click', ()=>{
    if(fullscreenmode === 2) {//exit fs
        document.exitFullscreen()
        fullscreenmode = 0;
    } else {
        playeritself.requestFullscreen()
        fullscreenmode = 2;
    }
    playeritself.dataset.fullscreen = fullscreenmode
})
document.addEventListener('fullscreenchange', ()=>{
    if(!document.fullscreenElement)
        playeritself.dataset.fullscreen = fullscreenmode = 0;
})
if(!localStorage.getItem('screenshotJpgQuality')) localStorage.setItem('screenshotJpgQuality', "90")
if(!localStorage.getItem('screenshotExt')) localStorage.setItem('screenshotExt', "jpg")
screenshotqsel.value = parseInt(localStorage.getItem('screenshotJpgQuality'))
screenshotextsel.value = localStorage.getItem('screenshotExt')
screenshotqsel.addEventListener('change', ()=>{
    localStorage.setItem('screenshotJpgQuality', screenshotqsel.value)
})
screenshotextsel.addEventListener('change', ()=>{
    localStorage.setItem('screenshotExt', screenshotextsel.value)
})

const canvas = document.createElement('canvas')
canvas.width = video.videoWidth
canvas.height = video.videoHeight
canvas.promiseBlob = function(mimeType, qualityArgument) {
    return new Promise(resolve => this.toBlob(resolve, mimeType, qualityArgument))
};
let EbanyiScreenhotTrys = 0
async function doEbanyiScreenshot() {
    //for some unknown strange reasons context.drawImage() doesnt always work. Sometimes canvas remains transparent.
    let context = canvas.getContext('2d')
    //while(!context.getImageData(0, 0, 1, 1).data[3])//check top left pixel opacity
    //try first time
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    if(!context.getImageData(0, 0, 1, 1).data[3])//check top left pixel opacity
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)//try second time
    if(!context.getImageData(0, 0, 1, 1).data[3])//check top left pixel opacity
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)//try third time
    if(!context.getImageData(0, 0, 1, 1).data[3]) { //check top left pixel opacity
        if(EbanyiScreenhotTrys > 4) {
            //giving up
            EbanyiScreenhotTrys = 0;
            alert(resolveLoc('screenshot.error'))
            return
        }
        setTimeout(doEbanyiScreenshot, 100)//wait 100ms and try again from start
        EbanyiScreenhotTrys++
        return
    }
    EbanyiScreenhotTrys = 0;
    let url = window.URL.createObjectURL(await canvas.promiseBlob(
        localStorage.getItem('screenshotExt')==='png'?'image/png':'image/jpeg',
        parseInt(localStorage.getItem('screenshotJpgQuality'))/100))
    let a = document.createElement('a')
    a.href = url
    a.download = `${GET.v}-${secondsToTime(video.currentTime)}.${localStorage.getItem('screenshotExt')}`
    a.click()
}
let isvoluming = false
primaryvolumechangebtn.addEventListener('mousedown', e=> {
    isvoluming = true
    e.preventDefault()
    changevolume(e)
})
primaryvolumechangebtn.addEventListener('touchstart', e=> {
    isvoluming = true
    e.preventDefault()
    changevolume(e)
})
document.addEventListener('mouseup', e=> {
    isvoluming = false
})
document.addEventListener('touchend', e=> {
    isvoluming = false
})
document.addEventListener('mousemove', e=>{
    if (!isvoluming) return
    changevolume(e)
})
document.addEventListener('touchmove', e=>{
    if (!isvoluming) return
    changevolume(e)
})
function changevolume(e) {
    //console.log(e)
    let vol = ((e.x!==undefined?e.x:e.changedTouches[0].clientX)-(primaryvolumechangebtn.getBoundingClientRect().left + window.scrollX))/primaryvolumechangebtn.clientWidth
    if(vol > 1) vol = 1
    else if(vol < 0) vol = 0
    video.volume = vol
    localStorage.setItem('volume', vol)
}

screenshotbtn.addEventListener('click', doEbanyiScreenshot)
video.addEventListener('loadedmetadata', ()=>{
    timeallel.innerText = secondsToTime(video.duration)

    let isseaking = false
    seekbarbtn.addEventListener('mousedown', e=> {
        isseaking = true
        e.preventDefault()
        seek(e)
    })
    seekbarbtn.addEventListener('touchstart', e=> {
        isseaking = true
        e.preventDefault()
        seek(e)
    })
    document.addEventListener('mouseup', ()=> {
        isseaking = false
    })
    document.addEventListener('touchend', ()=> {
        isseaking = false
    })
    document.addEventListener('mousemove', e=>{
        if (!isseaking) return
        seek(e)
    })
    document.addEventListener('touchmove', e=>{
        if (!isseaking) return
        seek(e)
    })
    function seek(e) {
        //console.log(e)
        videoSeek(((e.x!==undefined?e.x:e.changedTouches[0].clientX)-(seekbarbtn.getBoundingClientRect().left + window.scrollX))/seekbarbtn.clientWidth*video.duration)
    }
})

document.addEventListener('keydown', e=>{
    if(document.activeElement.tagName === 'INPUT') return
    //console.log(e.code);
    inactivity = 0
    playeritself.classList.remove('inactive')
    switch (e.code) {
        case 'ArrowUp':
            e.preventDefault()
            localStorage.setItem('volume',video.volume = video.volume+.05>1?1:video.volume+.05)
            break;
        case 'ArrowDown':
            e.preventDefault()
            localStorage.setItem('volume',video.volume = video.volume-.05<0?0:video.volume-.05)
            break;
        case 'ArrowLeft':
            e.preventDefault()
            videoSeek(video.currentTime - 5)
            break;
        case 'ArrowRight':
            e.preventDefault()
            videoSeek(video.currentTime + 5)
            break;
        case 'KeyJ':
            videoSeek(video.currentTime - 10)
            break;
        case 'Space':
        case 'KeyK':
            e.preventDefault()
            if(video.paused) video.play()
            else video.pause()
            break;
        case 'KeyL':
            videoSeek(video.currentTime + 10)
            break;
        case 'KeyM':
            localStorage.setItem('mute', video.muted = !video.muted)
            break;
        case 'KeyF':
            if(fullscreenmode === 2) {//exit fs
                document.exitFullscreen()
                fullscreenmode = 0;
            } else {
                playeritself.requestFullscreen()
                fullscreenmode = 2;
            }
            playeritself.dataset.fullscreen = fullscreenmode
            break;
    }
})


//chat
if(chat){
(async ()=>{

    let badges

    try {
        if(chat[0].tags) { //twitch chat
            badges = (await (await fetch('https://badges.twitch.tv/v1/badges/global/display')).json()).badge_sets
        }
    } catch (e) {}
    if(!badges) badges = {}

    let twitchChatColors = [
        "rgb(255, 0, 0)",
        "rgb(0, 0, 255)",
        "rgb(0, 128, 0)",
        "rgb(178, 34, 34)",
        "rgb(255, 127, 80)",
        "rgb(154, 205, 50)",
        "rgb(255, 69, 0)",
        "rgb(46, 139, 87)",
        "rgb(218, 165, 32)",
        "rgb(210, 105, 30)",
        "rgb(95, 158, 160)",
        "rgb(30, 144, 255)",
        "rgb(255, 105, 180)",
        "rgb(138, 43, 226)",
        "rgb(0, 255, 127)"
    ]
    let twitchUsersColors = {}

    function convertTwitchEmoji(msg, em)
    {
        if(!em)return escapeHtml(msg);

        let emlist = [];
        let ems = Object.keys(em);
        for(let i = 0; i < ems.length; i++)
        {
            for(let j = 0; j < em[ems[i]].length; j++)
            {
                let pos = em[ems[i]][j].split('-');
                emlist.push({
                    id: ems[i],
                    start: parseInt(pos[0]),
                    end: parseInt(pos[1])
                })
            }
        }

        emlist.sort((a, b) => {
            if (a.start < b.start) return -1;
            if (a.start > b.start) return 1;
            return 0;
        })

        let res = '';

        for(let i = 0; i < emlist.length; i++)
        {
            res += escapeHtml(msg.slice((((emlist[i-1] || {end: -1}).end)+1), emlist[i].start));
            res += '<img class="ytemoji" src="https://static-cdn.jtvnw.net/emoticons/v2/'+emlist[i].id+'/default/light/1.0" alt="'+escapeHtml(msg.slice(emlist[i].start, emlist[i].end+1))+'">'//'<'+emlist[i].id+'>';
        }
        res += escapeHtml(msg.slice((emlist[emlist.length-1].end+1)));

        return res;
    }


    function secToTime(sec_num) {
        sec_num = Math.round(sec_num);
        let days = Math.floor(sec_num / 86400);
        let hours   = Math.floor((sec_num - days * 86400) / 3600);
        let minutes = Math.floor((sec_num - days * 86400 - (hours * 3600)) / 60);
        let seconds = sec_num - days * 86400 - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return ((days>0)?(days+resolveLoc('daysshort')+'. '):(''))+((hours>0)?(hours+':'):(''))+minutes+':'+seconds
    }
    function convertTime(time) {
        let curtime = Date.parse(time);
        if(isNaN(starttime))return resolveLoc('notavailableshort');
        let delta = (curtime-starttime)/1000;
        return (delta >= 0) ? ('+' + secToTime(delta)) : ('-' + secToTime(-delta));
    }
    const YTemoji = ['yt', 'oops','buffering','stayhome','dothefive','elbowbump','goodvibes','thanksdoc',
        'videocall','virtualhug','yougotthis','sanitizer','takeout','hydrate','chillwcat','chillwdog','elbowcough',
        'learning','washhands','socialdist','shelterin'];
    function convertYTemoji(msg) {
        let len = msg.length;
        let res = '';
        let c = 0;
        for (let i = 0; i<len-1; i++)
        {
            if (msg[i] === ':' && msg[i+1] !== ' ')
            {
                for (let j=0; j<YTemoji.length; j++)
                {
                    if(msg.slice(i+1, i+2+YTemoji[j].length) === YTemoji[j]+':')
                    {
                        res+=msg.slice(c, i);
                        res+='<img class="ytemoji" src="emoji/'+YTemoji[j]+'.png" alt=":'+YTemoji[j]+':">';
                        c = i+2+YTemoji[j].length;
                    }
                }
            }
        }
        res+=msg.slice(c);
        return res;
    }
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const chatdiv = document.querySelector('.chat-messages')
    let yt = !!chat[0].snippet,
        index = 0,
        lasttime = 0,
        startindex = -1,
        db = false,
        initialSkip = false;

    let lastmsg //элемент последнего на проигрываемый момент сообщения
    let scrolledup = false //переменная для определения, прокрутили ли мы чат вверх
    chatdiv.parentElement.addEventListener('scroll', ()=>{
        if(lastmsg) scrolledup = chatdiv.parentElement.scrollTop < lastmsg.offsetTop-chatdiv.parentElement.offsetTop-chatdiv.parentElement.offsetHeight+lastmsg.offsetHeight-5
    })
    function scrollChat(){
        if(!scrolledup && lastmsg) chatdiv.parentElement.scroll(0, lastmsg.offsetTop-chatdiv.parentElement.offsetTop-chatdiv.parentElement.offsetHeight+lastmsg.offsetHeight)
    }
    window.addEventListener('resize', scrollChat)

    video.ontimeupdate = () => {
        let now = starttime+video.currentTime*1000
        if(Math.abs(video.currentTime - lasttime) > 300) {//перемотали //todo при перемотке назад проверять, отрисовано ли уже сообщение, которое нужно будет показать и, если да - пролистывать, а если нет - переинициализировать чат.
            chatdiv.innerHTML = '';
            lasttime = video.currentTime
            if(video.currentTime < 300)
            {
                initialSkip = true
                index = 0
                startindex = -1
                db = false
            }
            else {
                for (let i = 0; i < chat.length; i++) {
                    if (now - (yt?Date.parse(chat[i].snippet.publishedAt):parseInt(chat[i].tags["tmi-sent-ts"])) < 300000) {//todo
                        initialSkip = true;
                        index = i;
                        let newmsg = document.createElement('div');
                        newmsg.innerHTML = '<strong style="cursor: help;" title="'+resolveLoc('chat.hiddenmessages.hint')+'" onclick="alert(this.title)">'+resolveLoc('chat.hiddenmessages.text')+'</strong>';
                        newmsg.style.textAlign = 'center';
                        newmsg.id = 'skipedmsg'
                        chatdiv.appendChild(newmsg)
                        //chatdiv.parentElement.scroll(0, chatdiv.parentElement.scrollHeight - chatdiv.parentElement.offsetHeight)
                        startindex = index - 1
                        break
                    }
                }
            }
            if(!initialSkip)//В списке сообщений не нашлось подходящих вероятно, GET.t > video.duration, который браузер
                return;//ещё не знает или сообщения закончились раньше видео.
            console.log(index)
        } else if(!initialSkip)
            initialSkip = true
        else if(video.currentTime < lasttime || db){ //перематали назад
            db = true
            for(let i=startindex; i>=0; i--)
            {
                if((now - (yt?Date.parse(chat[i].snippet.publishedAt):parseInt(chat[i].tags["tmi-sent-ts"])) < 300000 || video.currentTime <= 2))
                {//display
                    displayChatMessage(chat[i], false)
                }
                else{
                    startindex = i;
                    db = false
                    break
                }
                if(startindex -i > 100){
                    startindex = i;
                    break
                }
                if(i===0) {
                    db = false
                    document.getElementById('skipedmsg').remove()
                    startindex = -1
                }
            }
        }
        lasttime = video.currentTime
        for(let i=index; i < chat.length; i++)
        {
            let msg = (yt?new Date(chat[i].snippet.publishedAt).getTime():parseInt(chat[i].tags["tmi-sent-ts"]))
            if(msg <= now || video.currentTime+2 >= video.duration)
            {
                displayChatMessage(chat[i])
                //chatdiv.parentElement.scroll(0, chatdiv.parentElement.scrollHeight - chatdiv.parentElement.offsetHeight)
                if(i === chat.length-1) index = chat.length
            }
            /*else if(msg > now && i === index) {
                //видео перемотали назад
                //Не знаю, что делать в таком случае, но обрабатывать его тут.
                //На самом деле нет. Ту дурак. Всего лишь сообщение, до которого не дошли,
                // а вот если i==index, то да. НЕТ. Ты дурак x2
                console.log('отмотал назад')
            }*/
            else {
                index = i
                break
            }
        }
        if(chat[index-1] && ((yt?Date.parse(chat[index-1].snippet.publishedAt):parseInt(chat[index-1].tags["tmi-sent-ts"]))-starttime)/1000 - video.currentTime > 0)
        {
            //console.log('Мы в прошлом, относительно чата')
            console.time('shit')
            for (let i=index-1 ;i>=0; i--)
            {
                if(((yt?Date.parse(chat[i].snippet.publishedAt):parseInt(chat[i].tags["tmi-sent-ts"]))-starttime)/1000 - video.currentTime <= 0)
                {
                    let el = document.getElementById((yt?Date.parse(chat[i].snippet.publishedAt):parseInt(chat[i].tags["tmi-sent-ts"])))
                    //console.log(el)
                    if(el)
                    {
                        lastmsg = el
                        scrollChat() //исправленный скролл при небольшой перемотке назад
                    }
                    else chatdiv.parentElement.scroll(0, 0)
                    console.timeEnd('shit')
                    return;//todo сделать оптимизацию. Не перебирать каждый раз все элементы с конца, а только предыдущий
                }
            }
            console.timeEnd('shit')
        }
        //else console.log('Мы в настоящем, относительно чата')
        //scroll to определённый elemrnt ($0)
        // $0.parentNode.scroll(0, $0.offsetTop-$0.parentNode.offsetHeight+$0.offsetHeight)
    }
    //console.log('call shit')
    video.ontimeupdate(undefined)



    function displayChatMessage(msg, toEnd = true) {
        //console.log(msg)
        //console.log(msg.authorDetails.displayName + ' - ' + msg.snippet.displayMessage)
        /*if(!chat[0].snippet)//crutch to transform twitch chat to youtube format
        {
            msg = {
                "snippet": {
                    "type": "textMessageEvent",
                    "authorChannelId": msg.tags.username,
                    "publishedAt": new Date(parseInt(msg.tags["tmi-sent-ts"])).toISOString(),
                    "displayMessage": msg.message,
                    "textMessageDetails": {
                        "messageText": msg.message
                    }
                },
                "authorDetails": {
                    "channelId": msg.tags.username,
                    "channelUrl": "https://www.twitch.tv/"+msg.tags.username,
                    "displayName":  msg.tags["display-name"],
                    "profileImageUrl": "",//to do
                    "isVerified": false,//to do
                    "isChatOwner": false,//to do
                    "isChatSponsor": false,//to do
                    "isChatModerator": false//to do
                }
            }
        }*/

        let newmsg = document.createElement('div');
        newmsg.classList.add('chat-message')
        if(msg.snippet) {//youtube chat
            newmsg.id = Date.parse(msg.snippet.publishedAt)
            newmsg.innerHTML =
                '<a href="'+msg.authorDetails.channelUrl+'" target="_blank" class="chat-pfp">' +
                '<img alt="" src="'+msg.authorDetails.profileImageUrl.replace('yt3.ggpht.com', 'yt4.ggpht.com')+'">' +
                '</a>' +
                '<div class="message-text">' +
                '<span class="chat-time" onclick="videoSeek('+(Date.parse(msg.snippet.publishedAt)-starttime)/1000+')">'+convertTime(msg.snippet.publishedAt)+' </span>' +
                '<span class="chat-name '+
                (msg.authorDetails.isChatModerator?'moder ':'') +
                (msg.authorDetails.isChatOwner?'owner ':'') +
                (msg.authorDetails.isVerified?'verifed ':'') +
                '">'+
                escapeHtml(msg.authorDetails.displayName) + ((msg.authorDetails.isVerified)?('<img class="chaticon" alt="" src="icons/ytverifed'+
                    ((msg.authorDetails.isChatModerator)?('moder'):((msg.authorDetails.isChatOwner)?('owner'):('')))+
                    '.svg">'):(''))+
                ((msg.authorDetails.isChatModerator)?('<img class="chaticon" alt="" src="icons/ytmoder.svg">'):('')) +': ' +
                '</span>'+
                '<span class="chattext">' +
                convertYTemoji(escapeHtml(msg.snippet.displayMessage))
                + '</span>' +
                '</div>'
        } else {//twitch chat
            let msgbadgestext = ''
            let userbadges = Object.keys(msg.tags.badges || {})

            for(let i = 0; i < userbadges.length; i++) {
                let badge = badges[userbadges[i]].versions[msg.tags.badges[userbadges[i]]]
                msgbadgestext+=
                    '<a '+(badge.click_action==='visit_url'?'href="'+badge.click_url+'" target="_blank"':'')+ ' class="twitch-badge">' +
                    '<img src="'+badge.image_url_1x+'" alt="'+badge.title+' badge" title="'+badge.title+'">' +
                    '</a>'
            }

            if(!msg.tags.color && ! twitchUsersColors[msg.tags.username])
                twitchUsersColors[msg.tags.username] = twitchChatColors.random()

            newmsg.id = msg.tags["tmi-sent-ts"]
            newmsg.innerHTML =
                /*'<a href="'+msg.authorDetails.channelUrl+'" target="_blank" class="chat-pfp">' +
                '<img alt="" src="'+msg.authorDetails.profileImageUrl+'">' +//if I will want avatrs in chat for twitch
                '</a>' +*/
                '<div class="message-text">' +
                    '<span class="chat-time" onclick="videoSeek('+(parseInt(msg.tags["tmi-sent-ts"])-starttime)/1000+')">'+convertTime(new Date(parseInt(msg.tags["tmi-sent-ts"])).toISOString())+' </span>' +
                    '<span class="chat-name" style="color: '+(msg.tags.color?msg.tags.color:twitchUsersColors[msg.tags.username])+'">'+
                        msgbadgestext +
                        '<a href="https://www.twitch.tv/'+msg.tags.username+'" target="_blank" class="twitch-name">' +
                            escapeHtml(msg.tags["display-name"]) +
                        '</a>' + ': ' +
                    '</span>'+
                    '<span class="chattext">' +
                        convertTwitchEmoji(msg.message, msg.tags.emotes) +
                    '</span>' +
                '</div>'
        }

        if(toEnd) {
            chatdiv.appendChild(newmsg)
            lastmsg = newmsg
            scrollChat() //исправленный скролл при инициализации сообщений
        }
        else {
            document.getElementById('skipedmsg').after(newmsg)
        }
    }
})()
} else {
    document.body.dataset.nochat = 'true'
}


//collapse button
chatcollapsebutton.addEventListener('click', ()=>{
    if(chatcollapse.dataset.collapsed === "true") {
        chatcollapse.dataset.collapsed = "false"
        chatcollapsebutton.innerHTML = resolveLoc('collapse')
    } else {
        chatcollapse.dataset.collapsed = "true"
        chatcollapsebutton.innerHTML = resolveLoc('expand')
    }
})
descriptioncollapsebutton.addEventListener('click', ()=>{
    if(description_text.dataset.collapsed === "true") {
        description_text.dataset.collapsed = "false"
        descriptioncollapsebutton.innerHTML = resolveLoc('collapse')
} else {
        description_text.dataset.collapsed = "true"
        descriptioncollapsebutton.innerHTML = resolveLoc('expand')
}
})


function secondsToTime(time){

    let h = Math.floor(time / (60 * 60)),
        dm = time % (60 * 60),
        m = Math.floor(dm / 60),
        ds = dm % 60,
        s = Math.floor(ds),
        fulltime;
    if (s === 60) {
        s = 0;
        m = m + 1;
    }
    if (s < 10) {
        s = '0' + s;
    }
    if (m === 60) {
        m = 0;
        h = h + 1;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (h === 0) {
        fulltime = m + ':' + s;
    } else {
        fulltime = h + ':' + m + ':' + s;
    }
    return fulltime;
}

langsel.value = Cookies.get('lang')
video.volume = localStorage.getItem('volume')?parseFloat(localStorage.getItem('volume')):0.75
if(localStorage.getItem('mute')==='true') video.muted = true

langsel.addEventListener('change', ()=>{
    if(langsel.value !== Cookies.get('lang'))
    {
        Cookies.set('lang', langsel.value, { expires: 365, path: '/' })
        window.location.reload()
    }
})
