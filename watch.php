<?php

require "lib/language.php";

if(!isset($_GET['v']) || !file_exists($_GET['v']))
{
    http_response_code(404);
    die(resolveLoc("video_not_exists"));
}
$video = $_GET['v'];

$videoname = pathinfo($video, PATHINFO_FILENAME);

$starttime = '';
if(!file_exists("startTimes/$videoname"))
    $starttime = substr($videoname, 0, 10);
else $starttime = file_get_contents("startTimes/$videoname");

$chat = '';
if(!file_exists("chat/$videoname.json"))
    $chat = "false";
else $chat = file_get_contents("chat/$videoname.json");

$description = '';
if(!file_exists("../mysheus.ru/MeeThya/sayastreams_songlists_forplayer/$videoname.txt"))
    $description = resolveLoc("description_not_found");//"Не удалось загрузить описание. Скорее всего его просто нет.";
else $description = file_get_contents("../mysheus.ru/MeeThya/sayastreams_songlists_forplayer/$videoname.txt");

$streamname = '';
if(!file_exists("names/$videoname"))
    $streamname = "⭐stream⭐";
else $streamname = file_get_contents("names/$videoname");

date_default_timezone_set('Europe/Moscow');
$starttimeformated = '';
if(!strcmp(resolveLoc('lang_code'), 'ru'))
    $starttimeformated = date("d F Y г., H:i:s", strtotime($starttime)); //Russian
else
    $starttimeformated = date("F j, Y, g:i:s a", strtotime($starttime)); //English
//This is wrong. Exists IntlDateFormatter.
//Should we use user's timezone or Saya's timezone (Europe/Moscow)?

//$fmt = datefmt_create( // gives Error: Call to undefined function datefmt_create()
//    resolveLoc('lang_code'),
//    IntlDateFormatter::LONG,
//    IntlDateFormatter::LONG,
//    'Europe/Moscow',
//    IntlDateFormatter::GREGORIAN
//);
//$starttimeformated = datefmt_format($fmt, strtotime($starttime));
?>

<!DOCTYPE html>
<html lang="<?php echo resolveLoc('lang_code'); ?>">
<head>
    <meta charset="UTF-8">
    <script>
        //data from php. If you looking for it, it located in /startTimes and /chat in files named like video
        const starttime = new Date("<?php echo $starttime; ?>").getTime(),
            chat = <?php echo $chat ?>,
            description = `<?php echo $description ?>`;
    </script>
    <?php getJSIntegration() ?>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js"></script>
<!--А если еблокнига теперь называется мета, значит ли это, что нам теперь нужно платить за использование <meta> тегов???-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Смотри удалённые записи стримов Сайи на sayastreams.mysheus.ru!">
    <meta property="og:title" content="<?php echo "$streamname, $starttimeformated"; ?> – sayastreams.mysheus.ru" />
    <meta property="og:type" content="video.other" />
    <meta property="og:video" content="../2020-05-16.mp4" />
    <meta property="og:video:secure_url" content="../2020-05-16.mp4" />
    <meta property="og:video:type" content="video/mp4" />
    <meta property="og:video:width" content="1280" />
    <meta property="og:video:height" content="720" />
    <meta property="og:image" content="https://sayastreams.mysheus.ru/covers/<?php echo $videoname ?>.jpg">
    <title><?php echo "$streamname, $starttimeformated"; ?> – sayastreams.mysheus.ru</title>
    <link type="text/css" rel="stylesheet" href="/css/reset.css">
    <link type="text/css" rel="stylesheet" href="/css/player2.css">
    <link type="text/css" rel="stylesheet" href="/css/btns-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;500&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
