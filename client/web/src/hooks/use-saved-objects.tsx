"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

interface SavedObjectsContextType {
    savedIds: string[]
    toggleSave: (id: string) => void
    isSaved: (id: string) => boolean
}

const SavedObjectsContext = createContext<SavedObjectsContextType | undefined>(undefined)

export function SavedObjectsProvider({ children }: { children: ReactNode }): React.JSX.Element {
    const [savedIds, setSavedIds] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem("saved_objects")
        if (saved) {
            setSavedIds(JSON.parse(saved))
        }
    }, [])

    const toggleSave = (id: string) => {
        const newSavedIds = savedIds.includes(id)
            ? savedIds.filter((savedId) => savedId !== id)
            : [...savedIds, id]

        setSavedIds(newSavedIds)
        localStorage.setItem("saved_objects", JSON.stringify(newSavedIds))

        if (savedIds.includes(id)) {
            toast.info("Object removed from saved")
        } else {
            toast.success("Object saved")
        }
    }

    const isSaved = (id: string) => savedIds.includes(id)

    return (
        <SavedObjectsContext.Provider value={{ savedIds, toggleSave, isSaved }}>
            {children}
        </SavedObjectsContext.Provider>
    )
}

export function useSavedObjects() {
    const context = useContext(SavedObjectsContext)
    if (context === undefined) {
        throw new Error("useSavedObjects must be used within a SavedObjectsProvider")
    }
    return context
}
