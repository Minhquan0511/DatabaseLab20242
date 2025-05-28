const pool = require('../utils/database');

class Employee {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM Employees');
    return rows;
  }

  static async findById(EmployeeID) {
    const [rows] = await pool.query('SELECT * FROM Employees WHERE EmployeeID = ?', [EmployeeID]);
    return rows[0];
  }

  static async create({ FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate }) {
    const [result] = await pool.query(
      'INSERT INTO Employees (FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate) VALUES (?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate]
    );
    const [newEmployee] = await pool.query('SELECT * FROM Employees WHERE EmployeeID = ?', [result.insertId]);
    return newEmployee[0];
  }

  static async update(EmployeeID, { FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate }) {
    const [result] = await pool.query(
      'UPDATE Employees SET FirstName = ?, LastName = ?, PhoneNumber = ?, Salary = ?, JobTitle = ?, BirthDate = ? WHERE EmployeeID = ?',
      [FirstName, LastName, PhoneNumber, Salary, JobTitle, BirthDate, EmployeeID]
    );
    if (result.affectedRows === 0) {
      throw new Error('Employee not found');
    }
    const [updatedEmployee] = await pool.query('SELECT * FROM Employees WHERE EmployeeID = ?', [EmployeeID]);
    return updatedEmployee[0];
  }

  static async delete(EmployeeID) {
    const [result] = await pool.query('DELETE FROM Employees WHERE EmployeeID = ?', [EmployeeID]);
    if (result.affectedRows === 0) {
      throw new Error('Employee not found');
    }
  }
}

module.exports = Employee;