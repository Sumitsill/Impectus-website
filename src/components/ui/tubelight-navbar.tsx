"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(items[0].name)
    // Removed unused isMobile state

    useEffect(() => {
        // Sync active tab with current location
        const currentItem = items.find(item => item.url === location.pathname);
        if (currentItem) {
            setActiveTab(currentItem.name);
        }
    }, [location, items]);

    return (
        <div
            className={cn(
                "fixed bottom-0 lg:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 lg:mb-0 lg:pt-6",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            to={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "relative cursor-pointer text-[10px] sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-full transition-colors",
                                "text-gray-400 hover:text-primary",
                                isActive && "bg-white/10 text-primary",
                            )}
                        >
                            <span className="hidden sm:inline">{item.name}</span>
                            <span className="sm:hidden flex flex-col items-center gap-1">
                                <Icon size={16} strokeWidth={2.5} />
                                <span className="text-[8px] font-bold uppercase tracking-tighter">{item.name}</span>
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
