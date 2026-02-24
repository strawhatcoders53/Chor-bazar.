import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import SystemLoader from '../components/SystemLoader';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = ['All', 'Hoodies', 'Jackets', 'T-Shirts', 'Bottoms', 'Footwear', 'Accessories'];
const COLORS = ['Black', 'Neon Pink', 'Cyan', 'Silver', 'White'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const MATERIALS = [...new Set(productsData.map(p => p.material))].filter(Boolean);

const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating: High to Low', value: 'rating' }
];

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const rawCategoryFilter = searchParams.get('category') || 'All';
    const showStash = searchParams.get('stash') === 'true';

    const { wishlist } = useWishlist();

    const [categoryFilter, setCategoryFilter] = useState(rawCategoryFilter);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [sortOption, setSortOption] = useState('featured');
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        setCategoryFilter(searchParams.get('category') || 'All');
    }, [searchParams]);

    // Simulate network request
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300); // reduced delay for snappier feel
        return () => clearTimeout(timer);
    }, [categoryFilter, selectedColors, selectedSizes, selectedMaterials, sortOption]);

    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const toggleFilter = (setState, item) => {
        setState(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...productsData];

        if (showStash) {
            // Filter by items currently in the wishlist
            const stashedIds = wishlist.map(item => item.id);
            result = result.filter(p => stashedIds.includes(p.id));
        } else {
            // Category filter
            if (categoryFilter !== 'All') {
                result = result.filter(p => p.category === categoryFilter);
            }

            // Dynamic check filters
            if (selectedMaterials.length > 0) {
                result = result.filter(p => p.material && selectedMaterials.includes(p.material));
            }
            if (selectedColors.length > 0) {
                // If product doesn't have color, we assume it passes or fails based on logic. 
                result = result.filter(p => p.color ? selectedColors.includes(p.color) : true);
            }
            if (selectedSizes.length > 0) {
                result = result.filter(p => p.sizes ? p.sizes.some(s => selectedSizes.includes(s)) : true);
            }
        }

        // Sorting
        switch (sortOption) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [categoryFilter, selectedColors, selectedSizes, selectedMaterials, sortOption, showStash, wishlist]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters - Desktop */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-24 h-fit space-y-8 custom-scrollbar overflow-y-auto max-h-[calc(100vh-8rem)] pb-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider flex items-center gap-2">
                                <SlidersHorizontal size={20} className="text-neon-pink" /> Parameters
                            </h3>
                            <div className="h-px bg-dark-700 mb-6"></div>

                            <h4 className="text-gray-400 font-semibold mb-3 uppercase text-sm">Class</h4>
                            <ul className="space-y-2 mb-8">
                                {CATEGORIES.map(category => (
                                    <li key={category}>
                                        <button
                                            onClick={() => handleCategoryChange(category)}
                                            className={`text-left w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium ${categoryFilter === category
                                                ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/30 shadow-[0_0_10px_rgba(255,0,60,0.1)]'
                                                : 'text-gray-400 hover:text-white hover:bg-dark-800'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Multi-select Filters */}
                            <div className="space-y-6">
                                {/* Color Filter */}
                                <div>
                                    <h4 className="text-gray-400 font-semibold mb-3 uppercase text-sm">Color</h4>
                                    <div className="space-y-2">
                                        {COLORS.map(color => (
                                            <label key={color} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selectedColors.includes(color) ? 'bg-neon-blue border-neon-blue' : 'border-dark-600 bg-dark-900 group-hover:border-neon-blue'}`}>
                                                    {selectedColors.includes(color) && <div className="w-2 h-2 bg-dark-900 rounded-sm"></div>}
                                                </div>
                                                <span className={`text-sm ${selectedColors.includes(color) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{color}</span>
                                                <input type="checkbox" className="hidden" checked={selectedColors.includes(color)} onChange={() => toggleFilter(setSelectedColors, color)} />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Filter */}
                                <div>
                                    <h4 className="text-gray-400 font-semibold mb-3 uppercase text-sm">Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => toggleFilter(setSelectedSizes, size)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${selectedSizes.includes(size) ? 'bg-neon-blue text-dark-900 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-dark-800 text-gray-400 border border-dark-600 hover:border-neon-blue'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Material Filter */}
                                <div>
                                    <h4 className="text-gray-400 font-semibold mb-3 uppercase text-sm">Material</h4>
                                    <div className="space-y-2">
                                        {MATERIALS.map(material => (
                                            <label key={material} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selectedMaterials.includes(material) ? 'bg-neon-green border-neon-green' : 'border-dark-600 bg-dark-900 group-hover:border-neon-green'}`}>
                                                    {selectedMaterials.includes(material) && <div className="w-2 h-2 bg-dark-900 rounded-sm"></div>}
                                                </div>
                                                <span className={`text-sm ${selectedMaterials.includes(material) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{material}</span>
                                                <input type="checkbox" className="hidden" checked={selectedMaterials.includes(material)} onChange={() => toggleFilter(setSelectedMaterials, material)} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo block in sidebar */}
                        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-neon-blue/20 blur-2xl rounded-full"></div>
                            <h4 className="text-white font-bold mb-2">System Error</h4>
                            <p className="text-gray-400 text-xs mb-4">Find the hidden glitch items for a 40% discount at checkout.</p>
                            <button className="text-neon-blue text-xs font-bold uppercase tracking-wider hover:underline">Read Logs</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header & Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                                {showStash ? 'Personal Stash' : (categoryFilter === 'All' ? 'Complete Archive' : `${categoryFilter} Database`)}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Showing {filteredAndSortedProducts.length} results</p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                className="md:hidden flex items-center justify-center gap-2 bg-dark-800 border border-dark-600 text-white px-4 py-2 rounded-lg w-full"
                                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                            >
                                <SlidersHorizontal size={18} /> Filters
                            </button>

                            <div className="relative w-full sm:w-48">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="w-full appearance-none bg-dark-800 border border-dark-600 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-neon-blue text-sm cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters Dropdown */}
                    {isMobileFiltersOpen && (
                        <div className="md:hidden bg-dark-800 border border-dark-600 rounded-xl p-4 mb-8">
                            <h4 className="text-white font-semibold mb-3 uppercase text-sm">Category</h4>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            handleCategoryChange(category);
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm transition-colors ${categoryFilter === category
                                            ? 'bg-neon-pink text-white font-bold'
                                            : 'bg-dark-900 text-gray-400 border border-dark-700'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    {filteredAndSortedProducts.length === 0 && !isLoading ? (
                        <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dark-700 border-dashed">
                            <h3 className="text-2xl text-white font-bold mb-2">No Data Found</h3>
                            <p className="text-gray-400">Try adjusting your search parameters.</p>
                            <button
                                onClick={() => handleCategoryChange('All')}
                                className="mt-6 text-neon-blue hover:text-white transition-colors underline uppercase tracking-widest text-sm font-bold"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {isLoading
                                ? <div className="col-span-full py-20"><SystemLoader fullScreen={false} text="QUERYING DATABASE..." /></div>
                                : filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
