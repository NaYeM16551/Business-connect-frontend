
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setEmail as setRegistrationEmail } from '../store/registrationSlice'
import { useDispatch }                 from 'react-redux'

const Index = () => {
  const dispatch = useDispatch(); 
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      
      const response = await fetch('http://localhost:8080/api/v1/auth/register-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
       
      
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the verification link.",
        });
         dispatch(setRegistrationEmail(email)) // Uncomment and fix if you have setEmail action and redux setup
        setEmail('');
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send verification email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Email verification request error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Business Connect</h1>
                <p className="text-sm text-slate-600">Professional Networking Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Connect. Collaborate. <span className="text-blue-600">Grow.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of business professionals in building meaningful connections, 
            sharing expertise, and driving innovation together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Professional Networking</h3>
                <p className="text-slate-600">Connect with industry leaders, entrepreneurs, and professionals across various sectors.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Business Opportunities</h3>
                <p className="text-slate-600">Discover partnerships, collaborations, and business opportunities that drive growth.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Platform</h3>
                <p className="text-slate-600">Your professional information is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:pl-8">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Start Your Journey
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your email to begin the registration process
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Business Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Verification Email...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Verification Email
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