</head>
<body data-touchscreen="true">
    <main>
        <div class="flex-container" id="playeritself" data-fullscreen="0">
            <div class="flex-container-left">
                <video src="<?php echo $video ?>"></video>
                <div class="video-controls" id="videocontrolsbackground">
                    <div class="video-controls-top">
                        <h2 class="player-name"><?php echo $streamname; ?>, <em><time datetime="<?php echo $starttime; ?>"></time></em></h2>
                    </div>
                    <div class="video-controls-middle">
                        <div class="video-controls-middle-inner">
                            <button class="btn player-btn video-controls-middle-btn work-in-progress" id="touchprevbtn">
                                <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                    <path d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z" class="" fill="currentColor"/>
                                </svg>
                            </button>
                            <button class="btn player-btn video-controls-middle-btn" id="touchplaybtn">
                                <svg focusable="false" data-state="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="play-btn-icon btn-icon">
                                    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" class="play-btn-icon-play" fill="currentColor"/>
                                    <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" class="play-btn-icon-pause" fill="currentColor"/>
                                </svg>
                            </button>
                            <button class="btn player-btn video-controls-middle-btn work-in-progress" id="touchnextbtn">
                                <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                    <path d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z" class="" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="video-controls-bottom">
                        <div class="video-controls-bottom-inner">
                            <div class="time-bar-outer">
                                <span id="time-played">00:00</span>
                                <div class="time-bar">
                                    <div class="bar-played bar-part" style="width: 0;" id="bar-played"></div>
                                    <div class="bar-loaded bar-part" style="width: 0;" id="bar-buffered"></div>
                                    <div class="bar-part" id="seekbarbtn"></div>
                                </div>
                                <span id="time-all">00:00</span>
                            </div>
                            <div class="bottom-btns">
                                <button class="btn player-btn work-in-progress" id="mainprevbtn">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                        <path d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z" class="" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn" id="mainplaybtn">
                                    <svg focusable="false" data-state="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="play-btn-icon btn-icon">
                                        <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" class="play-btn-icon-play" fill="currentColor"/>
                                        <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" class="play-btn-icon-pause" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn work-in-progress" id="mainnextbtn">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                        <path d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z" class="" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn" id="mutebtn">
                                    <svg focusable="false" data-volume="3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="volume-btn-icon btn-icon">
                                        <path d="M215,71.1l-89,89H24c-13.3,0-24,10.7-24,24v144c0,13.3,10.7,24,24,24h102.1l89,89c15,15,41,4.5,41-17V88 C256,66.6,230,56,215,71.1z" class="volume-btn-icon-base" fill="currentColor"/>
                                        <path d="M338.2,179.1c-11.6-6.3-26.2-2.2-32.6,9.4c-6.4,11.6-2.2,26.2,9.5,32.6C328,228.3,336,241.6,336,256 c0,14.4-8,27.7-20.9,34.8c-11.6,6.4-15.8,21-9.5,32.6c6.4,11.7,21,15.8,32.6,9.5c28.2-15.5,45.8-45,45.8-76.9 S366.5,194.7,338.2,179.1L338.2,179.1z" class="volume-btn-icon-1" fill="currentColor"/>
                                        <path d="M480,256c0-63.5-32.1-121.9-85.8-156.2c-11.2-7.1-26-3.8-33.1,7.5s-3.8,26.2,7.4,33.4C408.3,166,432,209.1,432,256 s-23.7,90-63.5,115.4c-11.2,7.1-14.5,22.1-7.4,33.4c6.5,10.4,21.1,15.1,33.1,7.5C447.9,377.9,480,319.5,480,256z" class="volume-btn-icon-2" fill="currentColor"/>
                                        <path d="M448.4,20c-11.2-7.3-26.2-4.2-33.5,7c-7.3,11.2-4.2,26.2,7,33.5C488.1,103.9,527.6,177,527.6,256s-39.5,152.1-105.8,195.6 c-11.2,7.3-14.3,22.3-7,33.5c7,10.7,21.9,14.6,33.5,7C528.3,439.6,576,351.3,576,256S528.3,72.4,448.4,20z" class="volume-btn-icon-3" fill="currentColor"/>
                                        <path d="M461.6,256l45.6-45.6c6.3-6.3,6.3-16.5,0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8,0L416,210.4l-45.6-45.6 c-6.3-6.3-16.5-6.3-22.8,0l-22.8,22.8c-6.3,6.3-6.3,16.5,0,22.8l45.6,45.6l-45.6,45.6c-6.3,6.3-6.3,16.5,0,22.8l22.8,22.8 c6.3,6.3,16.5,6.3,22.8,0l45.6-45.6l45.6,45.6c6.3,6.3,16.5,6.3,22.8,0l22.8-22.8c6.3-6.3,6.3-16.5,0-22.8L461.6,256z" class="volume-btn-icon-cross" fill="currentColor"/>
                                    </svg>
                                </button>
