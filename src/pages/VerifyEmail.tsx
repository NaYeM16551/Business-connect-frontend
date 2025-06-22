
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationState('error');
      setErrorMessage('No verification token found in the URL.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`https://localhost:8001/api/v1/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationState('success');
        toast({
          title: "Email Verified Successfully",
          description: "Your email has been verified. You can now complete your registration.",
        });
      } else {
        setVerificationState('error');
        setErrorMessage(data.error || 'Verification failed. Please try again.');
        toast({
          title: "Verification Failed",
          description: data.error || 'Please check your verification link.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      toast({
        title: "Connection Error",
        description: "Unable to verify email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    // Navigate to the next step in the registration process
    navigate('/complete-registration');
  };

  const handleResendEmail = () => {
    // This would typically navigate back to the email request page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Connect</h1>
          <p className="text-slate-600">Professional networking platform</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Email Verification
            </CardTitle>
            <CardDescription className="text-slate-600">
              We're verifying your email address to secure your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            {verificationState === 'loading' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Verifying your email...</h3>
                <p className="text-slate-600">Please wait while we confirm your email address.</p>
              </div>
            )}

            {verificationState === 'success' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Email Verified Successfully!</h3>
                <p className="text-slate-600 mb-6">
                  Great! Your email has been verified. You can now continue with setting up your business profile.
                </p>
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                >
                  Continue to Profile Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {verificationState === 'error' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Verification Failed</h3>
                <p className="text-slate-600 mb-6">{errorMessage}</p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full py-3 text-base font-medium border-slate-300 hover:bg-slate-50"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleResendEmail}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  >
                    Request New Verification Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Need help? Contact our{' '}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
