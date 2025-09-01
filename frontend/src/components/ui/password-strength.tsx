import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  // Calculate password strength
  const getStrength = (password: string): number => {
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 1
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1 // Has uppercase
    if (/[a-z]/.test(password)) strength += 1 // Has lowercase
    if (/[0-9]/.test(password)) strength += 1 // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1 // Has special character
    
    return strength
  }
  
  const strength = getStrength(password)
  
  // Determine label based on strength
  const getLabel = (strength: number): string => {
    if (password.length === 0) return "Empty"
    if (strength === 0) return "Very Weak"
    if (strength === 1) return "Weak"
    if (strength === 2) return "Fair"
    if (strength === 3) return "Good"
    if (strength === 4) return "Strong"
    return "Very Strong"
  }
  
  // Determine color based on strength
  const getColor = (strength: number): string => {
    if (password.length === 0) return "bg-muted"
    if (strength <= 1) return "bg-destructive"
    if (strength === 2) return "bg-orange-500"
    if (strength === 3) return "bg-yellow-500"
    if (strength === 4) return "bg-green-500"
    return "bg-green-600"
  }
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Password Strength</span>
        <span className={cn(
          "text-xs font-medium",
          strength <= 1 && password.length > 0 ? "text-destructive" : "",
          strength === 2 ? "text-orange-500" : "",
          strength === 3 ? "text-yellow-500" : "",
          strength >= 4 ? "text-green-500" : ""
        )}>
          {getLabel(strength)}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              index <= strength ? getColor(strength) : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}