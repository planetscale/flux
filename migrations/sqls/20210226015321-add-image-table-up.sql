CREATE TABLE `Image`
  (
    id                   INT NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(36) NOT NULL UNIQUE, 
    image                BLOB NOT NULL,
    PRIMARY KEY (id)
  );
