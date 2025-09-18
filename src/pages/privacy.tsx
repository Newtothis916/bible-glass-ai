import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { Shield, Eye, Lock, UserCheck, FileText, Clock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 pb-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Terms & Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: September 2024
          </p>
        </div>

        {/* Privacy Policy */}
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Information We Collect
              </h3>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes your email address, 
                prayer requests, notes, and usage data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                How We Use Your Information
              </h3>
              <p className="text-muted-foreground">
                We use your information to provide, maintain, and improve our services, 
                personalize your experience, and communicate with you about updates and features.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Information Sharing
              </h3>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy or as required by law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Data Retention
              </h3>
              <p className="text-muted-foreground">
                We retain your information for as long as necessary to provide our services 
                and fulfill the purposes outlined in this policy, unless a longer retention period 
                is required by law.
              </p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        {/* Terms of Service */}
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using this app, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Use License</h3>
              <p className="text-muted-foreground">
                Permission is granted to temporarily use this app for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">User Account</h3>
              <p className="text-muted-foreground">
                You are responsible for safeguarding the password and for maintaining the 
                confidentiality of your account. You agree not to disclose your password to any third party.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Prohibited Uses</h3>
              <p className="text-muted-foreground">
                You may not use our service for any unlawful purpose or to solicit others to perform 
                unlawful acts, to violate any international, federal, provincial, or state regulations, 
                rules, laws, or local ordinances.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms and Privacy Policy, 
                please contact us at support@bibleapp.com.
              </p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      </div>
    </MainLayout>
  );
}