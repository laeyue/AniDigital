import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Digital Farming Revolution
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Break free from the cycle of poverty. Access tools that help you make better decisions, 
            secure fair prices, and build a sustainable future for your farm and family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg" asChild>
              <Link to="/app/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link to="/app/login">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
