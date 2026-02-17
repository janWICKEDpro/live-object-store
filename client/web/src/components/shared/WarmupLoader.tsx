"use client"

import { Loader2 } from "lucide-react"

export function WarmupLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Waking up the server...</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Our backend is hosted on a service that sleeps after inactivity. This usually takes about 30-60 seconds. Hang tight!
                </p>
            </div>
        </div>
    )
}
