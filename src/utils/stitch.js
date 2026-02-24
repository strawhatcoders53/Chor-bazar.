import productsData from '../data/products.json';

// Simulated MongoDB/Stitch Database API
export const db = {
    collection: (collectionName) => {
        return {
            find: (query = {}, options = {}) => {
                return {
                    toArray: () => {
                        return new Promise((resolve) => {
                            // Simulate network latency (200-800ms)
                            const delay = Math.floor(Math.random() * 600) + 200;

                            setTimeout(() => {
                                let data = [...productsData];

                                // Simulate limit if options.limit is provided
                                if (options.limit && typeof options.limit === 'number') {
                                    data = data.slice(0, options.limit);
                                }

                                resolve(data);
                            }, delay);
                        });
                    }
                }
            }
        }
    }
};
