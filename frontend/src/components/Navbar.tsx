"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { Menu, Dumbbell, Apple, TrendingUp, User } from "lucide-react"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "./Logo"
import { useAuth } from "@/context/AuthContext"

const navigationItems = [
    {
        title: "Workouts",
        href: "/workouts",
        icon: Dumbbell,
    },
    {
        title: "Nutrition",
        href: "/nutrition",
        icon: Apple,
    },
    {
        title: "Progress",
        href: "/progress",
        icon: TrendingUp,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
        isLoggedInOnly: true,
    },
]

const MobileMenuSection = React.memo(
    ({
        onLinkClick,
    }: {
        onLinkClick: () => void
    }) => {
        const { user } = useAuth();
        return (
            <div className="space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                        (item.isLoggedInOnly && !user) ? null : (
                            <Link
                                key={item.title}
                                to={item.href}
                                onClick={onLinkClick}
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md group"
                            >
                                <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="font-medium">{item.title}</div>
                            </Link>
                        )
                    )
                })}
            </div>
        )
    },
)

MobileMenuSection.displayName = "MobileMenuSection"


export const Navbar = React.memo(() => {
    const { user, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const closeMobileMenu = React.useCallback(() => {
        setIsMobileMenuOpen(false)
    }, [])

    return (
        <main className="h-0 relative">
            <nav className="fixed top-0 left-0 right-0 z-50 px-3 py-2 flex items-center justify-between sm:px-5 bg-white/45 dark:bg-black/45 backdrop-blur-3xl border-b">
                {/* Logo */}
                <div className="flex gap-2 items-center">
                    <Link to="/">
                        <Logo />
                    </Link>
                    <div className="hidden lg:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navigationItems.map((item) => (
                                    (!item.isLoggedInOnly || user) && (
                                        <NavigationMenuItem key={item.title}>
                                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent`}>
                                                <Link to={item.href}>{item.title}</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    )
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-2">
                    <ThemeToggle />
                    {user ? (
                        <>
                            <Button asChild variant="ghost">
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <Button onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost">
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
                            <div className="flex flex-col space-y-4 mt-6">
                                <MobileMenuSection onLinkClick={closeMobileMenu} />

                                <div className="border-t my-4"></div>

                                {user ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                logout()
                                                closeMobileMenu()
                                            }}
                                            className="w-full"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Button asChild variant="ghost" onClick={closeMobileMenu} className="w-full">
                                            <Link to="/login">Sign In</Link>
                                        </Button>
                                        <Button asChild onClick={closeMobileMenu} className="w-full">
                                            <Link to="/signup">Sign Up</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
            {/* Add padding to prevent content from hiding under fixed navbar */}
            <div className="h-[60px]" />
        </main>
    )
})

Navbar.displayName = "Navbar"
