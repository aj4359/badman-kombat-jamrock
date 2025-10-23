import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Marcus Chen",
    handle: "@marcusgaming",
    avatar: "/assets/jamaican-avatar.jpg",
    text: "The most authentic Jamaican fighting game! Love the cultural representation and smooth gameplay. 🔥",
    rating: 5
  },
  {
    name: "Sarah Williams",
    handle: "@sarahfgc",
    avatar: "/assets/jamaican-avatar.jpg",
    text: "Combo system is addictive. Been grinding for hours with Leroy Iron Fist!",
    rating: 5
  },
  {
    name: "David 'DK' King",
    handle: "@dkplays",
    avatar: "/assets/jamaican-avatar.jpg",
    text: "Finally, a fighting game that celebrates Caribbean culture. The stages are beautiful!",
    rating: 5
  }
];

export const SocialProof = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-2xl mb-4">
            <Users className="w-6 h-6" />
            500K+ PLAYERS WORLDWIDE
          </div>
          <p className="text-white/70 text-lg">Join the fastest-growing fighting game community</p>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            What Players Are Saying
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-b from-gray-900 to-black border-2 border-gray-800 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-bold">{testimonial.name}</div>
                    <div className="text-white/50 text-sm">{testimonial.handle}</div>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-white/80 text-sm italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured On (Mockup) */}
        <div className="mt-16 text-center">
          <p className="text-white/50 text-sm mb-6 uppercase tracking-wider">Featured On</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            <div className="text-white font-bold text-xl">IGN</div>
            <div className="text-white font-bold text-xl">GameSpot</div>
            <div className="text-white font-bold text-xl">Kotaku</div>
            <div className="text-white font-bold text-xl">Polygon</div>
          </div>
        </div>
      </div>
    </section>
  );
};
