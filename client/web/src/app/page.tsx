"use client"

import { useEffect, useState, useMemo } from "react"
import { NavBar } from "@/components/shared/NavBar"
import { ObjectCard } from "@/components/shared/ObjectCard"
import { CreateObjectModal } from "@/components/shared/CreateObjectModal"
import { Skeleton } from "@/components/ui/skeleton"
import { UploadCloudIcon, SearchIcon } from "lucide-react"
import io from "socket.io-client"
import { toast } from "sonner"
import { useSavedObjects } from "@/hooks/use-saved-objects"
import { WarmupLoader } from "@/components/shared/WarmupLoader"

interface StoreObject {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
}

export default function Home() {
  const [objects, setObjects] = useState<StoreObject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')
  const [isWarmingUp, setIsWarmingUp] = useState(false)
  const { savedIds } = useSavedObjects()

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
  const isRender = SERVER_URL.includes("onrender.com")

  // Fetch initial data
  const fetchObjects = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${SERVER_URL}/objects`)
      if (!res.ok) {
        // If it's a 404 or other error on Render, it might still be spinning up or actually failed
        // But persistent non-200 could also mean its waking up if we can't reach it at all
        throw new Error("Failed to fetch")
      }
      const data = await res.json()
      setObjects(data.data || [])
      setIsWarmingUp(false)
    } catch (error) {
      console.error("Error fetching objects:", error)
      if (isRender && objects.length === 0) {
        setIsWarmingUp(true)
        startPolling()
      } else if (!silent) {
        toast.error("Failed to load objects")
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${SERVER_URL}/objects`)
        if (res.ok) {
          const data = await res.json()
          setObjects(data.data || [])
          setIsWarmingUp(false)
          setLoading(false)
          clearInterval(interval)
        }
      } catch (e) {
        // Keep polling
      }
    }, 3000)

    // Cleanup interval after 2 minutes to prevent infinite loop
    setTimeout(() => clearInterval(interval), 120000)
  }

  useEffect(() => {
    fetchObjects()

    // Real-time updates
    const socket = io(SERVER_URL)

    socket.on("connect", () => {
      console.log("Connected to socket server")
    })

    socket.on("new_object", (newObject: StoreObject) => {
      setObjects((prev) => [newObject, ...prev])
      toast.success(`New object added: ${newObject.title}`)
    })

    socket.on("delete_object", (deletedId: string) => {
      setObjects((prev) => prev.filter(obj => obj.id !== deletedId))
      toast.info("Object deleted")
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // Filter objects based on search query and active tab
  const filteredObjects = useMemo(() => {
    let result = objects

    if (activeTab === 'saved') {
      result = result.filter(obj => savedIds.includes(obj.id))
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(obj =>
        obj.title.toLowerCase().includes(lowerQuery) ||
        obj.description.toLowerCase().includes(lowerQuery)
      )
    }
    return result
  }, [objects, searchQuery, activeTab, savedIds])

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar onSearch={setSearchQuery} onUploadClick={() => setIsModalOpen(true)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Upload Zone */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloudIcon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Upload New Object</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Drag & drop your high-quality images here, or click to browse from your device.
          </p>
          <div className="mt-6">
            <span className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium bg-white shadow-sm group-hover:shadow-md transition-shadow">
              Select File
            </span>
          </div>
        </div>

        {/* Filters / Headers - Sticky */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative pb-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap outline-none select-none ${activeTab === 'all'
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                All Objects <span className="ml-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">{objects.length}</span>
                {activeTab === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`relative pb-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap outline-none select-none ${activeTab === 'saved'
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Saved <span className="ml-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">{savedIds.length}</span>
                {activeTab === 'saved' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            </div>

            <div className="w-full sm:w-64 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search objects..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white hover:bg-gray-50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && !isWarmingUp ? (
            // Shimmers
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : isWarmingUp ? (
            <div className="col-span-full">
              <WarmupLoader />
            </div>
          ) : filteredObjects.length > 0 ? (
            filteredObjects.map((obj) => (
              <ObjectCard
                key={obj.id}
                {...obj}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <p>No objects found.</p>
            </div>
          )}
        </div>

      </main>

      <CreateObjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchObjects}
      />
    </div>
  )
}
