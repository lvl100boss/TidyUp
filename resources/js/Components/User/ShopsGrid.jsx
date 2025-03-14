import React from 'react';
import { Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';

export default function ShopsGrid({ shops, showMessage = true }) {
    // Filter out any non-verified shops
    const verifiedShops = shops.filter(shop => shop.status === 'verified');
    
    if (verifiedShops.length === 0 && showMessage) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium">No shops available</h3>
                <p className="text-muted-foreground mt-2">
                    There are no verified shops to display at this time.
                </p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {verifiedShops.map(shop => (
                <Link key={shop.id} href={`/shop/${shop.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-[4/3] relative">
                            <img 
                                src={shop.shop_photo} 
                                alt={shop.shop_name}
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/placeholder-shop.png';
                                }}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium truncate">{shop.shop_name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                                {shop.city}, {shop.province}
                            </p>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
