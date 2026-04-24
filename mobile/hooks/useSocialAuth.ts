import { useSSO } from "@clerk/clerk-expo";
import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

function useAuthSocial() {
  useWarmUpBrowser();
  const [loadingStrategy, setLoadingStratergy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = useCallback(async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) return;
    setLoadingStratergy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        // Handle cases like flow being interrupted or needing more steps
        console.log("Session not created or setActive not available");
      }
    } catch (error) {
      console.error("Error in social auth:", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingStratergy(null);
    }
  }, [loadingStrategy, startSSOFlow]);

  return { handleSocialAuth, loadingStrategy };
}

export default useAuthSocial;