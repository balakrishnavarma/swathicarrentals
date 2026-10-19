// Swathi Car Rentals - Fleet Management with Google Firebase Cloud Firestore Sync
const firebaseConfig = {
    apiKey: "AIzaSyCl_Gdx5vmbR-HAXVJ8NUPOo9zRd1Fnqqo",
    authDomain: "swathicarrentals-9405.firebaseapp.com",
    projectId: "swathicarrentals-9405",
    storageBucket: "swathicarrentals-9405.firebasestorage.app",
    messagingSenderId: "1066839742629",
    appId: "1:1066839742629:web:e4893b44a84e72bf51154c",
    measurementId: "G-QNV1462QCZ"
};

// Default master fleet (15 vehicles)
const dummyCars = [
    { id: 'swift', name: 'Maruti Suzuki Swift', category: 'Hatchback', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/swift.jpg', order: 1 },
    { id: 'dzire', name: 'Maruti Suzuki Dzire', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/dzire.jpg', order: 2 },
    { id: 'baleno', name: 'Maruti Suzuki Baleno', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/baleno.jpg', order: 3 },
    { id: 'glanza', name: 'Toyota Glanza', category: 'Premium Hatch', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/glanza.jpg', order: 4 },
    { id: 'fronx', name: 'Maruti Suzuki Fronx', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 1500, image: 'assets/images/fronx.jpg', order: 5 },
    { id: 'exter', name: 'Hyundai Exter', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/exter.jpg', order: 6 },
    { id: 'aura', name: 'Hyundai Aura', category: 'Sedan', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 1500, image: 'assets/images/aura.jpg', order: 7 },
    { id: 'venue', name: 'Hyundai Venue', category: 'Compact SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price: 2500, image: 'assets/images/venue.jpg', order: 8 },
    { id: 'creta', name: 'Hyundai Creta', category: 'Mid-size SUV', seats: 5, fuel: 'Petrol', transmission: 'Auto', price: 2500, image: 'assets/images/creta.jpg', order: 9 },
    { id: 'carens', name: 'Kia Carens', category: 'MUV', seats: 7, fuel: 'Petrol', transmission: 'Auto', price: 3000, image: 'assets/images/carens.jpg', order: 10 },
    { id: 'thar', name: 'Mahindra Thar 4x4', category: '4x4 SUV', seats: 4, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/thar.jpg', order: 11 },
    { id: 'scorpio-n', name: 'Mahindra Scorpio N', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Auto', price: 3500, image: 'assets/images/hero_scorpio.jpg', order: 12 },
    { id: 'innova', name: 'Toyota Innova Crysta', category: 'MUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 3500, image: 'assets/images/innova.jpg', order: 13 },
    { id: 'xuv700', name: 'Mahindra XUV700', category: 'Luxury SUV', seats: 7, fuel: 'Diesel', transmission: 'Auto', price: 4500, image: 'assets/images/xuv700.jpg', order: 14 },
    { id: 'scorpio-classic', name: 'Mahindra Scorpio Classic S11', category: 'SUV', seats: 7, fuel: 'Diesel', transmission: 'Manual', price: 4500, image: 'assets/images/scorpio_classic.jpg', order: 15 }
];

// Initialize Firebase Compat
let db = null;
window.isCloudConnected = false;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
    }
} catch (e) {
    console.warn("Firebase Init Notice:", e);
}

// Synchronous local getter for instant page rendering
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

// Seed the 15 master vehicles into Firestore
async function seedFleetToCloud() {
    if (!db) throw new Error("Firebase is not initialized");
    const batch = db.batch();
    dummyCars.forEach((car, index) => {
        const docRef = db.collection('cars').doc(car.id);
        batch.set(docRef, { ...car, order: car.order || (index + 1) }, { merge: true });
    });
    await batch.commit();
    console.log("All 15 master vehicles uploaded to Firebase Cloud Firestore!");
    return true;
}

// Verify real server connection to Firestore
async function verifyCloudConnection() {
    if (!db) {
        window.isCloudConnected = false;
        window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: false, error: 'Firebase not loaded' } }));
        return false;
    }
    try {
        // Query the server directly to verify database (default) exists
        const testSnap = await db.collection('cars').limit(1).get({ source: 'server' });
        window.isCloudConnected = true;
        window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: true } }));
        return true;
    } catch (err) {
        window.isCloudConnected = false;
        console.warn("Cloud connection check:", err.message);
        window.dispatchEvent(new CustomEvent('swathi_cloud_status', { 
            detail: { 
                connected: false, 
                error: err.message,
                dbMissing: err.message.includes('not exist') || err.message.includes('NOT_FOUND')
            } 
        }));
        return false;
    }
}

