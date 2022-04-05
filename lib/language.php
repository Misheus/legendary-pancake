<?php
$supportedLanguages = ['ru','en']; //todo maybe check files?


$language = 'en';
if(isset($_COOKIE['lang']) && in_array($_COOKIE['lang'], $supportedLanguages))//Вообще не ебу как тут что работает, давно писал. Но, надеюсь, что работает.
{//set language based on cookie
    //echo 'cookis';
    $language = $_COOKIE['lang'];
} else {//set language based on HTTP_ACCEPT_LANGUAGE
    /** @noinspection DuplicatedCode */
    $languages = null;
    if (($list = strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE']))) {
        if (preg_match_all('/([a-z]{1,8}(?:-[a-z]{1,8})?)(?:;q=([0-9.]+))?/', $list, $list)) {
            $languages = array_combine($list[1], $list[2]);
            foreach ($languages as $n => $v)
                $languages[$n] = $v ? (float)$v : 1.0;
            arsort($languages, SORT_NUMERIC);
        }
    } else $languages = array();
    $languages = array_keys($languages);
    if(!empty($languages))
    {
        for($i = 0; $i < sizeof($languages); $i++)
        {
            if(in_array(substr($languages[$i], 0, 2), $supportedLanguages))
            {
                $language = substr($languages[$i], 0, 2);
                //echo 'HTTP_ACCEPT_LANGUAGE';
                break;
            }
        }
    }
    setcookie('lang', $language, time()+86400*365, '/');
}

//$locdata = parse_ini_file (__DIR__."/lang/$language.ini", false, INI_SCANNER_RAW);
$locdata = json_decode(file_get_contents(__DIR__."/lang/$language.json"), true);
$locdataBase = [];
if(strcmp($language, 'en') != 0)
    //$locdataBase = parse_ini_file (__DIR__."/lang/en.ini", false, INI_SCANNER_RAW);
    $locdataBase = json_decode(file_get_contents(__DIR__."/lang/en.json"), true);

/** @noinspection DuplicatedCode */
function resolveLoc($patch): string
{
    global $locdata;
    global $locdataBase;
    if(isset($locdata[$patch])) return $locdata[$patch];
    if(isset($locdataBase[$patch])) return $locdataBase[$patch];
    return $patch;
}

function resolveLocf($patch, ...$args): string
{
    global $locdata;
    global $locdataBase;
    if(isset($locdata[$patch])) return sprintf($locdata[$patch], ...$args);
    if(isset($locdataBase[$patch])) return sprintf($locdataBase[$patch], ...$args);
    return $patch;
}

function getJSIntegration() {
    global $locdata;
    global $locdataBase;
    echo "<script>
        let locdata = ".json_encode($locdata).";
        let locdataBase = ".json_encode($locdataBase).";
        
        function resolveLoc(patch) {
            if(locdata[patch]) return locdata[patch];
            if(locdataBase[patch]) return locdataBase[patch];
            return patch;
        }
    </script>";
}