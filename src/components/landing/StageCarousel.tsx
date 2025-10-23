import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  {
    id: 'kingston-street',
    name: 'Kingston Street',
    location: 'Downtown Kingston',
    description: 'Fight in the heart of Kingston\'s bustling streets',
    image: '/assets/kingston-street-scene-1.jpg',
    timeOfDay: 'Day'
  },
  {
    id: 'kingston-alley',
    name: 'Dark Alley',
    location: 'Kingston Back Streets',
    description: 'A dangerous confrontation in the shadows',
    image: '/assets/kingston-alley-scene.jpg',
    timeOfDay: 'Night'
  },
  {
    id: 'downtown-arena',
    name: 'Downtown Arena',
    location: 'Kingston Arena',
    description: 'The ultimate proving ground for warriors',
    image: '/assets/kingston-downtown-arena.jpg',
    timeOfDay: 'Evening'
  },
  {
    id: 'negril-beach',
    name: 'Negril Beach',
    location: 'Seven Mile Beach',
    description: 'Paradise meets combat on the golden sands',
    image: '/assets/negril-beach-arena.jpg',
    timeOfDay: 'Sunset'
  },
  {
    id: 'blue-mountains',
    name: 'Blue Mountains Temple',
    location: 'Mountain Peak',
    description: 'Ancient temple where legends are made',
    image: '/assets/blue-mountains-temple.jpg',
    timeOfDay: 'Dawn'
  }
];

export const StageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % stages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + stages.length) % stages.length);

  const currentStage = stages[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
            BATTLE ARENAS
          </span>
        </h2>
        <p className="text-white/70 text-center mb-12 text-lg">
          Fight across Jamaica's most iconic locations
        </p>

        <div className="max-w-6xl mx-auto">
          {/* Main Stage Display */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 group">
            <img
              src={currentStage.image}
              alt={currentStage.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
              <div className="inline-block bg-orange-600 text-white px-3 py-1 rounded text-sm font-bold mb-2 w-fit">
                {currentStage.timeOfDay}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">{currentStage.name}</h3>
              <p className="text-red-500 font-bold text-lg mb-2">{currentStage.location}</p>
              <p className="text-white/80 max-w-2xl">{currentStage.description}</p>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={prev}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              onClick={next}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-4 overflow-x-auto pb-4">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-4 ring-red-600 scale-110' 
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={stage.image}
                  alt={stage.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
