"use client";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import "../global.css";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthSync from "@/components/AuthSync";
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://304ee8af319e01ad991baf0ff643ae61@o4510878529093632.ingest.de.sentry.io/4510878625693776',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(), 
    Sentry.feedbackIntegration(),
    Sentry.reactNativeTracingIntegration({
      traceFetch: true,
      traceXHR: true,
      enableHTTPTimings: true,
    })
  ],
});

const queryClient = new QueryClient()

function RootLayoutContent() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {isSignedIn && <AuthSync />}
      <StatusBar style="light"/>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0F" } }} />
    </QueryClientProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  );
});