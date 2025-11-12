import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, TrendingUp, Leaf } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Farmers Empowered",
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Income Increase",
  },
  {
    icon: Target,
    value: "25%",
    label: "Post-Harvest Loss Reduction",
  },
  {
    icon: Leaf,
    value: "100%",
    label: "Sustainable Practices",
  },
];

const Impact = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Making Real Impact
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Breaking the cycle of poverty and empowering agricultural communities across Northern Mindanao
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="pt-6 text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary-foreground" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Impact;
