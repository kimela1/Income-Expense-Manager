DROP TABLE IF EXISTS `inex_income_category`;
DROP TABLE IF EXISTS `inex_expense_category`;
DROP TABLE IF EXISTS `inex_category`;
DROP TABLE IF EXISTS `inex_expense`;
DROP TABLE IF EXISTS `inex_income`;
DROP TABLE IF EXISTS `inex_user`;

CREATE TABLE `inex_user` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255),
    `last_name` varchar(255),
    `birth_date` date NOT NULL,
    `username` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY(`user_id`)
) ENGINE=innodb;

CREATE TABLE `inex_expense` (
    `expense_id` int(11) NOT NULL AUTO_INCREMENT,
    `expense_name` varchar(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date_spent` date NOT NULL,
    `user_id` int(11),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `inex_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(`expense_id`)
) ENGINE=innodb;

CREATE TABLE `inex_income` (
    `income_id` int(11) NOT NULL AUTO_INCREMENT,
    `income_name` varchar(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date_received` date NOT NULL,
    `user_id` int(11),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `inex_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(`income_id`)
) ENGINE=innodb;

CREATE TABLE `inex_category` (
    `user_id` int(11) NOT NULL,
    `category_id` int(11) NOT NULL AUTO_INCREMENT,
    `category_name` varchar(255) NOT NULL UNIQUE,
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `inex_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(`category_id`)
) ENGINE=innodb;

CREATE TABLE `inex_expense_category` (
    `expense_id` int(11) NOT NULL,
    `category_id` int(11) NOT NULL,
    PRIMARY KEY (`expense_id`, `category_id`),
    FOREIGN KEY (`expense_id`) REFERENCES `inex_expense` (`expense_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `inex_category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=innodb;

CREATE TABLE `inex_income_category` (
    `income_id` int(11) NOT NULL,
    `category_id` int(11) NOT NULL,
    PRIMARY KEY (`income_id`, `category_id`),
    FOREIGN KEY (`income_id`) REFERENCES `inex_income` (`income_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `inex_category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=innodb;

INSERT INTO `inex_user`(`first_name`, `last_name`, `email`, `username`, `password`, `birth_date`)
VALUES ('Bob', 'Smith', 'test@123abc.com', 'test', '123abc', '1980-01-01');

SELECT `user_id` INTO @user_id FROM `inex_user` WHERE `email` = 'test@123abc.com';

INSERT INTO `inex_expense` (`expense_name`, `amount`, `date_spent`, `user_id`)
VALUES ('Ralphs', 1.50, '2019-11-01', @user_id),
('76 Gas Station', 32.66, '2019-10-28', @user_id);

INSERT INTO `inex_income` (`income_name`, `amount`, `date_received`, `user_id`)
VALUES ('Money Inc', 150, '2019-11-05', @user_id),
('Ebay', 28.66, '2019-10-25', @user_id);

INSERT INTO `inex_category` (`category_name`, `user_id`)
VALUES ('Job', @user_id),
('Groceries', @user_id),
('Gas', @user_id),
('Snacks', @user_id);

SELECT `expense_id` INTO @expense_id1 FROM `inex_expense` 
WHERE `expense_name` = 'Ralphs' and `amount` = 1.50 and `date_spent` = '2019-11-01';

SELECT `category_id` INTO @category_id1 FROM `inex_category`
WHERE `category_name` = 'Groceries';

SELECT `expense_id` INTO @expense_id2 FROM `inex_expense` 
WHERE `expense_name` = '76 Gas Station' and `amount` = 32.66 and `date_spent` = '2019-10-28';

SELECT `category_id` INTO @category_id2 FROM `inex_category`
WHERE `category_name` = 'Gas';

SELECT `category_id` INTO @category_id1a FROM `inex_category`
WHERE `category_name` = 'Snacks';

INSERT INTO `inex_expense_category` (`expense_id`, `category_id`)
VALUES (@expense_id1, @category_id1),
(@expense_id2, @category_id2),
(@expense_id1, @category_id1a);


SELECT `income_id` INTO @income_id1 FROM `inex_income`
WHERE `income_name` = 'Money Inc' and `amount` = 150 and `date_received` = '2019-11-05';

SELECT `category_id` INTO @category_id3 FROM `inex_category`
WHERE `category_name` = 'Job';

INSERT INTO `inex_income_category` (`income_id`, `category_id`)
VALUES (@income_id1, @category_id3);