import { updateAdminSettings } from "@/lib/admin-stores";
import { getLiveSettings } from "@/lib/business-settings";
import type { BusinessSettings } from "@/types";

export interface SettingsRepository {
  get(): BusinessSettings;
  update(data: Partial<BusinessSettings>): BusinessSettings;
}

export const settingsRepository: SettingsRepository = {
  /** Database-backed settings provided by the root layout (see SettingsProvider). */
  get() {
    return getLiveSettings();
  },

  update(data) {
    updateAdminSettings(data);
    return this.get();
  },
};
