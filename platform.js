(function () {
  const root = window;

  const storage = {
    getString(key, fallback = null) {
      try {
        const value = root.localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch (error) {
        return fallback;
      }
    },

    setString(key, value) {
      try {
        root.localStorage.setItem(key, String(value));
        return true;
      } catch (error) {
        return false;
      }
    },

    getJSON(key, fallback = null) {
      const value = this.getString(key, null);
      if (value === null) return fallback;
      try {
        return JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },

    setJSON(key, value) {
      try {
        return this.setString(key, JSON.stringify(value));
      } catch (error) {
        return false;
      }
    },
  };

  const audio = {
    createSource(src, options = {}) {
      const source = new Audio(src);
      source.preload = options.preload ?? "none";
      source.volume = options.volume ?? 0.35;
      source.loop = Boolean(options.loop);
      return source;
    },
  };

  const ads = {
    isRewardedVideoAvailable() {
      return false;
    },

    async showRewardedVideo() {
      return {
        ok: false,
        reason: "not_configured",
      };
    },
  };

  root.PigEscapePlatform = root.PigEscapePlatform ?? {
    name: "web",
    storage,
    audio,
    ads,
  };
})();
