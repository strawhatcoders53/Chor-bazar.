const LoadingSkeleton = () => {
    return (
        <div className="glass-panel overflow-hidden bg-dark-800 animate-pulse h-full flex flex-col">
            <div className="aspect-square bg-dark-700 w-full" />
            <div className="p-5 flex flex-col flex-grow">
                <div className="h-3 w-1/3 bg-dark-600 rounded mb-4" />
                <div className="h-5 w-3/4 bg-dark-600 rounded mb-2" />
                <div className="h-5 w-1/2 bg-dark-600 rounded mb-4" />

                <div className="mt-auto pt-4 flex justify-between items-end">
                    <div className="h-6 w-1/4 bg-dark-600 rounded" />
                    <div className="h-4 w-1/6 bg-dark-600 rounded" />
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
