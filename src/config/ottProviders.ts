interface OTTProviderConfig {
  appScheme?: string
  webUrlPattern: string
}

export const OTT_PROVIDERS: Record<number, OTTProviderConfig> = {
  // ── Global majors ────────────────────────────────────────────────────────────
  8: {
    appScheme: 'netflix://',
    webUrlPattern: 'https://www.netflix.com/search?q={title}',
  },
  337: {
    appScheme: 'disneyplus://',
    webUrlPattern: 'https://www.disneyplus.com/search/{title}',
  },
  // Amazon Prime Video – US (9) and international (119) share the same web URL
  9: {
    appScheme: 'aiv://',
    webUrlPattern: 'https://www.amazon.com/s?k={title}&i=instant-video',
  },
  119: {
    appScheme: 'aiv://',
    webUrlPattern: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase={title}',
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
  11: {
    webUrlPattern: 'https://mubi.com/search/{title}',
  },
  37: {
    webUrlPattern: 'https://www.sho.com/search?q={title}',
  },
  43: {
    webUrlPattern: 'https://www.starz.com/search?query={title}',
  },
  73: {
    webUrlPattern: 'https://tubitv.com/search/{title}',
  },
  269: {
    webUrlPattern: 'https://www.funimation.com/search/?q={title}',
  },
  // Google Play Movies
  3: {
    webUrlPattern: 'https://play.google.com/store/search?q={title}&c=movies',
  },
  // Apple iTunes
  2: {
    webUrlPattern: 'https://itunes.apple.com/search?term={title}&entity=movie',
  },
  // Vudu
  7: {
    webUrlPattern: 'https://www.vudu.com/content/movies/search?searchString={title}',
  },
  // Discovery+
  584: {
    webUrlPattern: 'https://www.discoveryplus.com/search?q={title}',
  },
  // BritBox
  151: {
    webUrlPattern: 'https://www.britbox.com/search?q={title}',
  },

  // ── Indian streaming ─────────────────────────────────────────────────────────
  // Disney+ Hotstar (India)
  122: {
    webUrlPattern: 'https://www.hotstar.com/in/search?q={title}',
  },
  // JioCinema
  220: {
    webUrlPattern: 'https://www.jiocinema.com/search/{title}',
  },
  // ZEE5
  232: {
    webUrlPattern: 'https://www.zee5.com/search?q={title}',
  },
  // SonyLIV
  237: {
    webUrlPattern: 'https://www.sonyliv.com/search/{title}',
  },
  // Sun NXT
  309: {
    webUrlPattern: 'https://www.sunnxt.com/search?q={title}',
  },
  // Eros Now
  218: {
    webUrlPattern: 'https://erosnow.com/search?q={title}',
  },
  // Lionsgate Play
  692: {
    webUrlPattern: 'https://www.lionsgateplay.com/search?query={title}',
  },
  // Hungama Play
  190: {
    webUrlPattern: 'https://www.hungama.com/search/{title}/',
  },
  // MX Player / MX (now merged with JioCinema)
  621: {
    webUrlPattern: 'https://www.jiocinema.com/search/{title}',
  },
  // AltBalaji
  247: {
    webUrlPattern: 'https://www.altbalaji.com/search?q={title}',
  },
  // Voot (now JioCinema)
  121: {
    webUrlPattern: 'https://www.jiocinema.com/search/{title}',
  },

  // ── Other regional ───────────────────────────────────────────────────────────
  // Rakuten Viki (Korean/Asian content)
  344: {
    webUrlPattern: 'https://www.viki.com/explore?q={title}',
  },
  // Shahid (Middle East)
  1853: {
    webUrlPattern: 'https://shahid.mbc.net/search?q={title}',
  },
}
