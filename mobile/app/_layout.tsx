"use client";
import { Stack } from "expo-router";
import "../global.css";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
  <QueryClientProvider client={queryClient}>
    <Stack screenOptions={{ headerShown: false, contentStyle: {
        backgroundColor: "#0D0D0F"
    } }} >

      <Stack.Screen name="(auth)" options={{animation:"fade"}}/>
      <Stack.Screen name="(tabs)" options={{animation: "fade" }}/>
      </Stack>
  </QueryClientProvider>
  </ClerkProvider>
);
}


