import React from 'react';
import { Button } from "@/components/ui/button";
import { Github, Twitter, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-neon-cyan/20">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Game Info */}
          <div className="space-y-4">
            <h3 className="font-retro text-2xl font-black text-neon-cyan">
              BADMAN KOMBAT
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              The ultimate 80's cyberpunk fighting experience set in the heart of Kingston, Jamaica.
            </p>
            <div className="text-xs text-muted-foreground font-body">
              © 2024 BadMan Studios
            </div>
          </div>

          {/* Game Features */}
          <div className="space-y-4">
            <h4 className="font-retro text-lg text-neon-pink">FEATURES</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li>8 Unique Fighters</li>
              <li>Cyberpunk Arenas</li>
              <li>Special Kombat Moves</li>
              <li>Tournament Mode</li>
              <li>Online Multiplayer</li>
            </ul>
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <h4 className="font-retro text-lg text-neon-green">PLATFORMS</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li>PlayStation 5</li>
              <li>Xbox Series X/S</li>
              <li>Nintendo Switch</li>
              <li>PC (Steam)</li>
              <li>Arcade Cabinet</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-retro text-lg text-neon-orange">CONNECT</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="cyber" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="cyber" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="cyber" size="icon">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="cyber" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground font-body">
              Follow for updates & tournaments
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-cyan/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="text-xs text-muted-foreground font-body">
                Made with 🇯🇲 in Kingston, Jamaica • Powered by retro vibes
              </div>
              <div className="text-xs text-muted-foreground/60 font-body opacity-75">
                A TA GuruLabs Product
              </div>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground font-body">
              <a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neon-pink transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-neon-green transition-colors">Support</a>
            </div>
          </div>
        </div>

        {/* Jamaica Flag Colors Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-jamaica" />
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-neon-cyan/5 blur-3xl" />
      </div>
    </footer>
  );
};

export default Footer;