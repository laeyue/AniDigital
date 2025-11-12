import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Smartphone, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import cropDoctorImage from "@/assets/crop-doctor.jpg";
import marketplaceImage from "@/assets/marketplace.jpg";
import climateImage from "@/assets/climate-advisory.jpg";

const features = [
  {
    icon: CloudRain,
    title: "Climate-Resilient Farming Advisory",
    description: "Hyper-local weather forecasts, SMS alerts for extreme weather, optimized planting calendars, and sustainable farming practices.",
    image: climateImage,
  },
  {
    icon: Smartphone,
    title: "AI-Powered Crop Doctor",
    description: "Use your smartphone camera to identify pests and diseases instantly. Get real-time treatment recommendations to reduce crop loss.",
    image: cropDoctorImage,
  },
  {
    icon: ShoppingCart,
    title: "Digital Marketplace (e-Palengke)",
    description: "Connect directly with buyers including restaurants, hotels, and consumers. Secure fairer prices and reduce post-harvest losses.",
    image: marketplaceImage,
  },
  {
    icon: TrendingUp,
    title: "Market Price Watch",
    description: "Access real-time and historical commodity prices from regional trading posts. Make informed decisions about when and where to sell.",
    image: null,
  },
  {
    icon: Wallet,
    title: "Basic Farm Finance Module",
    description: "Track farm expenses and revenues with simple tools. Improve financial literacy and access to microloans.",
    image: null,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comprehensive Tools for Modern Farming
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to thrive as a farmer, integrated into one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                {feature.image && (
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  />
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
