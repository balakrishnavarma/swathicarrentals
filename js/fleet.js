const dummyCars = [
    { id: 'swift', name: 'Maruti Suzuki Swift', category: 'Hatchback', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/swift.jpg' },
    { id: 'dzire', name: 'Maruti Suzuki Dzire', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/dzire.jpg' },
    { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/baleno.jpg' },
    { id: 'glanza', name: 'Toyota Glanza', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/glanza.jpg' },
    { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/fronx.jpg' },
    { id: 'exter', name: 'Hyundai Exter', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/exter.jpg' },
    { id: 'aura', name: 'Hyundai Aura', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/aura.jpg' },
    { id: 'venue', name: 'Hyundai Venue', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 2500, image: 'assets/images/venue.jpg' },
    { id: 'creta', name: 'Hyundai Creta', category: 'Mid-size SUV', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 2500, image: 'assets/images/creta.jpg' },
    { id: 'carens', name: 'Kia Carens', category: 'MUV', seats: 7, fuel: 'Petrol', transmission: 'Auto', price: 3000, image: 'assets/images/carens.jpg' },
    { id: 'thar', name: 'Mahindra Thar 4x4', category: '4x4 SUV', seats: 4, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/thar.jpg' },
    { id: 'scorpio-n', name: 'Mahindra Scorpio N', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Auto', price: 3500, image: 'assets/images/hero_scorpio.jpg' },
    { id: 'innova', name: 'Toyota Innova Crysta', category: 'MUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/innova.jpg' },
    { id: 'xuv700', name: 'Mahindra XUV700', category: 'Luxury SUV', seats: 7, fuel: 'Diesel', transmission: 'Auto', price: 4500, image: 'assets/images/xuv700.jpg' },
    { id: 'scorpio-classic', name: 'Mahindra Scorpio Classic S11', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 4500, image: 'assets/images/scorpio_classic.jpg' }
];

function getFleet() {
    let stored = localStorage.getItem('swathi_fleet');
    if (!stored) {
        localStorage.setItem('swathi_fleet', JSON.stringify(dummyCars));
        return dummyCars;
    }

    let parsed = JSON.parse(stored);

    // Automatically sync default vehicles and update details/prices from dummyCars
    dummyCars.forEach(defaultCar => {
        const existing = parsed.find(c => c.id === defaultCar.id);
        if (existing) {
            existing.price = defaultCar.price;
            existing.image = defaultCar.image;
            existing.category = defaultCar.category;
            existing.seats = defaultCar.seats;
            existing.fuel = defaultCar.fuel;
            existing.transmission = defaultCar.transmission;
        } else {
            parsed.push(defaultCar);
        }
    });
    localStorage.setItem('swathi_fleet', JSON.stringify(parsed));

    return parsed;
}

function renderCars(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let cars = getFleet();
    if (limit) cars = cars.slice(0, limit);

    if (cars.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>No cars currently available.</p>";
        return;
    }

    container.innerHTML = cars.map(car => `
        <div class="car-card">
            <div class="car-image" style="background: url('${car.image}') center/cover no-repeat;">
                <span class="category-badge">${car.category}</span>
            </div>
            <div class="car-content">
                <h3>${car.name}</h3>
                <div class="car-features">
                    <span><i class="fas fa-users"></i> ${car.seats}</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                    <span><i class="fas fa-cogs"></i> ${car.transmission}</span>
                </div>
                <div class="car-price">
                    <span class="price">&#8377;${car.price.toLocaleString('en-IN')}</span> / 12hrs
                </div>
                <div class="car-actions">
                    <a href="car-details.html?car=${car.id}" class="btn btn-outline">View Details</a>
                    <a href="car-details.html?car=${car.id}" class="btn btn-primary">Book Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamic-car-grid')) {
        renderCars('dynamic-car-grid');
    }
    if (document.getElementById('home-car-grid')) {
        renderCars('home-car-grid', 5);
        let allCars = getFleet();
        if (allCars.length > 5 && document.getElementById('view-all-cars-container')) {
            document.getElementById('view-all-cars-container').style.display = 'block';
        }
    }
});
