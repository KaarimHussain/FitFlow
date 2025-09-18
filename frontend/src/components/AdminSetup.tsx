import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const AdminSetup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const setupAdmin = async () => {
        setIsLoading(true);
        setMessage('');
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/setup-admin');
            setMessage(response.data.message);
            setIsSuccess(true);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Error setting up admin user');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Admin Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Click the button below to create the admin user with credentials:
                </p>
                <div className="text-sm">
                    <p><strong>Email:</strong> admin@fitflow.com</p>
                    <p><strong>Password:</strong> Admin12345@</p>
                </div>
                
                <Button 
                    onClick={setupAdmin} 
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Setting up...' : 'Setup Admin User'}
                </Button>
                
                {message && (
                    <div className={`p-3 rounded text-sm ${
                        isSuccess 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        {message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AdminSetup;