// Save car (Add or Update) across local cache and Cloud Firestore
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

    // 2. Cloud Firestore persist
    if (db) {
        try {
            await db.collection('cars').doc(car.id).set(car, { merge: true });
            window.isCloudConnected = true;
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: true } }));
            return { success: true, cloud: true };
        } catch (err) {
            console.error("Firestore save error:", err);
            window.isCloudConnected = false;
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { 
                detail: { 
                    connected: false, 
                    error: err.message,
                    dbMissing: err.message.includes('not exist') || err.message.includes('NOT_FOUND')
                } 
            }));
            return { success: true, cloud: false, error: err.message };
        }
    }
    return { success: true, cloud: false, error: 'Firebase not initialized' };
}

// Delete car across local cache and Cloud Firestore
async function deleteCarFromCloud(carId) {
    // 1. Instant local update
    let cars = getFleet().filter(c => c.id !== carId);
    localStorage.setItem('swathi_fleet', JSON.stringify(cars));
    window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: cars }));

    // 2. Cloud Firestore delete
    if (db) {
        try {
            await db.collection('cars').doc(carId).delete();
            return { success: true, cloud: true };
        } catch (err) {
            console.warn("Firestore delete warning:", err);
            return { success: true, cloud: false, error: err.message };
        }
    }
    return { success: true, cloud: false };
}

// Real-time listener for Firestore sync
let isSyncListening = false;
function initFleetSync(onUpdateCallback) {
    if (!db || isSyncListening) return;
    isSyncListening = true;

    // Check server connection
    verifyCloudConnection();

    try {
        db.collection('cars').onSnapshot(async (snapshot) => {
            // Only consider genuinely connected if metadata is from server or doc exists
            if (!snapshot.metadata.fromCache || !snapshot.empty) {
                window.isCloudConnected = true;
                window.dispatchEvent(new CustomEvent('swathi_cloud_status', { detail: { connected: true } }));
            }

            if (snapshot.empty) {
                // If cloud is connected and truly empty, seed default cars
                if (!snapshot.metadata.fromCache) {
                    console.log("Cloud Firestore 'cars' collection is empty. Auto-seeding initial 15 vehicles...");
                    try {
                        await seedFleetToCloud();
                    } catch (e) {
                        console.warn("Auto-seed notice:", e.message);
                    }
                }
            } else {
                const cloudCars = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    cloudCars.push({ id: doc.id, ...data });
                });
                cloudCars.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
                localStorage.setItem('swathi_fleet', JSON.stringify(cloudCars));
                window.dispatchEvent(new CustomEvent('swathi_fleet_updated', { detail: cloudCars }));
                if (typeof onUpdateCallback === 'function') {
                    onUpdateCallback(cloudCars);
                }
            }
        }, (error) => {
            window.isCloudConnected = false;
            console.warn("Firestore sync status (using local cache):", error.message);
            window.dispatchEvent(new CustomEvent('swathi_cloud_status', { 
                detail: { 
                    connected: false, 
                    error: error.message,
                    dbMissing: error.message.includes('not exist') || error.message.includes('NOT_FOUND')
                } 
            }));
        });
    } catch (err) {
        console.warn("Firestore sync setup notice:", err.message);
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
