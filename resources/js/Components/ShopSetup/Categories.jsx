import React, { useEffect } from 'react';
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function Categories({ data, handleCategoryChange, categories, allFieldsFilled, setAllFieldsFilled }) {
    // Validate if categories are selected
    useEffect(() => {
        // Check if at least one category is selected
        setAllFieldsFilled(data.categories && data.categories.length > 0);
        
        // Log for debugging
        console.log("Current selected categories:", data.categories);
    }, [data.categories, setAllFieldsFilled]);

    // Toggle category selection
    const toggleCategory = (categoryId) => {
        const isSelected = data.categories.includes(categoryId);
        let updatedCategories;
        
        if (isSelected) {
            updatedCategories = data.categories.filter(id => id !== categoryId);
        } else {
            updatedCategories = [...data.categories, categoryId];
        }
        
        handleCategoryChange(updatedCategories);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select Categories for Your Shop</h2>
            <p className="text-muted-foreground mb-6">
                Choose the categories that best describe your shop's services.
            </p>
            
            {categories && categories.length > 0 ? (
                <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Badge
                                key={category.id}
                                variant={data.categories.includes(category.id) ? "default" : "outline"}
                                className="cursor-pointer text-base py-2 px-3"
                                onClick={() => toggleCategory(category.id)}
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <p className="text-red-500">No categories available. Please contact an administrator.</p>
            )}
            
            <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected Categories:</p>
                {data.categories && data.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {data.categories.map((categoryId) => {
                            const category = categories.find(cat => cat.id === categoryId);
                            return (
                                <Badge key={categoryId} variant="secondary">
                                    {category ? category.name : `Category ${categoryId}`}
                                </Badge>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No categories selected yet</p>
                )}
            </div>
            
            {!allFieldsFilled && (
                <p className="mt-2 text-sm text-red-500">Please select at least one category to continue.</p>
            )}
        </div>
    );
}
