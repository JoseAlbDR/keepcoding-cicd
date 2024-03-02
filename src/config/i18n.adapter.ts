import i18n from 'i18n';

interface i18nOptions {
  locales: string[];
  directory: string;
  defaultLocale: string;
  // autoReload: boolean;
  // syncFiles: boolean;
  cookie?: string;
}

export class i18nAdaper {
  static async configure(options: i18nOptions) {
    i18n.configure({ ...options });

    i18n.setLocale(options.defaultLocale);

    return i18n.init;
  }
}
