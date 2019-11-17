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
SELECT  * 
FROM 
        (
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
        ) transactions;

-- Create new account
INSERT INTO inex_user (first_name, last_name, username, password, email)
VALUES (:add_first_name, :add_last_name, :add_username, :add_password, :add_email);

-- Add a new transaction into inex_income
INSERT INTO inex_income (name, amount, date_received, category_id, user_id)
VALUES (:add_name, :add_amount, :add_date_received, :add_category_id, :add_user_id);

-- Add a new transaciton into inex_expense
INSERT INTO inex_expense (name, amount, date_spent, category_id, user_id)
VALUES (:add_name, :add_amount, :add_date_spent, :add_category_id, :add_user_id);

-- Edit a transaction on inex_income
UPDATE inex_income
SET name = :new_name, amount = :new_amount, date_received = :new_date_received, category_id = :new_category_id
WHERE income_id = :edit_income_id;

-- Edit a transaction on inex_expense
UPDATE inex_expense
SET name = :new_name, amount = :new_amount, date_spent = :new_date_spent, category_id = :new_category_id
WHERE expense_id = :edit_expense_id;

-- Delete transaction on inex_income
DELETE FROM inex_income;

-- Delete transaction on inex_expense
DELETE FROM inex_expense;

-- Search Categories table
SELECT name from inex_category
WHERE inex_category.name = :in_name;

-- Add a new category into inex_category
INSERT INTO inex_category (name)
VALUES (:add_name);

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
