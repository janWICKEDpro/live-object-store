"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, PlusIcon, SearchIcon } from "lucide-react"

interface NavBarProps {
    onSearch: (query: string) => void
    onUploadClick: () => void
}

export function NavBar({ onSearch, onUploadClick }: NavBarProps) {
    return (
        <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground">Live Object Store</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onUploadClick}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
                        >
                            <PlusIcon className="w-6 h-6 stroke-[2.5]" />
                        </Button>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Button onClick={onUploadClick} className="bg-primary hover:bg-primary/90 text-white shadow-sm gap-2 rounded-lg">
                            <PlusIcon className="w-4 h-4" />
                            Add Object
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Search & Action Bar could be here but keeping it simple for now */}
        </div>
    )
}
