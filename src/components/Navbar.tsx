import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Ani-Digital</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#impact" className="text-sm font-medium hover:text-primary transition-colors">
            Impact
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
          <Button>Get Started</Button>
        </div>
        
        <Button className="md:hidden">Menu</Button>
      </div>
    </nav>
  );
};

export default Navbar;
