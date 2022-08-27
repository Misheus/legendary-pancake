const options = require('./options.json')
const mysql = require('mysql2');
const fs = require('fs')
let mysqldb = mysql.createPool(options.mysql);

// *
// * mysql-promise TODO make library out of this snippet
// *

mysqldb.queryPromise = function (sql, values) {
    return new Promise((resolve, reject)=>{
        this.query(sql, values, (err, res)=>{
            if(err) reject(err)
            else resolve(res)
        })
    })
}

mysqldb.load = async function (table, id) {
    return (await mysqldb.queryPromise(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]))[0]
}

mysqldb.findOne = async function (table, where, values) {
    return (await mysqldb.queryPromise(`SELECT * FROM \`${table}\` WHERE ${where} LIMIT 1`, [values]))[0]
}

mysqldb.find = function (table, where, values) {
    return mysqldb.queryPromise(`SELECT * FROM \`${table}\` WHERE ${where}`, [values])
}

mysqldb.insert = function (table, data) {
    //{ass:123, ass2: 456, ass3: 'aasss'}
    //INSERT INTO `debug`(`ass`, `ass2`, `ass3`) VALUES (123,456,'aasss')
    let fields = [], vals = [], keys = Object.keys(data), placeholders = [];
    for (let i = 0; i<keys.length; i++)
    {
        switch (typeof data[keys[i]]) {
            case "number":
            case "string":
                fields.push('`'+keys[i]+'`')
                placeholders.push('?')
                vals.push(data[keys[i]])
                break
            case "boolean":
                fields.push('`'+keys[i]+'`')
                placeholders.push('?')
                vals.push(data[keys[i]]?1:0)
                break
            default:
                throw new Error('Unknown data type ' + typeof data[keys[i]])
        }
    }
    return this.queryPromise(`INSERT INTO \`${table}\`(${fields.join(', ')}) VALUES (${placeholders.join(', ')})`, vals)
}

mysqldb.update = function (table, data, where, vls) {
    //{ass:123, ass2: 456, ass3: 'aasss'}
    //UPDATE `debug` SET `ass`=123,`ass2`=456,`ass3`='aasss' WHERE 1
    let fields = [], vals = [], keys = Object.keys(data);
    for (let i = 0; i<keys.length; i++)
    {
        switch (typeof data[keys[i]]) {
            case "number":
            case "string":
                fields.push('`'+keys[i]+'` = ?')
                vals.push(data[keys[i]])
                break
            case "boolean":
                fields.push('`'+keys[i]+'` = ?')
                vals.push(data[keys[i]]?1:0)
                break
        }
    }
    return this.queryPromise(`UPDATE \`${table}\` SET ${fields.join(', ')} WHERE ${where}`, vals.concat(...vls))
}

// *
// * /mysql-promise
// *

let wathedFragments = {}

