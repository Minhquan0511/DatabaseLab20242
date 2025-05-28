const pool = require('../utils/database');

class Customer {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Customers');
    return rows;
  }

  static async findById(CustomerID) {
    const [rows] = await pool.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
    return rows[0];
  }

  static async create({ FirstName, LastName, PhoneNumber, Address }) {
    const [result] = await pool.query(
      'INSERT INTO Customers (FirstName, LastName, PhoneNumber, Address) VALUES (?, ?, ?, ?)',
      [FirstName, LastName, PhoneNumber, Address]
    );
    const [newCustomer] = await pool.query('SELECT * FROM Customers WHERE CustomerID = ?', [result.insertId]);
    return newCustomer[0];
  }

  static async update(CustomerID, { FirstName, LastName, PhoneNumber, Address }) {
    const [result] = await pool.query(
      'UPDATE Customers SET FirstName = ?, LastName = ?, PhoneNumber = ?, Address = ? WHERE CustomerID = ?',
      [FirstName, LastName, PhoneNumber, Address, CustomerID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Customer not found');
    }
    const [updatedCustomer] = await pool.query('SELECT * FROM Customers WHERE CustomerID = ?', [CustomerID]);
    return updatedCustomer[0];
  }

  static async delete(CustomerID) {
    const [result] = await pool.query('DELETE FROM Customers WHERE CustomerID = ?', [CustomerID]);
    if (result.affectedRows === 0) {
      throw new Error('Customer not found');
    }
  }
}

module.exports = Customer;