document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const notLoggedInView = document.getElementById('not-logged-in-view');
    const loggedInView = document.getElementById('logged-in-view');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const addVehicleModal = document.getElementById('add-vehicle-modal');
    const closeModal = document.querySelector('.close-modal');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const vehiclesList = document.getElementById('vehicles-list');
    const totalSpacesEl = document.getElementById('total-spaces');
    const availableSpacesEl = document.getElementById('available-spaces');
    const occupiedSpacesEl = document.getElementById('occupied-spaces');
    
    // Sample data - in a real app, this would come from a backend
    let parkedVehicles = [
        { licensePlate: 'ABC1234', entryTime: '2023-05-15T09:30:00', vehicleType: 'Car' },
        { licensePlate: 'XYZ5678', entryTime: '2023-05-15T10:15:00', vehicleType: 'Motorcycle' },
        { licensePlate: 'DEF9012', entryTime: '2023-05-15T11:45:00', vehicleType: 'Truck' }
    ];
    
    const totalSpaces = 50;
    
    // Check if user is logged in (in a real app, this would check session/localStorage)
    let isLoggedIn = false;
    
    // Check for stored login state (simulating session)
    if (localStorage.getItem('parkingLoggedIn') === 'true') {
        isLoggedIn = true;
        updateUI();
    }
    
    // Login button click
    loginBtn.addEventListener('click', function() {
        // In a real app, this would redirect to your login page
        // For demo, we'll just simulate login
        isLoggedIn = true;
        localStorage.setItem('parkingLoggedIn', 'true');
        updateUI();
    });
    
    // Logout button click
    logoutBtn.addEventListener('click', function() {
        isLoggedIn = false;
        localStorage.removeItem('parkingLoggedIn');
        updateUI();
    });
    
    // Add vehicle button click
    addVehicleBtn.addEventListener('click', function() {
        addVehicleModal.style.display = 'block';
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        addVehicleModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addVehicleModal) {
            addVehicleModal.style.display = 'none';
        }
    });
    
    // Form submission
    addVehicleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const licensePlate = document.getElementById('license-plate').value;
        const vehicleType = document.getElementById('vehicle-type').value;
        
        // Add new vehicle
        const newVehicle = {
            licensePlate: licensePlate,
            entryTime: new Date().toISOString(),
            vehicleType: vehicleType
        };
        
        parkedVehicles.push(newVehicle);
        updateVehicleList();
        updateStats();
        
        // Reset form and close modal
        addVehicleForm.reset();
        addVehicleModal.style.display = 'none';
    });
    
    // Update UI based on login state
    function updateUI() {
        if (isLoggedIn) {
            notLoggedInView.style.display = 'none';
            loggedInView.style.display = 'block';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            
            // Load data
            updateVehicleList();
            updateStats();
        } else {
            notLoggedInView.style.display = 'block';
            loggedInView.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        }
    }
    
    // Update vehicle list in the table
    function updateVehicleList() {
        vehiclesList.innerHTML = '';
        
        if (parkedVehicles.length === 0) {
            vehiclesList.innerHTML = '<tr><td colspan="4" style="text-align: center;">No vehicles parked currently</td></tr>';
            return;
        }
        
        parkedVehicles.forEach((vehicle, index) => {
            const row = document.createElement('tr');
            
            const licensePlateCell = document.createElement('td');
            licensePlateCell.textContent = vehicle.licensePlate;
            
            const entryTimeCell = document.createElement('td');
            const entryDate = new Date(vehicle.entryTime);
            entryTimeCell.textContent = entryDate.toLocaleString();
            
            const typeCell = document.createElement('td');
            typeCell.textContent = vehicle.vehicleType;
            
            const actionsCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'action-btn remove-btn';
            removeBtn.addEventListener('click', () => removeVehicle(index));
            
            actionsCell.appendChild(removeBtn);
            
            row.appendChild(licensePlateCell);
            row.appendChild(entryTimeCell);
            row.appendChild(typeCell);
            row.appendChild(actionsCell);
            
            vehiclesList.appendChild(row);
        });
    }
    
    // Remove a vehicle
    function removeVehicle(index) {
        if (confirm('Are you sure you want to remove this vehicle?')) {
            parkedVehicles.splice(index, 1);
            updateVehicleList();
            updateStats();
        }
    }
    
    // Update statistics
    function updateStats() {
        totalSpacesEl.textContent = totalSpaces;
        occupiedSpacesEl.textContent = parkedVehicles.length;
        availableSpacesEl.textContent = totalSpaces - parkedVehicles.length;
    }
    
    // Initialize UI
    updateUI();
});