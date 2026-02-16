"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Need to add textarea if not present, otherwise use Input
import { UploadCloudIcon, XIcon, CheckCircleIcon } from "lucide-react"
import { toast } from "sonner"

interface CreateObjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function CreateObjectModal({ open, onOpenChange, onSuccess }: CreateObjectModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !description || !file) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("image", file)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/objects`, {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to create object")

            toast.success("Object created successfully")
            onOpenChange(false)
            setTitle("")
            setDescription("")
            setFile(null)
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to create object. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white gap-0 rounded-xl">
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-2">
                        <DialogTitle className="text-xl font-semibold">Create New Object</DialogTitle>
                        {/* Close button is handled by DialogPrimitive, but we can add custom if needed */}
                    </div>
                    <DialogDescription>
                        Add a new item to your live object store.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Object Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Vintage Camera"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the object details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-24 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Object Image</Label>
                        <div
                            className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                flex flex-col items-center justify-center gap-2
                ${dragActive ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"}
                ${file ? "border-primary/50 bg-primary/5" : ""}
              `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChange}
                            />

                            {file ? (
                                <>
                                    <CheckCircleIcon className="w-10 h-10 text-primary mb-2" />
                                    <p className="text-sm font-medium text-primary">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                                        <UploadCloudIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
                            {loading ? "Creating..." : "Create Object"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
