-- Get Name, date_received, Amount, Categories for Income in Transaction table
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
