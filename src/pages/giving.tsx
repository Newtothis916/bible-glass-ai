import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, CreditCard, Building2, Users, Globe, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Giving() {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("app");
  const [isRecurring, setIsRecurring] = useState(false);

  const predefinedAmounts = ["$10", "$25", "$50", "$100", "$250", "$500"];

  const organizations = [
    {
      id: "app",
      name: "Bible Glass AI",
      description: "Support the development and maintenance of this app",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      type: "App Development"
    },
    {
      id: "compassion",
      name: "Compassion International",
      description: "Help children in poverty through sponsorship",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      type: "Child Sponsorship"
    },
    {
      id: "worldvision",
      name: "World Vision",
      description: "Transform communities through sustainable development",
      icon: <Globe className="w-5 h-5 text-green-500" />,
      type: "Community Development"
    },
    {
      id: "salvationarmy",
      name: "The Salvation Army",
      description: "Help those in need through emergency relief and social services",
      icon: <Building2 className="w-5 h-5 text-orange-500" />,
      type: "Emergency Relief"
    }
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount("");
  };

  const getDonationAmount = () => {
    return customAmount || selectedAmount;
  };

  const handleDonate = () => {
    const amount = getDonationAmount();
    const org = organizations.find(o => o.id === selectedOrganization);
    
    if (!amount) {
      alert("Please select or enter a donation amount");
      return;
    }

    // Here you would integrate with your payment processor
    console.log("Donation:", {
      amount,
      organization: org?.name,
      recurring: isRecurring
    });
    
    alert(`Thank you for your ${amount} donation to ${org?.name}!`);
  };

  return (
    <MainLayout currentTab="giving">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
            Giving
            <Heart className="w-6 h-6 text-red-500" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Make a difference through generous giving. Support our app or choose a trusted organization.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donation Form */}
          <LiquidGlassCard variant="default" className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Make a Donation
              </h2>
              <p className="text-muted-foreground">
                Choose an amount and organization to support
              </p>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Donation Amount</Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountSelect(amount)}
                    className="h-10"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
            </div>

            {/* Organization Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Choose Organization</Label>
              <RadioGroup value={selectedOrganization} onValueChange={setSelectedOrganization}>
                {organizations.map((org) => (
                  <div key={org.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={org.id} id={org.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={org.id} className="flex items-center gap-2 cursor-pointer">
                        {org.icon}
                        <span className="font-medium">{org.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">{org.type}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{org.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Recurring Option */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="recurring" className="text-sm cursor-pointer">
                  Make this a recurring monthly donation
                </Label>
              </div>
            </div>

            {/* Donate Button */}
            <Button 
              onClick={handleDonate}
              className="w-full h-12 text-base font-medium"
              disabled={!getDonationAmount()}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Donate {getDonationAmount() || "$0"}
              {isRecurring && " monthly"}
            </Button>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Secure payment processing powered by Stripe
            </p>
          </LiquidGlassCard>

          {/* Giving Information */}
          <div className="space-y-6">
            {/* Why Give */}
            <LiquidGlassCard variant="default" className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Why Give?
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Support the development of Bible Glass AI and its mission</p>
                <p>• Help us maintain and improve the app for all users</p>
                <p>• Enable us to add new features and content</p>
                <p>• Support trusted Christian organizations making a global impact</p>
              </div>
            </LiquidGlassCard>

            {/* Giving History */}
            <LiquidGlassCard variant="default" className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Your Giving History
              </h3>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No donations yet</p>
                <p className="text-sm text-muted-foreground">
                  Your giving history will appear here after your first donation
                </p>
              </div>
            </LiquidGlassCard>

            {/* Security Notice */}
            <LiquidGlassCard variant="default" className="p-6">
              <h3 className="font-semibold mb-3">Security & Privacy</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• All donations are processed securely through Stripe</p>
                <p>• Your payment information is never stored on our servers</p>
                <p>• You can cancel recurring donations at any time</p>
                <p>• All donations are tax-deductible where applicable</p>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}