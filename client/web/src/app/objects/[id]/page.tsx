"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/shared/NavBar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, CalendarIcon, DownloadIcon, HardDriveIcon, HeartIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSavedObjects } from "@/hooks/use-saved-objects"
import { cn } from "@/lib/utils"
import { ObjectCard } from "@/components/shared/ObjectCard"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface StoreObject {
    id: string
    title: string
    description: string
    imageUrl: string
    createdAt: string
}

export default function ObjectDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [object, setObject] = useState<StoreObject | null>(null)
    const [relatedObjects, setRelatedObjects] = useState<StoreObject[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { isSaved, toggleSave } = useSavedObjects()

    const saved = object ? isSaved(object.id) : false

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch Object Details
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/objects/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setObject(data.data)
                }

                // Fetch "Related" Objects (Just random ones for now)
                const resAll = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/objects`)
                if (resAll.ok) {
                    const dataAll = await resAll.json()
                    const all: StoreObject[] = dataAll.data
                    // Filter out current object and take 4 random ones
                    const others = all.filter(obj => obj.id !== id)
                    setRelatedObjects(others.slice(0, 4))
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleDelete = async () => {
        if (!object) return
        setDeleting(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/objects/${object.id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Object deleted successfully")
                router.push("/")
            } else {
                throw new Error("Failed to delete object")
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Failed to delete object")
        } finally {
            setDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <NavBar onSearch={() => { }} onUploadClick={() => { }} />
                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
                    <Skeleton className="h-8 w-[300px] mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        )
    }

    if (!object) {
        return (
            <div className="min-h-screen bg-background pb-20 flex flex-col items-center justify-center">
                <NavBar onSearch={() => { }} onUploadClick={() => { }} />
                <h1 className="text-2xl font-bold mb-4">Object Not Found</h1>
                <Link href="/">
                    <Button>Go Back Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <NavBar onSearch={() => { }} onUploadClick={() => { }} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image */}
                    <div className="relative aspect-square lg:aspect-[4/3] bg-muted rounded-2xl overflow-hidden border">
                        <Image
                            src={object.imageUrl}
                            alt={object.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm">Active</Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    {new Date(object.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">{object.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {object.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-6 border-t font-medium">
                            <Button
                                size="lg"
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-14 text-base hover-bouncy"
                                onClick={() => window.open(object.imageUrl, '_blank')}
                            >
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Object
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className={cn(
                                    "rounded-xl h-14 w-14 border-2 hover-bouncy",
                                    saved && "border-primary text-primary bg-primary/5"
                                )}
                                onClick={() => toggleSave(object.id)}
                            >
                                <HeartIcon className={cn("w-6 h-6", saved && "fill-current")} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-xl h-14 w-14 border-2 hover:bg-transparent hover:border-destructive hover:text-destructive hover-bouncy transition-colors"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2Icon className="w-6 h-6" />
                            </Button>
                        </div>

                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <DialogContent className="rounded-2xl sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Delete Object</DialogTitle>
                                    <DialogDescription className="text-base py-2">
                                        Are you sure you want to delete <span className="font-semibold text-foreground">"{object.title}"</span>? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4 gap-3 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(false)}
                                        className="rounded-xl h-12 flex-1 sm:mr-3"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="rounded-xl h-12 flex-1"
                                    >
                                        {deleting ? "Deleting..." : "Delete Object"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="bg-neutral-50 rounded-xl p-6 border space-y-4">
                            <h3 className="font-semibold text-foreground">File Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Object ID</span>
                                    <span className="font-medium truncate ml-4" title={object.id}>
                                        {object.id.substring(0, 8)}...
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Format</span>
                                    <span className="font-medium">
                                        {object.imageUrl.split('.').pop()?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">Digital Asset</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Added</span>
                                    <span className="font-medium">
                                        {new Date(object.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Objects */}
                {relatedObjects.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedObjects.map((obj) => (
                                <ObjectCard key={obj.id} {...obj} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
