// Swathi Car Rentals - Fleet Management with Supabase Cloud Database Sync
const SUPABASE_URL = "https://gbyqvgodcowjukdgblfi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieXF2Z29kY293anVrZGdibGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MjMyNjYsImV4cCI6MjEwNzk5OTI2Nn0.evi_QfYVCmWZSp3TDHdDBCjarTmNZgER96_7kuHkHE8";

// Initialize Supabase Client
let supabaseClient = null;
window.isCloudConnected = false;

try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (e) {
    console.warn("Supabase Init Notice:", e);
}

// Master default fleet (15 vehicles)
const dummyCars = [
    { id: 'swift', name: 'Maruti Suzuki Swift', category: 'Hatchback', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/swift.jpg', order: 1 },
    { id: 'dzire', name: 'Maruti Suzuki Dzire', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/dzire.jpg', order: 2 },
    { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Automatic', price: 1500, image: 'assets/images/baleno.jpg', order: 3 },
    { id: 'glanza', name: 'Toyota Glanza', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Automatic', price: 1500, image: 'assets/images/glanza.jpg', order: 4 },
    { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Automatic', price: 1500, image: 'assets/images/fronx.jpg', order: 5 },
    { id: 'exter', name: 'Hyundai Exter', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/exter.jpg', order: 6 },
    { id: 'aura', name: 'Hyundai Aura', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/aura.jpg', order: 7 },
    { id: 'venue', name: 'Hyundai Venue', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 2500, image: 'assets/images/venue.jpg', order: 8 },
    { id: 'creta', name: 'Hyundai Creta', category: 'Mid-size SUV', seats: 5, fuel: 'Petrol', transmission: 'Automatic', price: 2500, image: 'assets/images/creta.jpg', order: 9 },
    { id: 'carens', name: 'Kia Carens', category: 'MUV', seats: 7, fuel: 'Petrol', transmission: 'Automatic', price: 3000, image: 'assets/images/carens.jpg', order: 10 },
    { id: 'thar', name: 'Mahindra Thar 4x4', category: '4x4 SUV', seats: 4, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/thar.jpg', order: 11 },
    { id: 'scorpio-n', name: 'Mahindra Scorpio N', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Automatic', price: 3500, image: 'assets/images/hero_scorpio.jpg', order: 12 },
    { id: 'innova', name: 'Toyota Innova Crysta', category: 'MUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/innova.jpg', order: 13 },
    { id: 'xuv700', name: 'Mahindra XUV700', category: 'Luxury SUV', seats: 7, fuel: 'Diesel', transmission: 'Automatic', price: 4500, image: 'assets/images/xuv700.jpg', order: 14 },
    { id: 'scorpio-classic', name: 'Mahindra Scorpio Classic S11', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 4500, image: 'assets/images/scorpio_classic.jpg', order: 15 }
];

// Synchronous local getter for instant page rendering (0ms delay)
function getFleet() {
    let stored = localStorage.getItem('swathi_fleet');
    if (!stored) {
        localStorage.setItem('swathi_fleet', JSON.stringify(dummyCars));
        return dummyCars;
    }
    try {
        let parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem('swathi_fleet', JSON.stringify(dummyCars));
            return dummyCars;
        }
        return parsed;
    } catch (e) {
        return dummyCars;
    }
}

// Seed the 15 master vehicles into Supabase
async function seedFleetToCloud() {
    if (!supabaseClient) throw new Error("Supabase is not initialized");
    const { data, error } = await supabaseClient.from('cars').upsert(dummyCars, { onConflict: 'id' });
    if (error) {
        console.error("Supabase seed error:", error);
        throw error;
    }
    console.log("All 15 master vehicles uploaded to Supabase!");
    return true;
}

// Save car (Add or Update) across local cache and Supabase
async function saveCarToCloud(car) {
    // 1. Instant local update
    let cars = getFleet();
    const existingIndex = cars.findIndex(c => c.id === car.id);
    if (existingIndex > -1) {
        cars[existingIndex] = car;
    } else {
        cars.push(car);
    }
    localStorage.setItem('swathi_fleet', JSON.stringify(cars));
    window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: cars }));

    // 2. Persist to Supabase
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('cars').upsert(car, { onConflict: 'id' });
            if (error) {
                console.error("Supabase save error:", error);
                window.isCloudConnected = false;
                window.dispatchEvent(new CustomEvent('swathi_cloud_status', { 
                    detail: { connected: false, error: error.message, tableMissing: error.code === 'PGRST205' } 
                }));
                return { success: true, cloud: false, error: error.message, tableMissing: error.code === 'PGRST205' };
            }
            window.isCloudConnected = true;
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: true } }));
            return { success: true, cloud: true };
        } catch (err) {
            console.error("Network error saving to Supabase:", err);
            return { success: true, cloud: false, error: err.message };
        }
    }
    return { success: true, cloud: false, error: 'Supabase client not loaded' };
}

