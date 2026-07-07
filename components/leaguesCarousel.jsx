import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

export function LeagueTabsCarousel({ activeTab, setActiveTab, leagues }) {
  return (
    <div className="relative w-full w-full mx-auto px-12 mb-6">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          direction : "rtl"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {leagues.map((league) => {
            const isActive = activeTab === league.id;
            
            return (
              <CarouselItem 
                key={league.id} 
                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="p-1">
                  <button
                    onClick={() => setActiveTab(league.id)}
                    className="w-full text-right focus:outline-none"
                    dir="rtl"
                  >
                    <Card className={`transition-all duration-200  cursor-pointer hover:border-blue-500 ${
                      isActive 
                        ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                        : "border-gray-200 bg-white"
                    }`}>
                      <CardContent className="flex flex-col items-center justify-center ">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <img
                            src={league.logo_url}
                            alt={league.name}
                            className="object-contain max-w-full max-h-full"
                            loading="lazy"
                          />
                        </div>
                        <span className={`text-xs font-medium line-clamp-2 w-full transition-colors ${
                          isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                        }`}>
                          {/* {league.name} */}
                        </span>
                      </CardContent>
                    </Card>
                  </button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="-right-10" />
        <CarouselPrevious className="-left-10" />
      </Carousel>
    </div>
  )
}