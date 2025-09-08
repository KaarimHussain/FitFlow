export default function RecipeDatabase() {
    return (
        <>
            <div className="min-h-screen w-full relative py-25 flex items-center justify-center">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-primary">
                        Recipe Search Assistant
                    </h1>
                    <p className="mt-2 text-sm md:text-base">
                        Ask me anything about recipes and cooking!
                    </p>
                </div>

                {/* Input Box */}
                <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-base-100 border-t border-base-300">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask about any recipe..."
                                className="w-full p-3 md:p-4 pr-12 rounded-lg border border-base-300 bg-base-200 focus:outline-none focus:border-primary placeholder:text-base-content/50"
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-content p-2 rounded-lg hover:bg-primary-focus transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}