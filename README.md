## \[EN]
This shit is located here for you to fix bugs in it.
This shit is my attempt to make player for [Saya's](https://www.youtube.com/c/TheSayaScarlet) stream records which exist just on my PC.
If you don't know [Saya](https://www.youtube.com/c/TheSayaScarlet), then I feel sorry for you, you are losing a lot.

If you find bugs in sayastreams.mysheus.ru and are ready to fix it then I will gladly accept your pull requests.

### How to launch
I don't remember. I setuped dev enviroment long time ago using OpenServer. But here is instruction for you:
1. Download and install your favotite webserver bundle for development. For example OpenServer.
2. Pray.
3. `git clone what the fuck is this repo link` or download zip and unzip in some specific folder I don't know which.
4. Download some videos from https://sayastreams.mysheus.ru/
5. `npm install` in `/api` to install dependencies. Actually you can skip steps 5 – 9, but you will have some 403 http errors.
6. Use Node.js npm to launch `/api/index.js`
7. Configure your webserver to proxy requests from `/api` to Node (assuming node are on the same PC as webserver, use ip `127.0.0.1`) on port 42069
8. Configure API for connecting to your MySQL database using `/api/options.example.json`, remove `.example` from its name
9. Import non-existing yet sql file to your database //TODO create sql file
10. Maybe you also want to download chat records and other garbage, located in `/names`, `/sartTimes` and `/chat` on https://sayastreams.mysheus.ru/ and put it in corresponding folders.
11. Pray one more time.
12. Try to enter to this in your browser I don't know how.
13. Pray the third time.
14. Fix all errors using google.
15. Damn me.
16. ??????
17. Profit!

Used librarys https://github.com/ramlmn/Apache-Directory-Listing, https://redbeanphp.com/, https://www.npmjs.com/package/mysql2 and https://github.com/js-cookie/js-cookie and seems to be all. Correct me if I forgot which libs I used.
## \[RU]
Это говно лежит тут для того, чтобы все неравнодушные могли его поправить.
Это говно является моей попыткой в создание плеера для записей стримов [Сайи](https://www.youtube.com/c/TheSayaScarlet), которые есть только у меня.
Если вы не знаете кто такая [Сайя](https://www.youtube.com/c/TheSayaScarlet), то мне вас жаль, многое теряете.

Если вы нашли баги в sayastreams.mysheus.ru и готовы их исправить, то я с радостью приму ваши пулл реквесты.

### Как это поднять:
Я не помню. Я поднимал свой дев давно, использовал OpenServer. Но вот инструкция для вас:
1. Скачать и установить ваш любимый девовский хрень, например OpenServer.
2. Помолиться.
3. `git clone какая там ссылка на этот репозиторий` или скачать и распаковать зипку не знаю куда
4. Скачать пару видео с https://sayastreams.mysheus.ru/
5. `npm install` в `/api` чтобы установить зависимости. На самом деле вы можете пропустить шаги 5 – 9, но вы будете получать 403 http ошибки.
5. Использовать Node.js чтобы запустить `/api/index.js`
6. Настроить ваш вебсервер на проксирование запросов с `/api` на Node (допустим, Node на том же ПК, что и вебсервер, использовать ip `127.0.0.1`) на порт 42069
7. Настроить API для подключения к вашей базе MySQL, используя `/api/options.example.json`, удалив `.example` из его имени
8. Импортировать ещё не существующий sql файл в вашу базу данных //TODO создать sql файл
9. Возможно вы так же хотите скачать записи чата и прочий мусор, находящийся в `/names`, `/sartTimes` и `/chat` на https://sayastreams.mysheus.ru/ и поместить его в соответствующие папки.
10. Помолиться ещё раз.
11. Попытаться зайти на неё не знаю как.
12. Помолиться в третий раз.
13. Пофиксить все ошибки при помощи гугла.
14. Проклясть меня.
15. ??????
16. Профит!

Использованы библиотеки https://github.com/ramlmn/Apache-Directory-Listing, https://redbeanphp.com/, https://www.npmjs.com/package/mysql2 и https://github.com/js-cookie/js-cookie и вроде бы всё. Поправьте меня, если я забыл какие либы юзал.