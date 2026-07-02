# Platform Adapter

`platform.js` is the web implementation of the runtime bridge used by `game.js`.
Keep gameplay code calling `window.PigEscapePlatform` instead of directly calling
browser or WeChat APIs. A WeChat mini game build can replace this file with an
adapter that exposes the same shape.

## Required Shape

```js
window.PigEscapePlatform = {
  name: "web",
  storage: {
    getString(key, fallback) {},
    setString(key, value) {},
    getJSON(key, fallback) {},
    setJSON(key, value) {},
  },
  audio: {
    createSource(src, options) {},
  },
  ads: {
    isRewardedVideoAvailable() {},
    showRewardedVideo({ placement, context }) {},
  },
};
```

## WeChat Mapping

- `storage.getString/setString/getJSON/setJSON`: map to `wx.getStorageSync` and
  `wx.setStorageSync`.
- `audio.createSource`: map to `wx.createInnerAudioContext`.
  The returned object should provide `play`, `pause`, `cloneNode`,
  `addEventListener("ended", fn)`, `volume`, `loop`, `src`, and `currentTime`
  compatibility for the game audio layer.
- `ads.showRewardedVideo`: map to a rewarded video ad instance and return
  `{ ok: true }` only when the player finishes watching.

## Ad Placements

Use stable placement names when adding rewarded features later, for example:

- `extra_tool_use`
- `revive_level`
- `unlock_hint`

Do not scatter ad SDK calls through gameplay code. Add the reward rule in
`game.js`, then request the ad through `requestRewardedAd(placement, context)`.
