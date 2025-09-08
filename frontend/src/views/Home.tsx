import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    TrendingUp,
    Target,
    Award,
    User,
    Dumbbell,
    Apple,
    BarChart3,
    Bell,
    Users,
    Activity,
    PieChart,
    Shield,
    Server,
    Lock,
    MessageCircle,
    Download,
    BookOpen,
    Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <Hero />
            <ConnectionSection />
            <KeyFeatures />
            <Analytics />
            <Security />
            <Support />
        </main>
    )
}

const Hero = memo(() => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-accent/10 overflow-hidden pt-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.accent/8),transparent_50%)] pointer-events-none" />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Main Hero Content */}
                    <div className="text-center mb-16">
                        {/* Badge */}
                        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium rounded-full">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            #1 Fitness Tracking App
                        </Badge>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                            Achieve Your Fitness Goals with{" "}
                            <span className="bg-primary font-light px-5 py-1 text-2xl md:text-4xl lg:text-5xl rounded-2xl text-white">
                                Real-Time Tracking
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
                            Monitor Your Progress, Set Goals, and Stay Motivated with our comprehensive fitness companion that adapts
                            to your lifestyle
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link to="/auth/sign-up">
                                <Button size="lg" className="px-8 py-6 text-lg font-semibold min-w-[200px]">
                                    <Play className="w-5 h-5 mr-2" />
                                    Get Started Today
                                </Button>
                            </Link>
                        </div>

                        {/* Key Features */}
                        <div className="flex flex-wrap justify-center gap-6 mb-16">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Target className="w-4 h-4 text-primary" />
                                Goal Setting
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Progress Tracking
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Award className="w-4 h-4 text-primary" />
                                Achievement System
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
})

const ConnectionSection = memo(() => {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
    )
})

