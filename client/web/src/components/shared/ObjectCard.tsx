"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, HardDriveIcon, HeartIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSavedObjects } from "@/hooks/use-saved-objects"
import { cn, formatBytes } from "@/lib/utils"

interface ObjectCardProps {
    id: string
    title: string
    description: string
    imageUrl: string
    createdAt: string
    status?: string // e.g., 'Active', 'Pending'
    size?: number
}

export function ObjectCard({ id, title, description, imageUrl, createdAt, status = "Active", size }: ObjectCardProps) {
    const { isSaved, toggleSave } = useSavedObjects()
    const saved = isSaved(id)

    return (
        <Card className="overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col group relative">
            <Link href={`/objects/${id}`} className="absolute inset-0 z-0" />
            <div className="relative aspect-video w-full bg-muted z-10 pointer-events-none">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-primary transition-colors h-8 w-8",
                            saved && "text-primary fill-primary"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSave(id)
                        }}
                    >
                        <HeartIcon className={cn("w-4 h-4", saved && "fill-current")} />
                    </Button>
                </div>
                <div className="absolute top-2 left-2 pointer-events-none">
                    <Badge variant="secondary" className="bg-white/90 text-primary font-medium backdrop-blur-sm">
                        {status}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-4 flex-grow z-10 pointer-events-none">
                <h3 className="font-semibold text-lg mb-1 truncate">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t bg-neutral-50/50 mt-auto z-10 pointer-events-none">
                <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <HardDriveIcon className="w-3 h-3" />
                    <span>{size ? formatBytes(size) : "12 MB"}</span>
                </div>
            </CardFooter>
        </Card>
    )
}