require('http').createServer(async (req, res) => {
    try {
        if (req.method !== "POST" && req.method !== "GET") {
            res.writeHead(501)
            res.end('501 Not Implemented')
            return
        }
        let url = req.url.split('?')
        let GET = {}
        if (url.length === 0 || url.length > 2 || url[0][0] !== '/') {
            res.writeHead(400)
            res.end('400 Bad Request')
            return
        }
        if (url[1]) GET = Object.fromEntries(url[1].split("&").map(v => v.split('=')).filter(v => v[0] && typeof v[1] !== "undefined").map(v => [v[0], decodeURIComponent(v[1])]));
        url = url[0].split('/').slice(1)
        //todo get cookies
        let cookies = Object.fromEntries((req.headers.cookie||'').split("; ").map(v => v.split('=')).filter(v => v[0] && typeof v[1] !== "undefined").map(v => [v[0], decodeURIComponent(v[1])]))
        res.setHeader('Access-Control-Allow-Origin', 'https://sayastreams.mysheus.ru:2053')
        switch (url[0]) {
            case 'register_event':
                switch (url[1]) {
                    case 'terms_of_use_closed'://No one reads terms of use. This is just for prove it.
                        if (!GET.time) {
                            res.writeHead(400)
                            res.end('400 Bad Request. Insufficient parameters. Expected: time.')
                            break;
                        }
                        GET.time = parseFloat(GET.time)//Why my IDE thinks that typeof GET.time is number? Why it thinks GET.time even exists???
                        if (GET.time <= 0) {
                            res.writeHead(400)
                            res.end('400 Bad Request. Parameter "time" shold be number and be greather than zero.')
                            break;
                        }
                        console.log('someone closed cookies dialog box in', GET.time, 'seconds.')
                        mysqldb.insert('cookiesclosuingrate', {
                            uuid: cookies["client-uuid"]||'00000000-0000-0000-0000-000000000000',
                            ip: req.headers["cf-connecting-ip"],
                            country: req.headers["cf-ipcountry"],
                            useragent: req.headers["user-agent"],
                            time: GET.time
                        })
                        res.writeHead(200)
                        res.end('200 OK')
                        break;
                    case 'terms_of_use_opened':
                        console.log('someone opened cookies dialog box.')
                        mysqldb.insert('cookiesopeningrate', {
                            uuid: cookies["client-uuid"]||'00000000-0000-0000-0000-000000000000',
                            ip: req.headers["cf-connecting-ip"],
                            country: req.headers["cf-ipcountry"],
                            useragent: req.headers["user-agent"],
                            time: GET.time
                        })
                        res.writeHead(200)
                        res.end('200 OK')
                        break
                    case 'fragments_wathed'://send this every X seconds, on beforeunload and on visibility changes to hidden (через Navigator.sendBeacon())
                        //Не будет работать. Я не знаю как диференцировать сессии. Можно по юзверям, но один юзверь может смотреть два видео одновременно.
                        //Может по юзверям и айди видео?
                        //Отправлять только в on visibility changes, но ждать долго очередного отправления?
                        //Отправлять только в on visibility changes, но по кулдауну слать ещё один запрос на отмену?
                        //А если Navigator.sendBeacon() будет заблокирован адблоком?
                        //Или делать UUID для каждой сессии и диференцировать их так? Если юзверь назад-вперёд, то это сохранит UUID, но это же сохранит timeranges. А если юзверь обновит, сбросив их, то получит новый UUID.

                        //Да, диференцируем всё по UUID сесии, шлём каждые Х секунд, а по истечении Х секунд и не получению новых данных, записываем в БД последние полученные данные.
                        //Если мы не получим данные при уходе юзверя сос траницы, наши данные будут устаревшими на Х секунд, что не должно быть критично.
                        //Помним, что Navigator.sendBeacon() шлёт POST.
                        let body = ''
                        if(req.method === "POST")
                        {
                            await new Promise(resolve => {
                                req.on('data', chunk => {
                                    body += chunk.toString(); // convert Buffer to string
                                });
                                req.on('end', () =>{
                                    resolve()
                                    GET.timeFragments = body
                                })
                            })
                        }
                        if (!GET.sessionUUID || !GET.timeFragments || !GET.v) {
                            res.writeHead(400)
                            res.end('400 Bad Request. Insufficient parameters. Expected: sessionUUID, timeFragments (or POST body) and v.')
                            break;
                        }
                        //fixme use POST for this
                        //todo check if GET.sessionUUID is valid uuid and GET.timeFragments is valid
                        if(wathedFragments[GET.sessionUUID]) {//session exists
                            clearTimeout(wathedFragments[GET.sessionUUID].timer)
                            wathedFragments[GET.sessionUUID].lastData = GET.timeFragments
                            wathedFragments[GET.sessionUUID].timer = setTimeout(wiewSessionEnd, 50000, GET.sessionUUID)
                            //fixme increase timeout
                        } else {//session does not exists
                            wathedFragments[GET.sessionUUID] = {
                                lastData: GET.timeFragments,
                                timer: setTimeout(wiewSessionEnd, 50000, GET.sessionUUID),//fixme increase timeout
                                uuid: cookies["client-uuid"]||'00000000-0000-0000-0000-000000000000',
                                ip: req.headers["cf-connecting-ip"],
                                country: req.headers["cf-ipcountry"],
                                sessionStart: Date.now(),
                                video: GET.v
                            }
                            console.log('Session', GET.sessionUUID, 'from user', wathedFragments[GET.sessionUUID].uuid, 'started.')
                        }
                        console.log('Recived', GET.timeFragments, 'for', GET.v, 'from session', GET.sessionUUID)
                        res.writeHead(200)
                        res.end('200 OK')
                        break;
                    default:
                        res.writeHead(400)
                        res.end('400 Bad Request. Event for register_event not specified or does not exists.')
                        break;
                }
                break
            default:
                res.writeHead(400)
                res.end('400 Bad Request. API method not specified or does not exists.')
                break;
        }
        //console.log(url, GET)
    } catch (e) {
        console.log('Error occured while procesing the request', req, e)
        res.writeHead(500)
        res.end('500 Internal Server Error')
    }
}).listen(42069)


function wiewSessionEnd(sessionUUID) {
    console.log('No data from session', sessionUUID, 'for too long. Assuming session ended.')
    console.log('Session', sessionUUID, 'from user', wathedFragments[sessionUUID].uuid, 'for', wathedFragments[sessionUUID].video, 'watched', wathedFragments[sessionUUID].lastData)

    let data = {
        sessionstart: new Date(wathedFragments[sessionUUID].sessionStart).toISOString(),
        sessionend: new Date().toISOString(),
        sessionuuid: sessionUUID,
        uuid: wathedFragments[sessionUUID].uuid,
        ip: wathedFragments[sessionUUID].ip,
        country: wathedFragments[sessionUUID].country,
        fragments:wathedFragments[sessionUUID].lastData,
        video:wathedFragments[sessionUUID].video
    }

    if(wathedFragments[sessionUUID].lastData.length>999)
    {
        console.error('Session', sessionUUID, 'from user', wathedFragments[sessionUUID].uuid, 'has too much data', wathedFragments[sessionUUID].lastData.length)
        fs.writeFileSync(`${__dirname}/wathedLarge/${sessionUUID}.json`, JSON.stringify(data, null, 4))
        wathedFragments[sessionUUID].lastData = 'Data too large. See file in that ass.'
        //FIXME What to do with large chunks of data with thousents of symbols?
    }

    mysqldb.insert('watchtime', data).catch(e=>{
        console.log('MySQL error',e)
        fs.writeFileSync(`${__dirname}/wathedErrored/${sessionUUID}.json`, JSON.stringify(data, null, 4))
    })

    delete wathedFragments[sessionUUID]
}