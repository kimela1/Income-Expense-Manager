-- Get Name, date_received, Amount, Categories for Income with Categories in Transaction table
-- user_id will be given to function
select i.name, i.date_received, i.amount, c.name as "category_name" from inex_income as i 
    inner join inex_user as u on i.user_id = u.user_id and u.user_id = :user_id
    left join inex_income_category as ic on ic.income_id = i.income_id 
    left join inex_category as c on c.category_id = ic.category_id;

-- Get Name, date_spent, Amount, Categories for Expense with Categories in Transaction table
-- user_id will be given to function
select e.name, e.date_spent, e.amount, c.name as "category_name" from inex_expense as e
    inner join inex_user as u on e.user_id = u.user_id and u.user_id = :user_id
    left join inex_expense_category as ec on ec.expense_id = e.expense_id 
    left join inex_category as c on c.category_id = ec.category_id;

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

-- Get inex_income and inex_expense in one transaction table along with the categories name
    SELECT 'inex_income' as table_name, i.name, i.income_id as id, i.amount, i.date_received as date, c.name as category_name 
    FROM inex_income as i
inner join inex_user as u on i.user_id = u.user_id and u.user_id = :user_id
    left join inex_income_category as ic on ic.income_id = i.income_id 
    left join inex_category as c on c.category_id = ic.category_id
    UNION ALL
    SELECT 'inex_expense' as table_name, e.name, e.expense_id as id, e.amount, e.date_spent as date, c.name as category_name
    FROM inex_expense as e
inner join inex_user as u on e.user_id = u.user_id and u.user_id = :user_id
    left join inex_expense_category as ec on ec.expense_id = e.expense_id 
    left join inex_category as c on c.category_id = ec.category_id

-- Get inex income & inex_expense into one table along with categories
-- Filter by date & name
SELECT 'inex_income' as type, i.income_name as name, 
    i.income_id as id, i.amount, i.date_received as date, 
    c.category_name as category_name,
    c.category_id as category_id
FROM inex_income as i
inner join inex_user as u on i.user_id = u.user_id AND u.user_id = ${user_id}
left join inex_income_category as ic ON ic.income_id = i.income_id
left join inex_category as c ON c.category_id = ic.category_id
WHERE (i.date_received >= ? AND i.date_received <= ? i.income_name = ?)
UNION ALL
SELECT 'inex_expense' as type, e.expense_name as name, 
    e.expense_id as id, e.amount, 
    e.date_spent as date, 
    c.category_name as category_name,
    c.category_id as category_id
FROM inex_expense as e
inner join inex_user as u on e.user_id = u.user_id AND u.user_id = ${user_id}
left join inex_expense_category as ec ON ec.expense_id = e.expense_id
left join inex_category as c on c.category_id = ec.category_id
WHERE (e.date_spent >= ? AND e.date_spent <= ? e.expense_name = ?);

-- Get categories from inex_category
SELECT category_id, category_name
FROM inex_category
WHERE category_id = :id;

-- Create new account
INSERT INTO inex_user (first_name, last_name, username, password, email)
VALUES (:add_first_name, :add_last_name, :add_username, :add_password, :add_email);

-- Add a new transaction into inex_income
INSERT INTO inex_income (name, amount, date_received, category_id, user_id)
VALUES (:add_name, :add_amount, :add_date_received, :add_category_id, :add_user_id);

-- Add a new transaciton into inex_expense
INSERT INTO inex_expense (name, amount, date_spent, category_id, user_id)
VALUES (:add_name, :add_amount, :add_date_spent, :add_category_id, :add_user_id);

-- Add a new category into inex_category
INSERT INTO inex_category (category_name, user_id)
VALUES (:add_category_name, user_id);

-- Edit a transaction on inex_income
UPDATE inex_income
SET name = :new_name, amount = :new_amount, date_received = :new_date_received, category_id = :new_category_id
WHERE income_id = :edit_income_id;

