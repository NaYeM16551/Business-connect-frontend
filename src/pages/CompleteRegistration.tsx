
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompleteRegistration = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Connect</h1>
          <p className="text-slate-600">Professional networking platform</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Complete Your Registration
            </CardTitle>
            <CardDescription className="text-slate-600">
              This page will contain the full registration form
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="text-center py-8">
              <p className="text-slate-600 mb-6">
                Your email has been verified successfully. The complete registration form with name, password, industry, interests, and achievements will be implemented in the next step.
              </p>
              <Button 
                onClick={handleBackToHome}
                variant="outline"
                className="w-full py-3 text-base font-medium border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteRegistration;
