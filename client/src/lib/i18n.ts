// GUARDIANCHAIN Global Multi-Language Support System
// Supporting worldwide GTT token launch across all major platforms

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export type TranslationKey = 
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.save'
  | 'nav.explore'
  | 'nav.create'
  | 'nav.profile'
  | 'nav.analytics'
  | 'nav.enterprise'
  | 'footer.platform'
  | 'footer.enterprise'
  | 'footer.resources'
  | 'footer.copyright'
  | 'token.gtt'
  | 'token.balance'
  | 'token.claim'
  | 'token.stake'
  | 'token.launch'
  | 'capsule.create'
  | 'capsule.verify'
  | 'capsule.truth'
  | 'legal.privacy'
  | 'legal.terms'
  | 'legal.security'
  | 'launch.title'
  | 'launch.description'
  | 'launch.exchanges'
  | 'launch.global'
  | 'launch.worldwide';

export const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'nav.explore': 'Explore',
    'nav.create': 'Create',
    'nav.profile': 'Profile',
    'nav.analytics': 'Analytics',
    'nav.enterprise': 'Enterprise',
    'footer.platform': 'Platform',
    'footer.enterprise': 'Enterprise',
    'footer.resources': 'Resources',
    'footer.copyright': '© 2025 GUARDIANCHAIN. All rights reserved. Digital Sovereignty Secured.',
    'token.gtt': 'GTT Token',
    'token.balance': 'Balance',
    'token.claim': 'Claim',
    'token.stake': 'Stake',
    'token.launch': 'Token Launch',
    'capsule.create': 'Create Capsule',
    'capsule.verify': 'Verify',
    'capsule.truth': 'Truth Verification',
    'legal.privacy': 'Privacy Policy',
    'legal.terms': 'Terms of Service',
    'legal.security': 'Security Policy',
    'launch.title': 'Global GTT Token Launch',
    'launch.description': 'Guardian Truth Token launching on all major exchanges worldwide',
    'launch.exchanges': 'Major Exchanges',
    'launch.global': 'Global Launch',
    'launch.worldwide': 'Worldwide Deployment'
  },
  zh: {
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'nav.explore': '探索',
    'nav.create': '创建',
    'nav.profile': '个人资料',
    'nav.analytics': '分析',
    'nav.enterprise': '企业',
    'footer.platform': '平台',
    'footer.enterprise': '企业',
    'footer.resources': '资源',
    'footer.copyright': '© 2025 GUARDIANCHAIN. 保留所有权利。数字主权安全。',
    'token.gtt': 'GTT代币',
    'token.balance': '余额',
    'token.claim': '领取',
    'token.stake': '质押',
    'token.launch': '代币发布',
    'capsule.create': '创建胶囊',
    'capsule.verify': '验证',
    'capsule.truth': '真相验证',
    'legal.privacy': '隐私政策',
    'legal.terms': '服务条款',
    'legal.security': '安全政策',
    'launch.title': '全球GTT代币发布',
    'launch.description': '守护者真相代币在全球主要交易所发布',
    'launch.exchanges': '主要交易所',
    'launch.global': '全球发布',
    'launch.worldwide': '全球部署'
  },
  ja: {
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.save': '保存',
    'nav.explore': '探索',
    'nav.create': '作成',
    'nav.profile': 'プロフィール',
    'nav.analytics': '分析',
    'nav.enterprise': 'エンタープライズ',
    'footer.platform': 'プラットフォーム',
    'footer.enterprise': 'エンタープライズ',
    'footer.resources': 'リソース',
    'footer.copyright': '© 2025 GUARDIANCHAIN. 全著作権所有。デジタル主権確保。',
    'token.gtt': 'GTTトークン',
    'token.balance': '残高',
    'token.claim': '請求',
    'token.stake': 'ステーク',
    'token.launch': 'トークンローンチ',
    'capsule.create': 'カプセル作成',
    'capsule.verify': '検証',
    'capsule.truth': '真実検証',
    'legal.privacy': 'プライバシーポリシー',
    'legal.terms': '利用規約',
    'legal.security': 'セキュリティポリシー',
    'launch.title': '世界的なGTTトークンローンチ',
    'launch.description': 'ガーディアン・トゥルース・トークンを世界の主要取引所で開始',
    'launch.exchanges': '主要取引所',
    'launch.global': 'グローバルローンチ',
    'launch.worldwide': '世界的展開'
  },
  ko: {
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.save': '저장',
    'nav.explore': '탐색',
    'nav.create': '생성',
    'nav.profile': '프로필',
    'nav.analytics': '분석',
    'nav.enterprise': '기업',
    'footer.platform': '플랫폼',
    'footer.enterprise': '기업',
    'footer.resources': '리소스',
    'footer.copyright': '© 2025 GUARDIANCHAIN. 모든 권리 보유. 디지털 주권 보장.',
    'token.gtt': 'GTT 토큰',
    'token.balance': '잔액',
    'token.claim': '클레임',
    'token.stake': '스테이킹',
    'token.launch': '토큰 출시',
    'capsule.create': '캡슐 생성',
    'capsule.verify': '검증',
    'capsule.truth': '진실 검증',
    'legal.privacy': '개인정보 처리방침',
    'legal.terms': '서비스 약관',
    'legal.security': '보안 정책',
    'launch.title': '글로벌 GTT 토큰 출시',
    'launch.description': '가디언 트루스 토큰이 전 세계 주요 거래소에서 출시',
    'launch.exchanges': '주요 거래소',
    'launch.global': '글로벌 출시',
    'launch.worldwide': '전 세계 배포'
  },
  es: {
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'nav.explore': 'Explorar',
    'nav.create': 'Crear',
    'nav.profile': 'Perfil',
    'nav.analytics': 'Analítica',
    'nav.enterprise': 'Empresa',
    'footer.platform': 'Plataforma',
    'footer.enterprise': 'Empresa',
    'footer.resources': 'Recursos',
    'footer.copyright': '© 2025 GUARDIANCHAIN. Todos los derechos reservados. Soberanía Digital Asegurada.',
    'token.gtt': 'Token GTT',
    'token.balance': 'Saldo',
    'token.claim': 'Reclamar',
    'token.stake': 'Apostar',
    'token.launch': 'Lanzamiento de Token',
    'capsule.create': 'Crear Cápsula',
    'capsule.verify': 'Verificar',
    'capsule.truth': 'Verificación de Verdad',
    'legal.privacy': 'Política de Privacidad',
    'legal.terms': 'Términos de Servicio',
    'legal.security': 'Política de Seguridad',
    'launch.title': 'Lanzamiento Global del Token GTT',
    'launch.description': 'Token Guardian Truth lanzándose en todos los principales intercambios mundiales',
    'launch.exchanges': 'Principales Intercambios',
    'launch.global': 'Lanzamiento Global',
    'launch.worldwide': 'Despliegue Mundial'
  },
  fr: {
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Sauvegarder',
    'nav.explore': 'Explorer',
    'nav.create': 'Créer',
    'nav.profile': 'Profil',
    'nav.analytics': 'Analytique',
    'nav.enterprise': 'Entreprise',
    'footer.platform': 'Plateforme',
    'footer.enterprise': 'Entreprise',
    'footer.resources': 'Ressources',
    'footer.copyright': '© 2025 GUARDIANCHAIN. Tous droits réservés. Souveraineté Numérique Sécurisée.',
    'token.gtt': 'Token GTT',
    'token.balance': 'Solde',
    'token.claim': 'Réclamer',
    'token.stake': 'Miser',
    'token.launch': 'Lancement de Token',
    'capsule.create': 'Créer Capsule',
    'capsule.verify': 'Vérifier',
    'capsule.truth': 'Vérification de Vérité',
    'legal.privacy': 'Politique de Confidentialité',
    'legal.terms': 'Conditions de Service',
    'legal.security': 'Politique de Sécurité',
    'launch.title': 'Lancement Global du Token GTT',
    'launch.description': 'Le Token Guardian Truth se lance sur tous les principaux échanges mondiaux',
    'launch.exchanges': 'Principaux Échanges',
    'launch.global': 'Lancement Global',
    'launch.worldwide': 'Déploiement Mondial'
  },
  de: {
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.save': 'Speichern',
    'nav.explore': 'Erkunden',
    'nav.create': 'Erstellen',
    'nav.profile': 'Profil',
    'nav.analytics': 'Analytik',
    'nav.enterprise': 'Unternehmen',
    'footer.platform': 'Plattform',
    'footer.enterprise': 'Unternehmen',
    'footer.resources': 'Ressourcen',
    'footer.copyright': '© 2025 GUARDIANCHAIN. Alle Rechte vorbehalten. Digitale Souveränität Gesichert.',
    'token.gtt': 'GTT Token',
    'token.balance': 'Saldo',
    'token.claim': 'Beanspruchen',
    'token.stake': 'Einsetzen',
    'token.launch': 'Token-Start',
    'capsule.create': 'Kapsel Erstellen',
    'capsule.verify': 'Verifizieren',
    'capsule.truth': 'Wahrheitsverifikation',
    'legal.privacy': 'Datenschutzrichtlinie',
    'legal.terms': 'Nutzungsbedingungen',
    'legal.security': 'Sicherheitsrichtlinie',
    'launch.title': 'Globaler GTT Token Start',
    'launch.description': 'Guardian Truth Token startet auf allen großen Börsen weltweit',
    'launch.exchanges': 'Große Börsen',
    'launch.global': 'Globaler Start',
    'launch.worldwide': 'Weltweite Bereitstellung'
  },
  ru: {
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.cancel': 'Отмена',
    'common.confirm': 'Подтвердить',
    'common.save': 'Сохранить',
    'nav.explore': 'Исследовать',
    'nav.create': 'Создать',
    'nav.profile': 'Профиль',
    'nav.analytics': 'Аналитика',
    'nav.enterprise': 'Предприятие',
    'footer.platform': 'Платформа',
    'footer.enterprise': 'Предприятие',
    'footer.resources': 'Ресурсы',
    'footer.copyright': '© 2025 GUARDIANCHAIN. Все права защищены. Цифровый Суверенитет Обеспечен.',
    'token.gtt': 'Токен GTT',
    'token.balance': 'Баланс',
    'token.claim': 'Получить',
    'token.stake': 'Стейкинг',
    'token.launch': 'Запуск Токена',
    'capsule.create': 'Создать Капсулу',
    'capsule.verify': 'Верифицировать',
    'capsule.truth': 'Верификация Истины',
    'legal.privacy': 'Политика Конфиденциальности',
    'legal.terms': 'Условия Обслуживания',
    'legal.security': 'Политика Безопасности',
    'launch.title': 'Глобальный Запуск Токена GTT',
    'launch.description': 'Guardian Truth Token запускается на всех крупных биржах мира',
    'launch.exchanges': 'Основные Биржи',
    'launch.global': 'Глобальный Запуск',
    'launch.worldwide': 'Мировое Развертывание'
  },
  ar: {
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'nav.explore': 'استكشاف',
    'nav.create': 'إنشاء',
    'nav.profile': 'الملف الشخصي',
    'nav.analytics': 'التحليلات',
    'nav.enterprise': 'المؤسسة',
    'footer.platform': 'المنصة',
    'footer.enterprise': 'المؤسسة',
    'footer.resources': 'الموارد',
    'footer.copyright': '© 2025 GUARDIANCHAIN. جميع الحقوق محفوظة. السيادة الرقمية مؤمنة.',
    'token.gtt': 'رمز GTT',
    'token.balance': 'الرصيد',
    'token.claim': 'المطالبة',
    'token.stake': 'الرهان',
    'token.launch': 'إطلاق الرمز',
    'capsule.create': 'إنشاء كبسولة',
    'capsule.verify': 'التحقق',
    'capsule.truth': 'التحقق من الحقيقة',
    'legal.privacy': 'سياسة الخصوصية',
    'legal.terms': 'شروط الخدمة',
    'legal.security': 'سياسة الأمان',
    'launch.title': 'الإطلاق العالمي لرمز GTT',
    'launch.description': 'رمز Guardian Truth ينطلق في جميع البورصات الرئيسية عالمياً',
    'launch.exchanges': 'البورصات الرئيسية',
    'launch.global': 'الإطلاق العالمي',
    'launch.worldwide': 'النشر العالمي'
  }
};

