CREATE TABLE IF NOT EXISTS `Lens` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `orgId` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Lens.name_unique` (`name`),
    KEY `orgId` (`orgId`),
    CONSTRAINT `Lens_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `Org` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE Post ADD COLUMN lensId INT NOT NULL DEFAULT(1), 
ADD CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`lensId`) REFERENCES `Lens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

