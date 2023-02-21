import { useI18n } from "vue-i18n";
// import { TranslateOptions } from '@intlify/core-base'
import { TxKeyPath } from "./i18n";

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(key: TxKeyPath, options?: any) {
  const { t } = useI18n({});
  return key ? t(key, options) : null;
}