class I18nManager {
  private currentLanguage: string = 'en';
  private fallbackLanguage: string = 'en';

  constructor() {
    this.detectUserLanguage();
  }

  private detectUserLanguage(): void {
    // Try to detect user's preferred language
    const savedLanguage = localStorage.getItem('guardianchain-language');
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Detect from browser
    const browserLanguage = navigator.language || navigator.languages?.[0];
    if (browserLanguage) {
      // Check exact match first
      if (this.isLanguageSupported(browserLanguage)) {
        this.currentLanguage = browserLanguage;
        return;
      }
      
      // Check language without region code
      const languageCode = browserLanguage.split('-')[0];
      if (this.isLanguageSupported(languageCode)) {
        this.currentLanguage = languageCode;
        return;
      }
    }
  }

  private isLanguageSupported(languageCode: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }

  public setLanguage(languageCode: string): void {
    if (this.isLanguageSupported(languageCode)) {
      this.currentLanguage = languageCode;
      localStorage.setItem('guardianchain-language', languageCode);
      document.documentElement.setAttribute('lang', languageCode);
      
      // Set RTL direction for Arabic
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
      if (language?.rtl) {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES;
  }

  public translate(key: TranslationKey): string {
    const currentTranslations = translations[this.currentLanguage];
    const fallbackTranslations = translations[this.fallbackLanguage];
    
    return currentTranslations?.[key] || fallbackTranslations?.[key] || key;
  }

  public t = this.translate.bind(this);
}

export const i18n = new I18nManager();

// React hook for translations
export function useTranslation() {
  return {
    t: i18n.translate.bind(i18n),
    currentLanguage: i18n.getCurrentLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    supportedLanguages: i18n.getSupportedLanguages(),
  };
}