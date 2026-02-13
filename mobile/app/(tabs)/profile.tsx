import { View, Text,Pressable } from 'react-native'
import React from 'react'
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileTab = () => {
  const { signOut } =  useAuth();
  return (
     <SafeAreaView className="bg-surface flex-1">
           <Text className="text-white">Profile Tab</Text>
            <Pressable onPress={() => signOut()} className="mt-4 bg-red-600 px-4 py-2 rounded-lg">
               <Text>
                Signout
               </Text>
            </Pressable>
      </SafeAreaView>
  )
}

export default ProfileTab