'use client';

import { useState } from 'react';
import { type Settings, type Wishlist } from '@/lib/api';

interface SettingsSectionProps {
  settings: Settings;
  wishlists: Wishlist[];
  onUpdate: (settings: Settings) => Promise<void>;
}

export default function SettingsSection({ settings, wishlists, onUpdate }: SettingsSectionProps) {
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Settings>(settings);
  const [settingsError, setSettingsError] = useState('');

  const publicWishlists = wishlists.filter((w) => w.isPublic);

  const startEditingSettings = () => {
    setEditingSettings(true);
    setSettingsForm({ ...settings });
    setSettingsError('');
  };

  const cancelEditingSettings = () => {
    setEditingSettings(false);
    setSettingsError('');
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');

    try {
      await onUpdate(settingsForm);
      setEditingSettings(false);
    } catch (error: any) {
      setSettingsError(error.message || 'Fehler beim Aktualisieren der Einstellungen');
    }
  };

  const getLandingPageLabel = () => {
    if (!settings.landingPageSlug) {
      return 'Übersichtsseite (Alle Wunschlisten anzeigen)';
    }
    const wishlist = wishlists.find((w) => w.slug === settings.landingPageSlug);
    return wishlist ? `Wunschliste: ${wishlist.name}` : `Wunschliste (Slug: ${settings.landingPageSlug} - Nicht gefunden)`;
  };

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Seiteneinstellungen
            </h2>
            {!editingSettings && (
              <button
                onClick={startEditingSettings}
                className="px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Einstellungen bearbeiten
              </button>
            )}
          </div>
        </div>
        <div className="p-5">
          {settingsError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg text-base">
              {settingsError}
            </div>
          )}
          {editingSettings ? (
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seitentitel
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={settingsForm.siteTitle}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, siteTitle: e.target.value }))
                  }
                  placeholder="Wishlist"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Wird für den Seitentitel und die Kopfzeile verwendet
                </p>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Untertitel der Startseite
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={settingsForm.homepageSubtext}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, homepageSubtext: e.target.value }))
                  }
                  placeholder="Durchstöbere verfügbare Wunschlisten"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Erscheint unter dem Titel auf der Startseite
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Startseite
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={settingsForm.landingPageSlug || ''}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, landingPageSlug: e.target.value || undefined }))
                  }
                >
                  <option value="">Übersichtsseite (Alle Wunschlisten anzeigen)</option>
                  <optgroup label="Öffentliche Wunschlisten">
                    {publicWishlists.map((wishlist) => (
                      <option key={wishlist.id} value={wishlist.slug}>
                        {wishlist.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Wähle, was Besucher auf der Hauptseite sehen
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="passwordLockEnabled"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={settingsForm.passwordLockEnabled}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, passwordLockEnabled: e.target.checked }))
                    }
                  />
                  <label htmlFor="passwordLockEnabled" className="ml-2 block text-base font-medium text-gray-700 dark:text-gray-300">
                    Passwortschutz aktivieren
                  </label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Wenn aktiviert, müssen Besucher ein Passwort eingeben, um die Seite zu sehen
                </p>
                {settingsForm.passwordLockEnabled && (
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Seitenpasswort
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      value={settingsForm.passwordLock || ''}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, passwordLock: e.target.value }))
                      }
                      placeholder="Passwort eingeben (leer lassen, um aktuelles zu behalten)"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Leer lassen, um das aktuelle Passwort beizubehalten
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Design anpassen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hintergrundfarbe Kopfzeile
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                        value={settingsForm.headerColorLight || '#ffffff'}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, headerColorLight: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white uppercase"
                        value={settingsForm.headerColorLight || ''}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, headerColorLight: e.target.value }))
                        }
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primärfarbe
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                        value={settingsForm.primaryColor || '#4f46e5'}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, primaryColor: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white uppercase"
                        value={settingsForm.primaryColor || ''}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, primaryColor: e.target.value }))
                        }
                        placeholder="#4F46E5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Haupt-Hintergrundfarbe
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                        value={settingsForm.backgroundColor || '#f9fafb'}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, backgroundColor: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white uppercase"
                        value={settingsForm.backgroundColor || ''}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, backgroundColor: e.target.value }))
                        }
                        placeholder="#F9FAFB"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditingSettings}
                  className="px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Einstellungen speichern
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Seitentitel</p>
                <p className="text-base text-gray-900 dark:text-white">{settings.siteTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Untertitel der Startseite</p>
                <p className="text-base text-gray-900 dark:text-white">{settings.homepageSubtext}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Startseite</p>
                <p className="text-base text-gray-900 dark:text-white">{getLandingPageLabel()}</p>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passwortschutz</p>
                <p className="text-base text-gray-900 dark:text-white">
                  {settings.passwordLockEnabled ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-base font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Aktiviert
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-base font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      Deaktiviert
                    </span>
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Design Farben</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Hintergrundfarbe Kopfzeile</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: settings.headerColorLight || '#ffffff' }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {settings.headerColorLight || 'Standard'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Primärfarbe</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: settings.primaryColor || '#4f46e5' }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {settings.primaryColor || 'Standard'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Haupt-Hintergrundfarbe</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: settings.backgroundColor || '#f9fafb' }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {settings.backgroundColor || 'Standard (Gray-50)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