const KeyFeatures = memo(() => {
    const features = [
        {
            icon: User,
            title: "Personalized Profiles",
            description: "Create and customize your fitness journey with a secure account and personalized dashboard.",
            category: "Profile",
            highlight: false,
        },
        {
            icon: Dumbbell,
            title: "Workout Tracking",
            description:
                "Log workouts with details like sets, reps, weights, and notes. Categorize as strength, cardio, HIIT.",
            category: "Training",
            highlight: true,
        },
        {
            icon: Apple,
            title: "Nutrition Tracking",
            description:
                "Stay on top of calories & macros by logging daily meals. Track balance between protein, carbs, and fats.",
            category: "Nutrition",
            highlight: true,
        },
        {
            icon: BarChart3,
            title: "Progress Visualization",
            description: "See progress through charts for weight, performance metrics, and nutrition trends.",
            category: "Analytics",
            highlight: false,
        },
        {
            icon: Bell,
            title: "Smart Notifications",
            description: "Get reminders for workouts, meals, and goals. Stay motivated with achievement alerts.",
            category: "Motivation",
            highlight: false,
        },
        {
            icon: Users,
            title: "Community",
            description: "Discover workouts, filter nutrition logs, and connect with other fitness enthusiasts.",
            category: "Social",
            highlight: false,
        },
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                        <Zap className="w-4 h-4 mr-2" />
                        Key Features
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Everything you need to <span className="text-primary">transform</span> your fitness
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Comprehensive tools designed to support every aspect of your health and wellness journey
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => {
                            // Bento Grid sizing logic
                            const getGridClasses = (idx: number) => {
                                switch (idx) {
                                    case 0:
                                        return "md:col-span-2 lg:col-span-2" // Personalized Profiles
                                    case 1:
                                        return "md:col-span-2 lg:col-span-3" // Workout Tracking (highlight)
                                    case 2:
                                        return "md:col-span-2 lg:col-span-3" // Nutrition Tracking (highlight)
                                    case 3:
                                        return "md:col-span-2 lg:col-span-2" // Progress Visualization
                                    case 4:
                                        return "md:col-span-2 lg:col-span-2" // Smart Notifications
                                    case 5:
                                        return "md:col-span-2 lg:col-span-2" // Community
                                    default:
                                        return "md:col-span-2"
                                }
                            }

                            return (
                                <Card
                                    key={index}
                                    className={`${getGridClasses(index)} group relative overflow-hidden border-0 bg-gradient-to-br ${feature.highlight
                                        ? "from-primary/5 via-background to-primary/10 shadow-lg shadow-primary/5"
                                        : "from-background via-muted/30 to-background"
                                        } hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1`}
                                >
                                    <CardContent className={`p-8 h-full flex flex-col ${feature.highlight ? "justify-center" : ""}`}>
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className={`p-3 rounded-2xl ${feature.highlight ? "bg-primary/15 ring-2 ring-primary/20" : "bg-muted/50"
                                                    } transition-all duration-300 group-hover:scale-110`}
                                            >
                                                <feature.icon
                                                    className={`w-7 h-7 ${feature.highlight ? "text-primary" : "text-foreground/70"}`}
                                                />
                                            </div>
                                            <Badge variant="outline" className="text-xs font-medium">
                                                {feature.category}
                                            </Badge>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold mb-3 ${feature.highlight ? "text-xl" : "text-lg"}`}>{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </CardContent>
                                    {feature.highlight && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
})

const Analytics = memo(() => {
    return (
        <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics Dashboard
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Data-driven <span className="text-primary">insights</span> for optimal results
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Comprehensive analytics to track progress, identify patterns, and optimize your fitness strategy
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Main Workout Analytics - Large Card */}
                    <Card className="lg:col-span-2 group relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                        <CardContent className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center">
                                    <div className="p-4 bg-primary/15 rounded-2xl mr-6 ring-2 ring-primary/20">
                                        <Activity className="w-10 h-10 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Workout Analytics</h3>
                                        <p className="text-muted-foreground">Comprehensive training insights and performance metrics</p>
                                    </div>
                                </div>
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Trending Up
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                                        <span className="text-muted-foreground font-medium">This Week</span>
                                        <span className="text-2xl font-bold">5 workouts</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                                        <span className="text-muted-foreground font-medium">Avg Duration</span>
                                        <span className="text-2xl font-bold">52 min</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <span className="text-muted-foreground font-medium">Strength Gain</span>
                                        <span className="text-2xl font-bold text-green-600">+12%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                                        <span className="text-muted-foreground font-medium">Calories Burned</span>
                                        <span className="text-2xl font-bold">2,840</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nutrition Analytics - Smaller Card */}
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background via-muted/30 to-background hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                        <CardContent className="p-8 h-full flex flex-col">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-orange-500/15 rounded-2xl mr-4 ring-2 ring-orange-500/20">
                                    <PieChart className="w-8 h-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Nutrition</h3>
                                    <Badge variant="outline" className="text-xs">
                                        Daily Tracking
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="text-center p-4 bg-muted/30 rounded-xl">
                                    <div className="text-3xl font-bold mb-1">2,150</div>
                                    <div className="text-sm text-muted-foreground">Daily Calories</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Protein Goal</span>
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">95%</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Hydration</span>
                                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">8/8 cups</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
})

const Security = memo(() => {
    const securityFeatures = [
        {
            icon: Shield,
            title: "End-to-end Encryption",
            description: "Military-grade encryption protects all your personal fitness data",
            color: "emerald",
        },
        {
            icon: Server,
            title: "99.9% Uptime",
            description: "Reliable infrastructure with automated backups and disaster recovery",
            color: "blue",
        },
        {
            icon: Lock,
            title: "GDPR Compliant",
            description: "Full compliance with privacy regulations and data protection standards",
            color: "purple",
        },
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                        <Shield className="w-4 h-4 mr-2" />
                        Security & Trust
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        Your data is <span className="text-primary">protected</span> with enterprise-grade security
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Bank-level security measures ensure your personal fitness information stays private and secure
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {securityFeatures.map((feature, index) => {
                        const colorClasses = {
                            emerald: "from-emerald-500/5 to-emerald-500/10 ring-emerald-500/20 text-emerald-600",
                            blue: "from-blue-500/5 to-blue-500/10 ring-blue-500/20 text-blue-600",
                            purple: "from-purple-500/5 to-purple-500/10 ring-purple-500/20 text-purple-600",
                        }

                        return (
                            <Card
                                key={index}
                                className={`group relative overflow-hidden border-0 bg-gradient-to-br ${index === 1 ? "md:col-span-2 lg:col-span-1" : ""
                                    } from-background via-muted/30 to-background hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1`}
                            >
                                <CardContent className="p-8 text-center h-full flex flex-col">
                                    <div className="flex justify-center mb-6">
                                        <div
                                            className={`p-4 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses].split(" ").slice(0, 2).join(" ")} rounded-2xl ring-2 ${colorClasses[feature.color as keyof typeof colorClasses].split(" ")[2]} transition-all duration-300 group-hover:scale-110`}
                                        >
                                            <feature.icon
                                                className={`w-10 h-10 ${colorClasses[feature.color as keyof typeof colorClasses].split(" ")[3]}`}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{feature.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
})

const Support = memo(() => {
    const supportFeatures = [
        {
            icon: MessageCircle,
            title: "24/7 Support",
            description: "Built-in feedback system with real-time chat support for immediate assistance",
            highlight: true,
        },
        {
            icon: Download,
            title: "Export Reports",
            description: "Export comprehensive fitness reports in PDF and CSV formats for personal records",
            highlight: false,
        },
        {
            icon: BookOpen,
            title: "Learning Hub",
            description: "Detailed user guides, video tutorials, and fitness education resources",
            highlight: false,
        },
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                        <Target className="w-4 h-4 mr-2" />
                        Support & Resources
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                        We're here to help you <span className="text-primary">succeed</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Comprehensive support system designed to guide you through every step of your fitness journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                    {supportFeatures.map((feature, index) => {
                        const getGridClasses = (idx: number) => {
                            switch (idx) {
                                case 0:
                                    return "lg:col-span-3" // 24/7 Support (featured)
                                case 1:
                                    return "lg:col-span-2" // Export Reports
                                case 2:
                                    return "md:col-span-2 lg:col-span-5" // Learning Hub (full width)
                                default:
                                    return ""
                            }
                        }

                        return (
                            <Card
                                key={index}
                                className={`${getGridClasses(index)} group relative overflow-hidden border-0 bg-gradient-to-br ${feature.highlight
                                    ? "from-primary/5 via-background to-primary/10 shadow-lg shadow-primary/5"
                                    : "from-background via-muted/30 to-background"
                                    } hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1`}
                            >
                                <CardContent className={`p-8 ${index === 2 ? "text-center" : ""} h-full flex flex-col`}>
                                    <div className={`flex items-center ${index === 2 ? "justify-center" : ""} mb-6`}>
                                        <div
                                            className={`p-4 rounded-2xl mr-4 ${feature.highlight ? "bg-primary/15 ring-2 ring-primary/20" : "bg-muted/50"
                                                } transition-all duration-300 group-hover:scale-110`}
                                        >
                                            <feature.icon
                                                className={`w-8 h-8 ${feature.highlight ? "text-primary" : "text-foreground/70"}`}
                                            />
                                        </div>
                                        <div className={index === 2 ? "text-center" : ""}>
                                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                            {feature.highlight && (
                                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Always Available</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p
                                        className={`text-muted-foreground leading-relaxed flex-1 ${index === 2 ? "text-center max-w-2xl mx-auto" : ""
                                            }`}
                                    >
                                        {feature.description}
                                    </p>
                                </CardContent>
                                {feature.highlight && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                )}
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
})
