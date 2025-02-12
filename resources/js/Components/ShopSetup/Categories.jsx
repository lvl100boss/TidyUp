import React from "react";
import { Label } from "@/Components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Categories({ data, handleCategoryChange, categories }) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <div>
                <Label htmlFor="branch_category">Category</Label>
                <p className="text-sm text-muted-foreground mb-4">
                    You can select multiple categories that fit your shop.
                </p>
                <ToggleGroup
                    type="multiple"
                    size="lg"
                    variant="outline"
                    className="justify-start gap-2"
                    value={data.categories}
                    onValueChange={handleCategoryChange}
                >
                    {categories.map((category) => (
                        <ToggleGroupItem
                            key={category.id}
                            value={category.id.toString()}
                            aria-label={category.name}
                        >
                            {category.name}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
        </div>
    );
}
