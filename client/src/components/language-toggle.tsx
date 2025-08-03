import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ko" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 px-2 text-gray-600 hover:text-gray-900"
      data-testid="button-language-toggle"
    >
      <Globe className="h-4 w-4 mr-1" />
      {language === "en" ? "한국어" : "English"}
    </Button>
  );
}