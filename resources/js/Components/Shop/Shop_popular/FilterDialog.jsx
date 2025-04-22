import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/Components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/Components/ui/accordion";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { X } from "lucide-react";

export default function FilterDialog({ 
  open, 
  onOpenChange, 
  onApplyFilters, 
  onClearFilters,
  categories = [], 
  provinces = [], 
  cities = [],
  barangays = [], 
  services = [] 
}) {
    // Initial filter state with province, city, and barangay (removed rating)
    const [filters, setFilters] = useState({
      category: "",
      province: "",
      city: "",
      barangay: "",
      services: []
    });
  
    // Reset filters when dialog opens
    useEffect(() => {
      if (open) {
        setFilters({
          category: "",
          province: "",
          city: "",
          barangay: "",
          services: []
        });
      }
    }, [open]);
  
    // Toggle a checkbox value in an array
    const toggleArrayItem = (array, item) => {
      return array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
    };
  
    // Handle individual filter changes
    const handleFilterChange = (key, value) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    };
  
    // Apply all filters - convert names to IDs before sending to backend
    const handleApplyFilters = () => {
      // Create a new object for backend with proper field mappings
      const backendFilters = {
        category_id: filters.category ? getCategoryIdByName(filters.category) : "",
        province: filters.province === "All" ? "" : filters.province,
        city: filters.city === "All" ? "" : filters.city,
        barangay: filters.barangay === "All" ? "" : filters.barangay,
        services: filters.services.map(serviceName => getServiceIdByName(serviceName))
      };
      
      onApplyFilters(backendFilters);
    };
  
    // Helper function to get category ID by name
    const getCategoryIdByName = (name) => {
      if (name === "All") return "";
      const category = categories.find(c => c.name === name);
      return category ? category.id.toString() : "";
    };
    
    // Helper function to get service ID by name
    const getServiceIdByName = (name) => {
      const service = services.find(s => s.name === name);
      return service ? service.id.toString() : "";
    };
  
    // Calculate how many filters are active
    const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) return count + 1;
      if (typeof value === 'string' && value && value !== 'All') return count + 1;
      return count;
    }, 0);
  
    // Prepare options for selects
    const categoryOptions = ["All", ...categories.map(category => category.name)];
    const provinceOptions = ["All", ...provinces];
    const cityOptions = ["All", ...cities];
    const barangayOptions = ["All", ...barangays];
    const serviceOptions = services.map(service => service.name);
    
    // Handler for clearing all filters
    const handleClearFilters = () => {
      setFilters({
        category: "",
        province: "",
        city: "",
        barangay: "",
        services: []
      });
      
      // Close the dialog and notify parent component
      onOpenChange(false);
      if (onClearFilters) onClearFilters();
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Shops</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-6 py-4">
            <Accordion type="multiple" defaultValue={["category", "location", "services"]}>
              {/* Category Filter */}
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Location Filters - Combined */}
              <AccordionItem value="location">
                <AccordionTrigger>Location</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Province Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="province-select">Province</Label>
                      <Select
                        id="province-select"
                        value={filters.province}
                        onValueChange={(value) => handleFilterChange("province", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinceOptions.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="city-select">City</Label>
                      <Select
                        id="city-select"
                        value={filters.city}
                        onValueChange={(value) => handleFilterChange("city", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cityOptions.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Barangay Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="barangay-select">Barangay</Label>
                      <Select
                        id="barangay-select"
                        value={filters.barangay}
                        onValueChange={(value) => handleFilterChange("barangay", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select barangay" />
                        </SelectTrigger>
                        <SelectContent>
                          {barangayOptions.map((barangay) => (
                            <SelectItem key={barangay} value={barangay}>
                              {barangay}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
  
              {/* Services Filter */}
              <AccordionItem value="services">
                <AccordionTrigger>Services</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service}`}
                          checked={filters.services.includes(service)}
                          onCheckedChange={() => 
                            handleFilterChange("services", toggleArrayItem(filters.services, service))
                          }
                        />
                        <Label htmlFor={`service-${service}`}>{service}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
  
          {activeFilterCount > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.category && filters.category !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange("category", "")} 
                    />
                  </Badge>
                )}
                {filters.province && filters.province !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Province: {filters.province}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange("province", "")} 
                    />
                  </Badge>
                )}
                {filters.city && filters.city !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    City: {filters.city}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange("city", "")} 
                    />
                  </Badge>
                )}
                {filters.barangay && filters.barangay !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Barangay: {filters.barangay}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange("barangay", "")} 
                    />
                  </Badge>
                )}
                {filters.services.map(service => (
                  <Badge key={service} variant="secondary" className="flex items-center gap-1">
                    {service}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => 
                        handleFilterChange("services", filters.services.filter(s => s !== service))
                      } 
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
  
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
            >
              Reset Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApplyFilters}
            >
              Apply Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}