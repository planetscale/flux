CREATE TABLE IF NOT EXISTS `PostView` (
    `id` int NOT NULL AUTO_INCREMENT,
    `postId` int NOT NULL,
    `userId` int NOT NULL,
    `lastViewed` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `PostView.user_post_unique` (`userId`, `postId`),
    KEY `postId` (`postId`),
    KEY `userId` (`userId`),
    KEY `lastViewed` (`lastViewed`),
    CONSTRAINT `PostView_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `PostView_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

/* We will assert all users have seen all posts at time of migration, so we'll populate new table
 * with all known Post/User tuples
 */
INSERT INTO
    PostView (postId, userId)
SELECT
    Post.id,
    User.id
FROM
    Post
    CROSS JOIN User;