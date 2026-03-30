import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: 'zh-CN', name: t('chinese'), flag: '🇨🇳' },
    { code: 'en-US', name: t('english'), flag: '🇺🇸' }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    setIsOpen(false);
  };

  // 初始化语言
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setCurrentLanguage(savedLang);
    }
  }, []);

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const currentLang = getCurrentLanguageInfo();

  return (
    <div className={`language-switcher ${className || ''}`}>
      <div className="dropdown">
        <button 
          className="dropdown-toggle" 
          onClick={toggleDropdown}
          aria-label={t('language')}
        >
          <span className="flag">{currentLang.flag}</span>
          <span className="lang-name">{currentLang.name}</span>
          <span className="arrow">▼</span>
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`dropdown-item ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => changeLanguage(lang.code)}
                aria-label={lang.name}
              >
                <span className="flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className="checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;