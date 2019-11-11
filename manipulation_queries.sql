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

-- Create new account
INSERT INTO inex_user (first_name, last_name, username, password, email)
VALUES (:add_first_name, :add_last_name, :add_username, :add_password, :add_email);

-- Search Transactions table

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