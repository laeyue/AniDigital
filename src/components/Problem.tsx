import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Wifi } from "lucide-react";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Climate Vulnerability",
    description: "Weather volatility from droughts to heavy rains is increasingly impacting crops in Mindanao, causing massive agricultural damage and economic instability.",
  },
  {
    icon: DollarSign,
    title: "Limited Market Access",
    description: "A fragmented supply chain with up to 8 intermediary layers results in unfair pricing and post-harvest losses as high as 42% for fruits and vegetables.",
  },
  {
    icon: Wifi,
    title: "Digital Divide",
    description: "Farmers struggle with low digital literacy and fragmented tools, needing 5-6 different apps to achieve what should be integrated in one platform.",
  },
];

const Problem = () => {
  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Challenge We're Solving
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Northern Mindanao is the nation's agricultural breadbasket, yet poverty remains concentrated 
            in the farming sector. Ani-Digital addresses the root causes keeping smallholders trapped in 
            a cycle of low income and food insecurity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-destructive/10 w-fit mb-4">
                    <Icon className="h-8 w-8 text-destructive" />
                  </div>
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {challenge.description}
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

export default Problem;
