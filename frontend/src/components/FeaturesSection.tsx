"use client";
import { Shield, Truck, Headphones, Award } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your transactions are protected with bank-level security"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping worldwide"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction or your money back"
    }
  ];

  return (
    <section className="bg-neutral-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-1 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-heading-3 text-neutral-900 mb-2">{feature.title}</h4>
                <p className="text-body-small text-neutral-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
