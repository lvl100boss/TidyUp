import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
export default function SearchShop() {
    const [open, setOpen] = useState(false);
    // Use searchShops for complete list of shops, fallback to shops if not available
    const { searchShops = [], shops = [] } = usePage().props;
    const shopsToSearch = searchShops.length > 0 ? searchShops : shops;
    
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="outline"
                            size="icon"
                            className="border"
                            radius="round"
                            onClick={() => setOpen(!open)}
                        >
                            <Search />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Search a Shop</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Type a name of shop to search..." className="border-none" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Results">
                            {shopsToSearch.map((shop, index) => (
                                <>
                                    <Link key={shop.id} href={`/${shop.id}/shop`}>
                                        <CommandItem >
                                            <p>{index + 1}</p>
                                            <div className="size-10 overflow-hidden rounded-sm">
                                                <img className="w-full h-full object-cover" src={'/' + shop.shop_photo} />
                                            </div>
                                            {shop.shop_name}
                                        </CommandItem>
                                    </Link>
                                    {index < shopsToSearch.length - 1 && <CommandSeparator />}
                                </>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}