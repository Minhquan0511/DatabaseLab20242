require('dotenv').config(); // Phải gọi đầu tiên để tải biến môi trường từ .env

const express = require('express');
const app = express();
const mysql = require('mysql2/promise'); // Sử dụng mysql2/promise để làm việc với async/await

// Import các file route
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const employeesRoutes = require('./routes/employees');
const parkingLotsRoutes = require('./routes/parkingLots'); // Đảm bảo đúng tên file

// Middleware
app.use(express.json()); // Cho phép server nhận dữ liệu JSON trong request body

// Kết nối Database
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) // Đảm bảo cổng là số nguyên
};

let connection; // Biến để giữ kết nối database

async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully!');
        // Đặt connection vào Express app context để các controller có thể sử dụng
        app.set('dbConnection', connection);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        // Có thể thoát ứng dụng nếu không kết nối được database để tránh lỗi tiếp theo
        // process.exit(1);
    }
}

connectDB(); // Gọi hàm kết nối database khi ứng dụng khởi động

// Định nghĩa các route API
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/parkingLots', parkingLotsRoutes);

// Route cơ bản cho kiểm tra trạng thái server
app.get('/', (req, res) => {
    res.send('API is running...'); // Sẽ hiển thị khi truy cập http://localhost:5000/
});

// Khởi động server
const PORT = process.env.PORT || 5000; // Sử dụng cổng từ .env hoặc mặc định 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));