-- Edit a transaction on inex_expense
UPDATE inex_expense
SET name = :new_name, amount = :new_amount, date_spent = :new_date_spent, category_id = :new_category_id
WHERE expense_id = :edit_expense_id;

-- Edit a category on inex_category
UPDATE inex_category
SET category_name = :new_category_name 
WHERE category_id = :id;

-- Delete transaction on inex_income
DELETE FROM inex_income where expense_id = :id;

-- Delete transaction on inex_expense
DELETE FROM inex_expense where expense_id = :id;

-- Delete category on inex_category
DELETE FROM inex_category
WHERE category_id = :id;

-- Delete Inex_Income_Category
DELETE FROM inex_income_category where income_id = :id and category_id = :id

-- Delete Inex_Expense_category
DELETE FROM inex_expense_category where expense_id = :id and category_id = :id

-- Select categories name, id, transaction name, type from of
-- both income and expense
select c.name as "category_name", c.category_id, table1.name as "transaction_name", table1.table_name as "type"
    from inex_category as c
    left join
    ((select i.name, 'inex_income' as table_name, i.income_id  as id, ic.category_id
        from inex_income as i
        inner join inex_income_category as ic on ic.income_id = i.income_id
        where i.user_id = :user_id)
    union
    ( select e.name, 'inex_expense' as table_name, e.expense_id as id, ec.category_id 
        from inex_expense as e
        inner join inex_expense_category as ec on ec.expense_id = e.expense_id 
        where e.user_id = :user_id)) as table1
    on c.category_id = table1.category_id;

-- Get Income with greater than amount
select i.name, i.date_received, i.amount, c.name as "category_name" from inex_income as i 
    inner join inex_user as u on i.user_id = u.user_id and u.user_id = :user_id
    left join inex_income_category as ic on ic.income_id = i.income_id 
    left join inex_category as c on c.category_id = ic.category_id
    where i.amount > :amount;


-- Get Expense with greater than amount
select e.name, e.date_spent, e.amount, c.name as "category_name" from inex_expense as e
    inner join inex_user as u on e.user_id = u.user_id and u.user_id = :user_id
    left join inex_expense_category as ec on ec.expense_id = e.expense_id 
    left join inex_category as c on c.category_id = ec.category_id
    where e.maount > :amount;

-- Get Categories With User_id
SELECT  SELECT  category_id, category_name FROM category WHERE category.user_id = :user_id;

-- Filter items by categories and use that query to building item-category
SELECT 'inex_income' as type, i.income_name as name, 
    i.income_id as id, i.amount, i.date_received as date, 
    c.category_name as category_name,
    c.category_id as category_id
    FROM 
        (SELECT i.income_id, i.income_name, i.amount, i.date_received, i.user_id
            FROM inex_category AS c
            INNER JOIN inex_income_category AS ic ON ic.category_id = c.category_id
            INNER JOIN inex_income AS i on i.income_id = ic.income_id
            WHERE c.category_name = :category_name)as i
    inner join inex_user as u on i.user_id = u.user_id and u.user_id = :user_id
    left join inex_income_category as ic on ic.income_id = i.income_id
    left join inex_category as c on c.category_id = ic.category_id
    WHERE (i.date_received >= :date AND i.date_received <= :date)
UNION ALL
SELECT 'inex_expense' as type, e.expense_name as name, 
    e.expense_id as id, e.amount, 
    e.date_spent as date, 
    c.category_name as category_name,
    c.category_id as category_id
    FROM 
        (SELECT e.expense_id, e.expense_name, e.amount, e.date_spent, e.user_id
            FROM inex_category AS c
            INNER JOIN inex_expense_category AS ec ON ec.category_id = c.category_id
            INNER JOIN inex_expense AS e on e.expense_id = ec.expense_id
            WHERE c.category_name = :category_name) as e
    inner join inex_user as u on e.user_id = u.user_id and u.user_id = :user_id
    left join inex_expense_category as ec on ec.expense_id = e.expense_id
    left join inex_category as c on c.category_id = ec.category_id
    WHERE (e.date_spent >= :date AND e.date_spent <= :date)