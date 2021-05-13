export const settings: { [key: string]: any } = {
  httpsOnly: false,
};

export function set(newSettings: { [key: string]: any }): void {
  Object.keys(settings).forEach((key) => {
    if (newSettings.hasOwnProperty(key)) {
      settings[key] = !!newSettings[key];
    }
  });
}

export default settings;