// Delete car across local cache and Supabase
async function deleteCarFromCloud(carId) {
    // 1. Instant local update
    let cars = getFleet().filter(c => c.id !== carId);
    localStorage.setItem('swathi_fleet', JSON.stringify(cars));
    window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: cars }));

    // 2. Delete from Supabase
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('cars').delete().eq('id', carId);
            if (error) {
                console.error("Supabase delete error:", error);
                return { success: true, cloud: false, error: error.message };
            }
            return { success: true, cloud: true };
        } catch (err) {
            console.warn("Supabase delete network error:", err);
            return { success: true, cloud: false, error: err.message };
        }
    }
    return { success: true, cloud: false };
}

// Initialize Supabase Sync & Real-time channel
let isSyncListening = false;
async function initFleetSync(onUpdateCallback) {
    if (!supabaseClient || isSyncListening) return;
    isSyncListening = true;

    try {
        // Fetch current fleet from Supabase
        const { data, error } = await supabaseClient.from('cars').select('*').order('order', { ascending: true });
        
        if (error) {
            window.isCloudConnected = false;
            console.warn("Supabase fetch notice:", error.message);
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { 
                detail: { connected: false, error: error.message, tableMissing: error.code === 'PGRST205' } 
            }));
        } else {
            window.isCloudConnected = true;
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: true } }));

            if (!data || data.length === 0) {
                console.log("Supabase cars table is empty. Auto-seeding 15 master vehicles...");
                try {
                    await seedFleetToCloud();
                } catch (e) {
                    console.warn("Auto-seed notice:", e.message);
                }
            } else {
                localStorage.setItem('swathi_fleet', JSON.stringify(data));
                window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: data }));
                if (typeof onUpdateCallback === 'function') {
                    onUpdateCallback(data);
                }
            }
        }

        // Subscribe to real-time changes
        supabaseClient
            .channel('public:cars')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, async (payload) => {
                console.log("Supabase real-time update received:", payload);
                const { data: updatedCars } = await supabaseClient.from('cars').select('*').order('order', { ascending: true });
                if (updatedCars && updatedCars.length) {
                    localStorage.setItem('swathi_fleet', JSON.stringify(updatedCars));
                    window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: updatedCars }));
                    if (typeof onUpdateCallback === 'function') {
                        onUpdateCallback(updatedCars);
                    }
                }
            })
            .subscribe();

    } catch (err) {
        console.warn("Supabase sync initialization error:", err);
    }
}

// Render cars in grid
function renderCars(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let cars = getFleet();
    if (limit) cars = cars.slice(0, limit);

    if (cars.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #64748b;'>No cars currently available.</p>";
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
                    <span class="price">&#8377;${Number(car.price).toLocaleString('en-IN')}</span> / 12hrs
                </div>
                <div class="car-actions">
                    <a href="car-details.html?car=${encodeURIComponent(car.id)}" class="btn btn-outline">View Details</a>
                    <a href="car-details.html?car=${encodeURIComponent(car.id)}" class="btn btn-primary">Book Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

function updateFleetDisplays() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render immediately from local cache (0ms delay)
    updateFleetDisplays();

    // 2. Begin cloud sync in background
    initFleetSync(() => {
        updateFleetDisplays();
    });
});

window.addEventListener('swathi_fleet_updated', () => {
    updateFleetDisplays();
});
