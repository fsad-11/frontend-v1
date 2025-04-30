-- PostgreSQL schema for Bill Request Management System

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS bill_requests;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS request_types;
DROP TABLE IF EXISTS request_statuses;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (employees)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    role_id INTEGER REFERENCES roles(id),
    manager_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create request types table
CREATE TABLE request_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create request statuses table
CREATE TABLE request_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bill requests table
CREATE TABLE bill_requests (
    id SERIAL PRIMARY KEY,
    request_type_id INTEGER REFERENCES request_types(id),
    amount DECIMAL(10, 2) NOT NULL,
    status_id INTEGER REFERENCES request_statuses(id),
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    employee_id INTEGER REFERENCES users(id),
    manager_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for departments
INSERT INTO departments (name) VALUES 
    ('Engineering'),
    ('Finance'),
    ('Human Resources'),
    ('Marketing'),
    ('Sales');

-- Insert initial data for roles
INSERT INTO roles (name) VALUES 
    ('Employee'),
    ('Manager'),
    ('Finance Manager'),
    ('Admin');

-- Insert initial data for request types
INSERT INTO request_types (name) VALUES 
    ('Travel Expense'),
    ('Office Supplies'),
    ('Conference Fee'),
    ('Training'),
    ('Miscellaneous');

-- Insert initial data for request statuses
INSERT INTO request_statuses (name) VALUES 
    ('pending'),
    ('approved'),
    ('rejected'),
    ('credited'),
    ('closed');

-- Create indexes for performance
CREATE INDEX idx_bill_requests_employee_id ON bill_requests(employee_id);
CREATE INDEX idx_bill_requests_manager_id ON bill_requests(manager_id);
CREATE INDEX idx_bill_requests_status_id ON bill_requests(status_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_users_role_id ON users(role_id);