<!--                                <input class="volume-primary" type="range" min="0" max="100" id="volumebarbtn">-->
                                <div class="volume-primary">
                                    <div class="bar-part" id="primaryvolumebar"></div>
                                    <div class="bar-part" id="primaryvolumechangebtn"></div>
                                </div>
                                <button class="btn player-btn right-btn" id="settingsbtn">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="btn-icon">
                                        <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" class="" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn" id="screenshotbtn">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 91.27" class="btn-icon">
                                        <path d="M87.29,16.88A11.35,11.35,0,1,1,75.94,28.23,11.35,11.35,0,0,1,87.29,16.88Zm27.33,74.39H8.26a8.27,8.27,0,0,1-5.83-2.44h0A8.24,8.24,0,0,1,0,83V8.26A8.26,8.26,0,0,1,2.42,2.42h0A8.26,8.26,0,0,1,8.26,0H114.62a8.26,8.26,0,0,1,5.83,2.43h0a8.26,8.26,0,0,1,2.42,5.84V83a8.24,8.24,0,0,1-2.42,5.83h0a8.27,8.27,0,0,1-5.83,2.44Zm-7.35-9.43L87.6,50.46a4.52,4.52,0,0,0-7.65,0L70.66,65.39,80.77,81.84H76.62l-27.57-44c-2.54-3.39-6.61-3.13-8.88,0l-27,44H9.42V9.42h104V81.84Z" fill="currentColor" style="fill-rule:evenodd;"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn" id="semifsbtn">
                                    <svg focusable="false" data-state="enter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="sfscr-btn-icon btn-icon">
                                        <path d="M10.2,106.8v303.3c0,33.5,27.1,60.6,60.6,60.6h363.4c33.5,0,60.6-27.1,60.6-60.6V106.9c0-33.4-27.1-60.6-60.6-60.6H70.6 l0,60.8h211.7l0.2,302.8l60.8,0V107.4l90.9-0.3l0,302.8l-363.6,0l0-363.6h0C37.2,46.4,10.2,73.4,10.2,106.8z" class="sfscr-btn-icon-enter" fill="currentColor"/>
                                        <path d="M70.6,398.2l0-291l0,0h211.9v79.1l60.8-60.8v-18.3l18.3,0l60.8-60.8H70.6h0c-33.4,0-60.5,27.1-60.5,60.5v303.3 c0,13.7,4.5,26.3,12.2,36.4L0,468.9L43.1,512L511.6,43.6L468.4,0.4L70.6,398.2z" class="sfscr-btn-icon-exit" fill="currentColor"/>
                                        <path d="M434.2,410l-90.9,0V298l-60.7,60.7V410l-51.2,0c-3.6,3.6-46.5,45.1-60.8,60.7h263.4c33.5,0,60.6-27.1,60.6-60.6V146.7 l-60.5,60.5L434.2,410z" class="sfscr-btn-icon-exit" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button class="btn player-btn" id="fsbtn">
                                    <svg focusable="false" data-fs="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="fs-btn-icon btn-icon">
                                        <path d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" class="fs-btn-icon-enter-fs" fill="currentColor"/>
                                        <path d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z" class="fs-btn-icon-exit-fs" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="video-settings" style="display: none;" id="videosettingsdiv">
                    <div class="settings-bg"></div>
                    <ul>
                        <li>
                            <label for="langsel"><?php echo resolveLoc('language'); ?>:</label>
                            <select class="right-btn" id="langsel">
                                <option value="en">English</option>
                                <option value="ru">Русский</option>
                            </select>
                        </li>
                        <li>
                            <label for="screenshotextsel"><?php echo resolveLoc('screenshot.select.type'); ?>:</label>
                            <select class="right-btn" id="screenshotextsel">
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                            </select>
                        </li>
                        <li>
                            <label for="screenshotqsel"><?php echo resolveLoc('screenshot.select.jpg.quality'); ?>:</label>
                            <input class="right-btn" id="screenshotqsel" type="number" min="0" max="100">
                        </li>
                        <li class="work-in-progress"><?php echo resolveLoc('loop'); ?>: <button class="right-btn"><?php echo resolveLoc('yes'); ?></button><button class="settings-selected-btn"><?php echo resolveLoc('no'); ?></button></li>
                        <li class="work-in-progress"><input class="right-btn" type="text"><button>[</button> – <input type="text"><button>]</button></li>
                        <li class="work-in-progress"><?php echo resolveLoc('marksongstimeline'); ?>: <button class="right-btn settings-selected-btn"><?php echo resolveLoc('yes'); ?></button><button><?php echo resolveLoc('no'); ?></button></li>
                        <li class="work-in-progress"><?php echo resolveLoc('workingmode'); ?>: <button class="right-btn"><?php echo resolveLoc('touch'); ?></button><button><?php echo resolveLoc('mouse'); ?></button><button class="settings-selected-btn"><?php echo resolveLoc('auto'); ?></button></li>
                        <li class="work-in-progress"><?php echo resolveLoc('autoplay'); ?>: <button class="right-btn settings-selected-btn"><?php echo resolveLoc('yes'); ?></button><button><?php echo resolveLoc('no'); ?></button></li>
