"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import {
    Menu,
    Dumbbell,
    Target,
    TrendingUp,
    Calendar,
    Apple,
    ChefHat,
    BarChart3,
    BookOpen,
    Ruler,
    Activity,
    LineChart,
    Trophy,
    ArrowRightIcon
} from "lucide-react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

// Enhanced feature arrays with icons and featured items
const workoutFeatures = [
    {
        title: "Create Workout",
        href: "/workouts/create",
        description: "Build custom workout routines with detailed exercise information",
        icon: Dumbbell,
        featured: true,
        color: "from-blue-500/10 to-blue-500/0 dark:from-blue-500/10 dark:to-blue-500/0"
    },
    {
        title: "My Routines",
        href: "/workouts/routines",
        description: "View and manage your saved workout routines",
        icon: Calendar,
        featured: false
    },
    {
        title: "Exercise Library",
        href: "/workouts/exercises",
        description: "Browse comprehensive exercise instructions",
        icon: BookOpen,
        featured: false
    },
    {
        title: "Workout History",
        href: "/workouts/history",
        description: "Track your workout performance over time",
        icon: TrendingUp,
        featured: false
    },
]

const nutritionFeatures = [
    {
        title: "Meal Logger",
        href: "/nutrition/log",
        description: "Log daily meals with detailed nutritional information",
        icon: Apple,
        featured: true,
        color: "from-green-500/10 to-emerald-500/0 dark:from-green-500/10 dark:to-emerald-500/0"
    },
    {
        title: "Meal Plans",
        href: "/nutrition/plans",
        description: "Create customized meal plans for your goals",
        icon: Target,
        featured: false
    },
    {
        title: "Nutrition Reports",
        href: "/nutrition/reports",
        description: "View detailed nutritional intake reports",
        icon: BarChart3,
        featured: false
    },
    {
        title: "Recipe Database",
        href: "/nutrition/recipes",
        description: "Browse healthy recipes with nutrition info",
        icon: ChefHat,
        featured: false
    },
]

const progressFeatures = [
    {
        title: "Body Metrics",
        href: "/progress/metrics",
        description: "Track weight, measurements, and physical metrics",
        icon: Ruler,
        featured: true,
        color: "from-orange-500/10 to-red-500/0 dark:from-orange-500/10 dark:to-red-500/0"
    },
    {
        title: "Performance Stats",
        href: "/progress/performance",
        description: "Monitor improvements across exercises",
        icon: Activity,
        featured: false
    },
    {
        title: "Progress Graphs",
        href: "/progress/graphs",
        description: "Visualize your fitness journey with charts",
        icon: LineChart,
        featured: false
    },
    {
        title: "Goal Setting",
        href: "/progress/goals",
        description: "Set and track fitness goals with milestones",
        icon: Trophy,
        featured: false
    },
]

