import '../../styles/uiComponents/LanguageSwitcher.scss';
import type { LanguageSwitcherProps } from '../../types/interfaces';

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ value, setValue }) => {
  const languages = [
    { code: 'ENG', label: 'ENG' },
    { code: 'RUS', label: 'RUS' },
  ];

  return (
    <div className="language-switcher">
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
