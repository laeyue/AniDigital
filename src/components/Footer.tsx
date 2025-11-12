import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Ani-Digital</span>
            </div>
            <p className="text-muted-foreground">
              Empowering farmers through technology in Northern Mindanao and beyond.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#impact" className="hover:text-primary transition-colors">Impact</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Northern Mindanao, Philippines</li>
              <li>info@anidigital.ph</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-muted-foreground">
          <p>&copy; 2025 Ani-Digital. A Capstone Project by Kent Alexis T. Alia, Renato G. Beroy, Sherie Grace L. Lupoz</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
