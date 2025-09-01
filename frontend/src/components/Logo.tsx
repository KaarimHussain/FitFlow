import IMG from "@/assets/Logo.png";

export default function Logo() {
    return (
        <>
            <img
                src={IMG}
                className="h-15 w-15 object-cover object-center"
                alt="Logo"
                loading="lazy" // Lazy loads the image
                decoding="async" // Asynchronous image decoding
                width={60} // Explicit dimensions help browser allocate space
                height={60}
                fetchPriority="high" // High priority loading for logo
                onLoad={(e) => {
                    // Optional: Add loading complete callback
                    e.currentTarget.classList.add('loaded');
                }}
            />
        </>
    );
}