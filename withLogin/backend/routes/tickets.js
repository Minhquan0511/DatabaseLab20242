const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/tickets');
const authenticateToken = require('../middleware/auth');

router.get('/tickets', authenticateToken, ticketController.getTickets);
router.get('/tickets/:TicketID', authenticateToken, ticketController.getTicket);
router.post('/tickets', authenticateToken, ticketController.createTicket);
router.put('/tickets/:TicketID', authenticateToken, ticketController.updateTicket);
router.delete('/tickets/:TicketID', authenticateToken, ticketController.deleteTicket);

module.exports = router;