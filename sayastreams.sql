SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `accesslog` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `useragent` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cookiesclosuingrate` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `useragent` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cookiesopeningrate` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `useragent` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `watchtime` (
  `id` int(11) NOT NULL,
  `sessionstart` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionend` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionuuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fragments` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `accesslog`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `cookiesclosuingrate`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `cookiesopeningrate`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `watchtime`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `accesslog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cookiesclosuingrate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cookiesopeningrate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `watchtime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
