use ParkingLot;
DELIMITER $$
CREATE TRIGGER after_ticket_insert
AFTER INSERT ON Tickets
FOR EACH ROW
BEGIN
    UPDATE ParkingSpot
    SET Status = 'Occupied'
    WHERE LicensePlate = NEW.LicensePlate;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_ticket_delete
AFTER DELETE ON Tickets
FOR EACH ROW
BEGIN
    UPDATE ParkingSpot
    SET Status = 'Available'
    WHERE LicensePlate = OLD.LicensePlate;
END $$
DELIMITER ;