<!--                        <li class="volume-secondary" id="secondarymutebtn">-->
<!--                            <button>-->
<!--                                <svg focusable="false" data-volume="3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="volume-btn-icon btn-icon">-->
<!--                                    <path d="M215,71.1l-89,89H24c-13.3,0-24,10.7-24,24v144c0,13.3,10.7,24,24,24h102.1l89,89c15,15,41,4.5,41-17V88 C256,66.6,230,56,215,71.1z" class="volume-btn-icon-base" fill="currentColor"/>-->
<!--                                    <path d="M338.2,179.1c-11.6-6.3-26.2-2.2-32.6,9.4c-6.4,11.6-2.2,26.2,9.5,32.6C328,228.3,336,241.6,336,256 c0,14.4-8,27.7-20.9,34.8c-11.6,6.4-15.8,21-9.5,32.6c6.4,11.7,21,15.8,32.6,9.5c28.2-15.5,45.8-45,45.8-76.9 S366.5,194.7,338.2,179.1L338.2,179.1z" class="volume-btn-icon-1" fill="currentColor"/>-->
<!--                                    <path d="M480,256c0-63.5-32.1-121.9-85.8-156.2c-11.2-7.1-26-3.8-33.1,7.5s-3.8,26.2,7.4,33.4C408.3,166,432,209.1,432,256 s-23.7,90-63.5,115.4c-11.2,7.1-14.5,22.1-7.4,33.4c6.5,10.4,21.1,15.1,33.1,7.5C447.9,377.9,480,319.5,480,256z" class="volume-btn-icon-2" fill="currentColor"/>-->
<!--                                    <path d="M448.4,20c-11.2-7.3-26.2-4.2-33.5,7c-7.3,11.2-4.2,26.2,7,33.5C488.1,103.9,527.6,177,527.6,256s-39.5,152.1-105.8,195.6 c-11.2,7.3-14.3,22.3-7,33.5c7,10.7,21.9,14.6,33.5,7C528.3,439.6,576,351.3,576,256S528.3,72.4,448.4,20z" class="volume-btn-icon-3" fill="currentColor"/>-->
<!--                                    <path d="M461.6,256l45.6-45.6c6.3-6.3,6.3-16.5,0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8,0L416,210.4l-45.6-45.6 c-6.3-6.3-16.5-6.3-22.8,0l-22.8,22.8c-6.3,6.3-6.3,16.5,0,22.8l45.6,45.6l-45.6,45.6c-6.3,6.3-6.3,16.5,0,22.8l22.8,22.8 c6.3,6.3,16.5,6.3,22.8,0l45.6-45.6l45.6,45.6c6.3,6.3,16.5,6.3,22.8,0l22.8-22.8c6.3-6.3,6.3-16.5,0-22.8L461.6,256z" class="volume-btn-icon-cross" fill="currentColor"/>-->
<!--                                </svg>-->
<!--                            </button>-->
<!--<! --                            <input type="range" min="0" max="100" id="secondaryvolumebarbtn">- ->-->
<!--                            <div class="secondaryvolumebarbtn">-->
<!--                                <div class="bar-part" id="secondaryvolumebar"></div>-->
<!--                                <div class="bar-part" id="secondaryvolumechangebtn"></div>-->
<!--                            </div>-->
<!--                        </li>-->
                        <li>
                            <a class="right-btn" download="" href="<?php echo $video ?>">
                                <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="btn-icon">
                                    <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" class="" fill="currentColor"/>
                                </svg>
                                <?php echo resolveLoc('download'); ?>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex-container-right">
                <div class="flex-container-right-inner">
                    <a class="hide-button-middle" id="chatcollapsebutton"><?php echo resolveLoc('collapse'); ?></a>
                    <div class="chat" id="chatcollapse" data-collapsed="false">
                        <div class="chat-messages">
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div class="chat-message">-->
<!--                                <img src="https://yt3.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="profile picture" class="chat-pfp">-->
<!--                                <div class="message-text">-->
<!--                                    <a class="chat-time">15:04</a>-->
<!--                                    <a class="chat-name">Saya Scarlet</a>:-->
<!--                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut eros at nibh vehicula ornare nec ut lectus. Vivamus purus felis, fringilla at venenatis quis, ultricies non lorem.-->
<!--                                </div>-->
<!--                            </div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid-container second-container yes">
            <div class="desc">
                <div class="desc-inner">
                    <h1><?php echo $streamname; ?></h1>
                    <div><span class="work-in-progress">123 456 gпросмотров ● </span><time datetime="<?php echo $starttime; ?>"></time></div>
                    <h3><?php echo resolveLocf('githubtext', '<a href="https://github.com/Misheus/legendary-pancake" target="_blank">GitHub</a>'); ?></h3>
                    <div class="desc-row">
                        <img class="saya-pfp" src="https://yt4.ggpht.com/ytc/AKedOLTeOULZ_c76LSlS6RK-wjV_FyDdowIxpShcMdC43w=s88-c-k-c0x00ffffff-no-rj" alt="Saya Scarlet pfp">
                        <div class="dasc-saya-data">
                            <div class="flex">
                                <span>Saya Scarlet</span>
                                <button class="work-in-progress desc-btn right-btn vote upvote active">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                        <path d="M272 480h-96c-13.3 0-24-10.7-24-24V256H48.2c-21.4 0-32.1-25.8-17-41L207 39c9.4-9.4 24.6-9.4 34 0l175.8 176c15.1 15.1 4.4 41-17 41H296v200c0 13.3-10.7 24-24 24z" class="" fill="currentColor"/>
                                    </svg>
                                </button> <span class="work-in-progress">28 137/</span>
                                <button class="work-in-progress desc-btn vote downvote">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="btn-icon">
                                        <path d="M176 32h96c13.3 0 24 10.7 24 24v200h103.8c21.4 0 32.1 25.8 17 41L241 473c-9.4 9.4-24.6 9.4-34 0L31.3 297c-15.1-15.1-4.4-41 17-41H152V56c0-13.3 10.7-24 24-24z" class="" fill="currentColor"/>
                                    </svg>
                                </button> <span class="work-in-progress">143/</span>
                                <button class="work-in-progress desc-btn btn-left-gap">
                                    <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="btn-icon">
                                        <path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z" class="" fill="currentColor"/>
                                    </svg>Поделиться
                                </button>
                                <button class="desc-btn work-in-progress">📑️ <?php echo resolveLoc('addtoplaylist'); ?></button>
                            </div>
                            <div class="desc-links">
                                <a href="https://www.youtube.com/c/TheSayaScarlet" target="_blank"><?php echo resolveLoc('watchonyoutube'); ?></a> ●
                                <a href="/" target="_blank"><?php echo resolveLoc('allrecords'); ?></a> ●
                                <a href="https://mysheus.ru/MeeThya/Saya_Streams_Tables.html" target="_blank"><?php echo resolveLoc('songstable'); ?></a>
                            </div>
                        </div>
                    </div>
                    <div class="desc-text" id="description" data-collapsed="true">
                    </div>
                    <div class="desc-text-collapse" id="descriptioncollapsebutton"><a><?php echo resolveLoc('expand'); ?></a></div>
                </div>
            </div>
            <div class="plst work-in-progress">
                <a class="hide-button-middle"><?php echo resolveLoc('collapse'); ?></a>
                <ul>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Название</div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Довольно длинное название на две строки</div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">☆ STREAM ☆ 今日は歌います！ singing and talking Saya 🤗<!--
                        Где, блять, мои ебаные многоточия, сука блять?!!?!?!? Рот ебал!--></div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Название</div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Название</div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Название</div>дата</div>
                    </li>
                    <li class="playlist-item">
                        <div class="playlist-img-div">
                            <img class="playlist-img" src="covers/2020-05-16.jpg" alt="cover">
                        </div><div class="playlist-item-name-date"><div class="playlist-item-name">Название</div>дата</div>
                    </li>
                </ul>
            </div>
            <div class="comments work-in-progress">
                Комментарии туть.
            </div>
        </div>
    </main>
    <script src="/js/player.js"></script>
    <script src="/js/true-vh.js"></script>
</body>
</html>