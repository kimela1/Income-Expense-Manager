USE cs340_situa;

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
    `name` varchar(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date_spent` date NOT NULL,
    `user_id` int(11),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `inex_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(`expense_id`)
) ENGINE=innodb;

CREATE TABLE `inex_income` (
    `income_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date_received` date NOT NULL,
    `user_id` int(11),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `inex_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(`income_id`)
) ENGINE=innodb;

CREATE TABLE `inex_category` (
    `category_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL UNIQUE,
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

INSERT INTO `inex_user`(`first_name`, `last_name`, `email`, `username`, `password`)
VALUES ('Bob', 'Smith', 'test@123abc.com', 'test', '123abc');

SELECT `user_id` INTO @user_id FROM `inex_user` WHERE `email` = 'test@123abc.com';

INSERT INTO `inex_expense` (`name`, `amount`, `date_spent`, `user_id`)
VALUES ('Ralphs', 1.50, '2019-11-01', @user_id),
('76 Gas Station', 32.66, '2019-10-28', @user_id);

INSERT INTO `inex_income` (`name`, `amount`, `date_received`, `user_id`)
VALUES ('Money Inc', 150, '2019-11-05', @user_id),
('Ebay', 28.66, '2019-10-25', @user_id);

INSERT INTO `inex_category` (`name`)
VALUES ('Job'),
('Groceries'),
('Gas'),
('Snacks');

SELECT `expense_id` INTO @expense_id1 FROM `inex_expense` 
WHERE `name` = 'Ralphs' and `amount` = 1.50 and `date_spent` = '2019-11-01';

SELECT `category_id` INTO @category_id1 FROM `inex_category`
WHERE `name` = 'Groceries';

SELECT `expense_id` INTO @expense_id2 FROM `inex_expense` 
WHERE `name` = '76 Gas Station' and `amount` = 32.66 and `date_spent` = '2019-10-28';

SELECT `category_id` INTO @category_id2 FROM `inex_category`
WHERE `name` = 'Gas';

SELECT `category_id` INTO @category_id1a FROM `inex_category`
WHERE `name` = 'Snacks';

INSERT INTO `inex_expense_category` (`expense_id`, `category_id`)
VALUES (@expense_id1, @category_id1),
(@expense_id2, @category_id2),
(@expense_id1, @category_id1a);


SELECT `income_id` INTO @income_id1 FROM `inex_income`
WHERE `name` = 'Money Inc' and `amount` = 150 and `date_received` = '2019-11-05';

SELECT `category_id` INTO @category_id3 FROM `inex_category`
WHERE `name` = 'Job';

INSERT INTO `inex_income_category` (`income_id`, `category_id`)
VALUES (@income_id1, @category_id3);

-- Combine inex_income and inex_expense into one transactions table
SELECT  * 
FROM 
        (
            SELECT 'inex_income' as table_name, name, income_id as id, amount, date_received as date, user_id 
            FROM inex_income
                where date_received between '2019/11/01' and '2019/11/10'
            UNION ALL
            SELECT 'inex_expense' as table_name, name, expense_id as id, amount, date_spent as date, user_id
            FROM inex_expense
                where date_spent between '2019/11/01' and '2019/11/10'
        ) transactions;
