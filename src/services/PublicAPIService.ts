
export interface Quote {
  content: string;
  author: string;
}

export interface ZenQuote {
  q: string;
  a: string;
}

export interface LocationData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  timezone: string;
}

export interface WeatherData {
  current_condition: Array<{
    temp_C: string;
    weatherDesc: Array<{ value: string }>;
  }>;
}

class PublicAPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getRandomQuote(): Promise<Quote> {
    const cacheKey = 'random-quote';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      const quote: Quote = {
        content: data.content,
        author: data.author
      };
      this.setCache(cacheKey, quote);
      return quote;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return {
        content: "A sorte favorece os corajosos no cassino da vida! 🃏",
        author: "Joker's Casino"
      };
    }
  }

  async getZenQuote(): Promise<Quote> {
    const cacheKey = 'zen-quote';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      const zenQuote: Quote = {
        content: data[0].q,
        author: data[0].a
      };
      this.setCache(cacheKey, zenQuote);
      return zenQuote;
    } catch (error) {
      console.error('Error fetching zen quote:', error);
      return {
        content: "O equilíbrio é a chave para vencer no jogo da vida.",
        author: "Filosofia Zen"
      };
    }
  }

  async getLocationData(): Promise<LocationData> {
    const cacheKey = 'location-data';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const location: LocationData = {
        ip: data.ip || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country_name: data.country_name || 'Unknown',
        timezone: data.timezone || 'UTC'
      };
      this.setCache(cacheKey, location);
      return location;
    } catch (error) {
      console.error('Error fetching location:', error);
      return {
        ip: 'Unknown',
        city: 'Joker City',
        region: 'Casino District',
        country_name: 'Gambler Paradise',
        timezone: 'UTC'
      };
    }
  }

  async getWeatherData(): Promise<WeatherData> {
    const cacheKey = 'weather-data';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await fetch('https://wttr.in/?format=j1');
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return {
        current_condition: [{
          temp_C: '25',
          weatherDesc: [{ value: 'Clear Casino Skies' }]
        }]
      };
    }
  }

  getRandomImage(width: number = 800, height: number = 600): string {
    const sources = [
      `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
      `https://source.unsplash.com/${width}x${height}/?casino,dark,neon`
    ];
    return sources[Math.floor(Math.random() * sources.length)];
  }
}

export const publicAPIService = new PublicAPIService();
