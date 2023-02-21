import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import en from './en.json'
const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    globalInjection: true,
    fallbackLocale: 'fr',
    messages,
})
/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof en
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

type RecursiveKeyOf<TObj extends Record<string, any>> = {
    [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
        ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
        : `${TKey}`
}[keyof TObj & string]

export default i18n
