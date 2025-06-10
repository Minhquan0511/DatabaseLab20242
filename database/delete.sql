USE ParkingLot;

-- Disable foreign key checks to avoid constraint issues during deletion
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS ShiftsDetails;
DROP TABLE IF EXISTS Tickets;
DROP TABLE IF EXISTS ParkingSpot;
DROP TABLE IF EXISTS ServiceRegistration;
DROP TABLE IF EXISTS Vehicles;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Shifts;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS ParkingLot;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
