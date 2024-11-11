// Not caring about instance methods there, only properties
// See https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
interface ExtNavigatorUAData {
  brands: string[];
  mobile: boolean;
  platform: string;
}

interface ExtNavigator extends Navigator {
  userAgentData: ExtNavigatorUAData;
}

// See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
export const getPlatform = () => {  
  const nav: ExtNavigator = window.navigator as ExtNavigator;

  if (typeof nav.userAgentData !== "undefined" && typeof nav.userAgentData != null) {
    return nav.userAgentData.platform.toLowerCase();
  }

  // Deprecated but userAgentData still experimental…
  if (typeof nav.platform !== "undefined") {
    // android navigator.platform is often set as 'linux', so we have to check userAgent
    if (typeof nav.userAgent !== "undefined" && /android/.test(nav.userAgent.toLowerCase())) {
        return "android";
    }
    return nav.platform.toLowerCase();
  }
  return "unknown";
}

export const isMacish = () => {
  const MacOSPattern = /mac|ipod|iphone|ipad/i;
  const platform = getPlatform();
  return MacOSPattern.test(platform);
}