import productsData from '../data/products.json';

const CITIES = ['Neo-Tokyo', 'Night City', 'Sector 7G', 'Berlin Underground', 'Seoul Alpha', 'Los Angeles 2049', 'NYC Grid'];
const ACTIONS = ['purchased', 'viewed', 'added to wishlist'];

class MockStitchStream extends EventTarget {
    constructor() {
        super();
        this.isActive = false;
        this.timeoutId = null;
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.scheduleNextEvent();
    }

    stop() {
        this.isActive = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    scheduleNextEvent() {
        if (!this.isActive) return;

        // Randomize time between 5s and 25s for realism
        const nextInterval = Math.floor(Math.random() * 20000) + 5000;

        this.timeoutId = setTimeout(() => {
            this.emitRandomEvent();
            this.scheduleNextEvent(); // Schedule the next one recursively
        }, nextInterval);
    }

    emitRandomEvent() {
        const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];
        const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
        const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

        let message = '';
        if (randomAction === 'purchased') {
            message = `Someone in ${randomCity} just copped the ${randomProduct.title}!`;
        } else if (randomAction === 'viewed') {
            message = `Someone in ${randomCity} is looking at the ${randomProduct.title}.`;
        } else {
            const stockRemaining = Math.max(1, Math.floor(Math.random() * 5));
            message = `High demand: Only ${stockRemaining} pairs of ${randomProduct.title} left!`;
        }

        const event = new CustomEvent('stitch-db-change', {
            detail: {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                message,
                productImage: randomProduct.image,
                productName: randomProduct.title,
                city: randomCity,
                type: randomAction
            }
        });

        this.dispatchEvent(event);
    }

    // Allow manual triggering for local state events (like user adding to cart)
    triggerLocalEvent(message, image, type = 'local-action') {
        const event = new CustomEvent('stitch-db-change', {
            detail: {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                message,
                productImage: image,
                type
            }
        });
        this.dispatchEvent(event);
    }
}

export const stitchStream = new MockStitchStream();
