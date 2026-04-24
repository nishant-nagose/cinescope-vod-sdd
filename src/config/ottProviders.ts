interface OTTProviderConfig {
  appScheme?: string
  webUrlPattern: string
}

export const OTT_PROVIDERS: Record<number, OTTProviderConfig> = {
  8: {
    appScheme: 'netflix://',
    webUrlPattern: 'https://www.netflix.com/search?q={title}',
  },
  337: {
    appScheme: 'disneyplus://',
    webUrlPattern: 'https://www.disneyplus.com/search/{title}',
  },
  9: {
    appScheme: 'aiv://',
    webUrlPattern: 'https://www.amazon.com/s?k={title}&i=instant-video',
  },
  350: {
    appScheme: 'com.apple.tv://',
    webUrlPattern: 'https://tv.apple.com/search?term={title}',
  },
  15: {
    appScheme: 'hulu://',
    webUrlPattern: 'https://www.hulu.com/search?q={title}',
  },
  384: {
    webUrlPattern: 'https://www.max.com/search?q={title}',
  },
  1899: {
    webUrlPattern: 'https://www.max.com/search?q={title}',
  },
  531: {
    webUrlPattern: 'https://www.paramountplus.com/search/{title}/',
  },
  386: {
    webUrlPattern: 'https://www.peacocktv.com/search?q={title}',
  },
  283: {
    webUrlPattern: 'https://www.crunchyroll.com/search?q={title}',
  },
  188: {
    webUrlPattern: 'https://www.youtube.com/results?search_query={title}',
  },
}