// Enhanced Bento Grid Item component
const BentoGridItem = React.memo(({
    title,
    description,
    href,
    icon: Icon,
    featured = false,
    color,
    onClick,
    className
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    featured?: boolean;
    color?: string;
    onClick?: () => void;
    className?: string;
}) => {
    return (
        <NavigationMenuLink asChild>
            <Link
                to={href}
                onClick={onClick}
                className={cn(
                    "group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md hover:scale-[1.01]",
                    featured ? "col-span-2 row-span-2 p-4" : "col-span-1 p-3",
                    featured && color && `bg-gradient-to-br ${color}`,
                    "hover:border-primary/50",
                    className
                )}
            >
                <div className="flex h-full flex-col justify-between">
                    <div>
                        <div className={cn(
                            "inline-flex rounded-lg",
                            featured
                                ? "mb-3 p-2.5 bg-primary/10 text-primary"
                                : "mb-2 p-2 bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        )}>
                            <Icon className={featured ? "h-5 w-5" : "h-4 w-4"} />
                        </div>
                        <h3 className={cn(
                            "font-semibold tracking-tight",
                            featured ? "text-base mb-1.5" : "text-sm mb-1"
                        )}>
                            {title}
                        </h3>
                        <p className={cn(
                            "text-muted-foreground leading-snug",
                            featured ? "text-sm line-clamp-2" : "text-xs line-clamp-3"
                        )}>
                            {description}
                        </p>
                    </div>
                    {featured && (
                        <div className="mt-3 flex items-center text-xs font-medium text-black/50 dark:text-white/50">
                            Get Started
                            <ArrowRightIcon className="text-primary" />
                        </div>
                    )}
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
        </NavigationMenuLink>
    )
})

BentoGridItem.displayName = "BentoGridItem"

// Mobile menu section component remains similar but with icons
const MobileMenuSection = React.memo(({
    title,
    features,
    onLinkClick
}: {
    title: string;
    features: typeof workoutFeatures;
    onLinkClick: () => void
}) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-left font-medium hover:bg-accent rounded-md"
            >
                {title}
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="pl-4 space-y-1">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <Link
                                key={feature.title}
                                to={feature.href}
                                onClick={onLinkClick}
                                className="flex items-start gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md group"
                            >
                                <div className="mt-0.5 p-1.5 rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{feature.title}</div>
                                    <div className="text-muted-foreground text-xs">{feature.description}</div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
})

MobileMenuSection.displayName = "MobileMenuSection"

export const Navbar = React.memo(() => {
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
                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent`}>
                                        <Link to="/">Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} bg-transparent`}>Workouts</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[550px] p-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                {workoutFeatures.map((feature, index) => (
                                                    <BentoGridItem
                                                        key={feature.title}
                                                        title={feature.title}
                                                        description={feature.description}
                                                        href={feature.href}
                                                        icon={feature.icon}
                                                        featured={feature.featured}
                                                        color={feature.color}
                                                        className={index === 0 ? "col-start-1 row-start-1" : ""}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} bg-transparent`}>Nutrition</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[550px] p-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                {nutritionFeatures.map((feature, index) => (
                                                    <BentoGridItem
                                                        key={feature.title}
                                                        title={feature.title}
                                                        description={feature.description}
                                                        href={feature.href}
                                                        icon={feature.icon}
                                                        featured={feature.featured}
                                                        color={feature.color}
                                                        className={index === 0 ? "col-start-1 row-start-1" : ""}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} bg-transparent`}>Progress</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[550px] p-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                {progressFeatures.map((feature, index) => (
                                                    <BentoGridItem
                                                        key={feature.title}
                                                        title={feature.title}
                                                        description={feature.description}
                                                        href={feature.href}
                                                        icon={feature.icon}
                                                        featured={feature.featured}
                                                        color={feature.color}
                                                        className={index === 0 ? "col-start-1 row-start-1" : ""}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>


                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link to="/auth/sign-up">
                        <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer">
                            Get Started
                        </Button>
                    </Link>
                    <Button variant="outline" className="cursor-pointer" size="sm">
                        Login
                    </Button>
                    <ThemeToggle />
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
                            <div className="flex flex-col space-y-4 mt-6">
                                {/* Mobile Navigation Links */}
                                <Link
                                    to="/"
                                    onClick={closeMobileMenu}
                                    className="px-3 py-2 font-medium hover:bg-accent rounded-md"
                                >
                                    Home
                                </Link>

                                <MobileMenuSection
                                    title="Workouts"
                                    features={workoutFeatures}
                                    onLinkClick={closeMobileMenu}
                                />

                                <MobileMenuSection
                                    title="Nutrition"
                                    features={nutritionFeatures}
                                    onLinkClick={closeMobileMenu}
                                />

                                <MobileMenuSection
                                    title="Progress"
                                    features={progressFeatures}
                                    onLinkClick={closeMobileMenu}
                                />

                                {/* Mobile Action Buttons */}
                                <div className="flex flex-col gap-2 mt-6 px-3">
                                    <Button onClick={closeMobileMenu} className="w-full bg-gradient-to-r from-primary to-primary/80">
                                        Get Started
                                    </Button>
                                    <Button variant="outline" onClick={closeMobileMenu} className="w-full">
                                        Login
                                    </Button>
                                </div>
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