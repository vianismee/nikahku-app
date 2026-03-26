"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { WeddingSettings } from "@/components/settings/wedding-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { AccountSettings } from "@/components/settings/account-settings";
import { User, Heart, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola profil, pernikahan, dan preferensi akun"
      />

      <Tabs defaultValue="profile">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="wedding" className="gap-1.5">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Pernikahan</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Akun</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="wedding">
          <WeddingSettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
