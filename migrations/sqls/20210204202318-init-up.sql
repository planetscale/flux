CREATE TABLE IF NOT EXISTS `Org` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `Org.name_unique` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `User` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `displayName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `role` enum('USER', 'ADMIN') COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
    `orgId` int NOT NULL,
    `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `User.email_unique` (`email`),
    UNIQUE KEY `User.username_unique` (`username`),
    KEY `orgId` (`orgId`),
    CONSTRAINT `User_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `Org` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Lens` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `orgId` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Lens.name_unique` (`name`),
    KEY `orgId` (`orgId`),
    CONSTRAINT `Lens_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `Org` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Tag` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `channelId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Tag.name_unique` (`name`),
    UNIQUE KEY `Tag.channelId_unique` (`channelId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Post` (
    `id` int NOT NULL AUTO_INCREMENT,
    `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `summary` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `published` tinyint(1) DEFAULT '0',
    `authorId` int NOT NULL,
    `lensId` int NOT NULL,
    `content` text COLLATE utf8mb4_unicode_ci,
    `tagId` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `authorId` (`authorId`),
    KEY `lensId` (`lensId`),
    KEY `tagId` (`tagId`),
    CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`lensId`) REFERENCES `Lens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Post_ibfk_3` FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Profile` (
    `id` int NOT NULL AUTO_INCREMENT,
    `bio` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `avatar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Profile_userId_unique` (`userId`),
    CONSTRAINT `Profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

 CREATE TABLE `Reply` (
    `id` int NOT NULL AUTO_INCREMENT,
    `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    `postId` int NOT NULL,
    `authorId` int NOT NULL,
    `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `parentId` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `postId` (`postId`),
    KEY `authorId` (`authorId`),
    CONSTRAINT `Reply_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Reply_ibfk_2` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Star` (
    `id` int NOT NULL AUTO_INCREMENT,
    `postId` int NOT NULL,
    `userId` int NOT NULL,
    `shining` tinyint(1) DEFAULT NULL,
    `replyId` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `postId` (`postId`),
    KEY `userId` (`userId`),
    KEY `replyId` (`replyId`),
    CONSTRAINT `Star_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Star_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Star_ibfk_3` FOREIGN KEY (`replyId`) REFERENCES `Reply` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Org (id, name) VALUES (1, '');