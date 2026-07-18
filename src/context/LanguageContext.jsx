import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add Google Translate container if not exists
    let translateDiv = document.getElementById('google_translate_element');
    if (!translateDiv) {
      translateDiv = document.createElement('div');
      translateDiv.id = 'google_translate_element';
      translateDiv.style.display = 'none';
      document.body.appendChild(translateDiv);
    }

    // Check if script is already injected
    if (window.google && window.google.translate) {
      setIsLoaded(true);
      return;
    }

    // Set callback function
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,hne',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        setIsLoaded(true);
      } catch (error) {
        console.error('Google Translate initialization failed:', error);
      }
    };

    // Inject Google Translate script
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const changeLanguage = (code) => {
    setCurrentLanguage(code);

    const select = document.querySelector('select.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    } else {
      // Retry in case Translate script elements aren't initialized yet
      let attempts = 0;
      const timer = setInterval(() => {
        const retrySelect = document.querySelector('select.goog-te-combo');
        if (retrySelect) {
          retrySelect.value = code;
          retrySelect.dispatchEvent(new Event('change'));
          clearInterval(timer);
        }
        attempts++;
        if (attempts >= 15) {
          clearInterval(timer);
          console.warn('Google Translate selector is not available in the DOM.');
        }
      }, 200);
    }
  };

  // Safe dummy translation bypass function to prevent AwardCategories component crashes.
  // Google Translate translates the rendered DOM text directly, so we just return the text as-is.
  const t = (text) => text;

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isLoaded, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
