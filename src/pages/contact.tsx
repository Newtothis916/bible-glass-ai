import { MainLayout } from "@/components/layout/main-layout";

export default function Contact() {
  return (
    <MainLayout currentTab="contact">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Contact Support</h1>
          <p className="text-muted-foreground">
            Get in touch with our support team for assistance
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-muted-foreground">
              Reach out to our support team through email or our contact form.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}