import { adminSettingsStore, updateAdminSettings } from "@/lib/admin-stores";
import { businessSettings as staticSettings } from "@/data/business";
import type { BusinessSettings } from "@/types";

export interface SettingsRepository {
  get(): BusinessSettings;
  update(data: Partial<BusinessSettings>): BusinessSettings;
}

export const settingsRepository: SettingsRepository = {
  get() {
    if (typeof window === "undefined") return staticSettings;
    return adminSettingsStore.get();
  },

  update(data) {
    updateAdminSettings(data);
    return this.get();
  },
};
