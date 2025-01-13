'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface ColorScheme {
  headerBackground: string;
  headerBackgroundSecondary: string;
  headerText: string;
  pageBackground: string;
  pageBackgroundSecondary: string;
  filterBarBackground: string;
  filterBarBackgroundSecondary: string;
  filterBarText: string;
  tokenCardBackground: string;
  tokenCardBackgroundSecondary: string;
  tokenInfoBackground: string;
  tokenInfoLabelText: string;
  tokenInfoValueText: string;
  tokenHeadingText: string;
  honeypotBackground: string;
  goPlusBackground: string;
  mainText: string;
  headingText: string;
  subText: string;
  borderColor: string;
  perfMonitorBackground: string;
  perfMonitorText: string;
  statusGood: string;
  statusWarning: string;
  statusBad: string;
  honeypotLabelText: string;
  honeypotValueText: string;
  honeypotHeadingText: string;
  goPlusLabelText: string;
  goPlusValueText: string;
  goPlusHeadingText: string;
  tokenContainerBackground: string;
  statusContainerBackground: string;
  searchContainerBackground: string;
  useHeaderGradient: boolean;
  usePageGradient: boolean;
  useFilterBarGradient: boolean;
  useTokenCardGradient: boolean;
  uiSettingsBackground: string;
  uiSettingsBackgroundSecondary: string;
  connectionBarBackground: string;
  connectionBarBackgroundSecondary: string;
  useUiSettingsGradient: boolean;
  useConnectionBarGradient: boolean;
  globalGradientDirection: 'horizontal' | 'vertical';
}

const defaultColors: ColorScheme = {
  // Header
  headerBackground: 'rgba(255, 255, 255, 0.95)',
  headerBackgroundSecondary: 'rgba(240, 240, 240, 0.95)',
  headerText: '#000000',
  
  // Page
  pageBackground: '#ffffff',
  pageBackgroundSecondary: '#f8f9fa',
  
  // Filter Bar
  filterBarBackground: 'rgba(240, 240, 240, 0.95)',
  filterBarBackgroundSecondary: 'rgba(230, 230, 230, 0.95)',
  filterBarText: '#000000',
  
  // Token Card
  tokenCardBackground: 'rgba(255, 255, 255, 0.95)',
  tokenCardBackgroundSecondary: 'rgba(250, 250, 250, 0.95)',
  
  // Token Information
  tokenInfoBackground: 'rgba(240, 248, 255, 0.95)',
  tokenInfoLabelText: '#000000',
  tokenInfoValueText: '#000000',
  tokenHeadingText: '#000000',
  
  // Honeypot Section
  honeypotBackground: 'rgba(255, 244, 230, 0.95)',
  honeypotLabelText: '#000000',
  honeypotValueText: '#000000',
  honeypotHeadingText: '#000000',
  
  // GoPlus Section
  goPlusBackground: 'rgba(230, 255, 230, 0.95)',
  goPlusLabelText: '#000000',
  goPlusValueText: '#000000',
  goPlusHeadingText: '#000000',
  
  // General Text
  mainText: '#000000',
  headingText: '#000000',
  subText: '#000000',
  borderColor: 'rgba(200, 200, 200, 0.5)',
  
  // Performance Monitor
  perfMonitorBackground: 'rgba(255, 255, 255, 0.95)',
  perfMonitorText: '#000000',
  
  // Status Colors
  statusGood: '#22c55e',
  statusWarning: '#eab308',
  statusBad: '#ef4444',
  
  tokenContainerBackground: 'rgba(31, 41, 55, 0.8)',
  statusContainerBackground: 'rgba(0, 0, 0, 0.7)',
  searchContainerBackground: 'rgba(255, 255, 255, 0.1)',
  useHeaderGradient: true,
  usePageGradient: true,
  useFilterBarGradient: true,
  useTokenCardGradient: true,
  uiSettingsBackground: 'rgba(31, 41, 55, 0.8)',
  uiSettingsBackgroundSecondary: 'rgba(17, 24, 39, 0.8)',
  connectionBarBackground: 'rgba(31, 41, 55, 0.9)',
  connectionBarBackgroundSecondary: 'rgba(17, 24, 39, 0.9)',
  useUiSettingsGradient: true,
  useConnectionBarGradient: true,
  globalGradientDirection: 'horizontal',
};

const ColorContext = createContext<{
  colors: ColorScheme;
  setColors: (colors: ColorScheme) => void;
}>({
  colors: defaultColors,
  setColors: () => {},
});

export const useColors = () => useContext(ColorContext);

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ColorScheme>(() => {
    // Try to load saved colors from localStorage
    const savedColors = localStorage.getItem('uiColors');
    if (savedColors) {
      // Merge saved colors with default colors to ensure all properties exist
      return { ...defaultColors, ...JSON.parse(savedColors) };
    }
    return defaultColors;
  });

  useEffect(() => {
    // Set initial CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      if (key.startsWith('use') && key.endsWith('Gradient') && value === true) {
        const config = gradientConfig[key as keyof typeof gradientConfig];
        if (config) {
          const primaryColor = colors[config.primary as keyof ColorScheme];
          const secondaryColor = colors[config.secondary as keyof ColorScheme];
          const direction = colors.globalGradientDirection === 'horizontal' ? 'to right' : 'to bottom';
          document.documentElement.style.setProperty(
            config.var,
            `linear-gradient(${direction}, ${primaryColor}, ${secondaryColor})`
          );
        }
      } else if (!key.startsWith('use')) {
        document.documentElement.style.setProperty(`--${key}`, value.toString());
      }
    });
  }, [colors]);

  return (
    <ColorContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorContext.Provider>
  );
};

// Define gradient configuration outside component to avoid recreation
const gradientConfig = {
  useHeaderGradient: {
    var: '--headerGradient',
    primary: 'headerBackground',
    secondary: 'headerBackgroundSecondary',
  },
  usePageGradient: {
    var: '--pageGradient',
    primary: 'pageBackground',
    secondary: 'pageBackgroundSecondary',
  },
  useFilterBarGradient: {
    var: '--filterBarGradient',
    primary: 'filterBarBackground',
    secondary: 'filterBarBackgroundSecondary',
  },
  useTokenCardGradient: {
    var: '--tokenCardGradient',
    primary: 'tokenCardBackground',
    secondary: 'tokenCardBackgroundSecondary',
  },
  useUiSettingsGradient: {
    var: '--uiSettingsGradient',
    primary: 'uiSettingsBackground',
    secondary: 'uiSettingsBackgroundSecondary',
  },
  useConnectionBarGradient: {
    var: '--connectionBarGradient',
    primary: 'connectionBarBackground',
    secondary: 'connectionBarBackgroundSecondary',
  }
} as const;

interface ColorConfig {
  category: string;
  colors: Array<{
    key: keyof ColorScheme;
    label: string;
    description: string;
    hasOpacity: boolean;
    hasSecondary?: boolean;
    secondaryKey?: keyof ColorScheme;
    gradientToggleKey?: keyof ColorScheme;
    isDirectionControl?: boolean;
  }>;
}

const rgbaToHex = (rgba: string): string => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return '#000000';
  const [_, r, g, b] = match;
  const toHex = (n: string) => parseInt(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const colorConfigs: ColorConfig[] = [
  {
    category: 'Global Settings',
    colors: [
      {
        key: 'globalGradientDirection' as keyof ColorScheme,
        label: 'Gradient Direction',
        description: 'Global direction for all gradients',
        hasOpacity: false,
        isDirectionControl: true,
      }
    ]
  },
  {
    category: 'Layout & Containers',
    colors: [
      {
        key: 'pageBackground',
        label: 'Page Background',
        description: 'Primary color for the page gradient',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'pageBackgroundSecondary',
        gradientToggleKey: 'usePageGradient',
      },
      {
        key: 'headerBackground',
        label: 'Header Background',
        description: 'Primary color for the header gradient',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'headerBackgroundSecondary',
        gradientToggleKey: 'useHeaderGradient',
      },
      {
        key: 'filterBarBackground',
        label: 'Filter Bar Background',
        description: 'Primary color for the filter bar gradient',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'filterBarBackgroundSecondary',
        gradientToggleKey: 'useFilterBarGradient',
      },
      {
        key: 'tokenContainerBackground',
        label: 'Token Container Background',
        description: 'Background color for the main token container',
        hasOpacity: true,
      },
      {
        key: 'uiSettingsBackground',
        label: 'Settings Bar Background',
        description: 'Background color for the UI settings bar',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'uiSettingsBackgroundSecondary',
        gradientToggleKey: 'useUiSettingsGradient',
      },
      {
        key: 'connectionBarBackground',
        label: 'Connection Bar Background',
        description: 'Background color for the connection status bar',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'connectionBarBackgroundSecondary',
        gradientToggleKey: 'useConnectionBarGradient',
      }
    ],
  },
  {
    category: 'Token Cards',
    colors: [
      {
        key: 'tokenCardBackground',
        label: 'Card Background',
        description: 'Primary color for token cards',
        hasOpacity: true,
        hasSecondary: true,
        secondaryKey: 'tokenCardBackgroundSecondary',
        gradientToggleKey: 'useTokenCardGradient',
      },
      {
        key: 'tokenInfoBackground',
        label: 'Info Section Background',
        description: 'Background color for token information section',
        hasOpacity: true,
      },
      {
        key: 'honeypotBackground',
        label: 'Honeypot Section Background',
        description: 'Background color for honeypot analysis section',
        hasOpacity: true,
      },
      {
        key: 'goPlusBackground',
        label: 'GoPlus Section Background',
        description: 'Background color for GoPlus analysis section',
        hasOpacity: true,
      }
    ],
  },
  {
    category: 'Typography',
    colors: [
      {
        key: 'mainText',
        label: 'Main Text',
        description: 'Primary text color',
        hasOpacity: true,
      },
      {
        key: 'headingText',
        label: 'Heading Text',
        description: 'Color for headings and titles',
        hasOpacity: true,
      },
      {
        key: 'subText',
        label: 'Sub Text',
        description: 'Color for secondary text',
        hasOpacity: true,
      },
      {
        key: 'headerText',
        label: 'Header Text',
        description: 'Text color for the header',
        hasOpacity: true,
      },
      {
        key: 'filterBarText',
        label: 'Filter Bar Text',
        description: 'Text color for filter bar elements',
        hasOpacity: true,
      }
    ],
  },
  {
    category: 'Section Text Colors',
    colors: [
      {
        key: 'tokenInfoLabelText',
        label: 'Token Info Labels',
        description: 'Color for token information labels',
        hasOpacity: true,
      },
      {
        key: 'tokenInfoValueText',
        label: 'Token Info Values',
        description: 'Color for token information values',
        hasOpacity: true,
      },
      {
        key: 'tokenHeadingText',
        label: 'Token Info Headings',
        description: 'Color for token section titles',
        hasOpacity: true,
      },
      {
        key: 'honeypotLabelText',
        label: 'Honeypot Labels',
        description: 'Color for honeypot analysis labels',
        hasOpacity: true,
      },
      {
        key: 'honeypotValueText',
        label: 'Honeypot Values',
        description: 'Color for honeypot analysis values',
        hasOpacity: true,
      },
      {
        key: 'honeypotHeadingText',
        label: 'Honeypot Headings',
        description: 'Color for honeypot section titles',
        hasOpacity: true,
      },
      {
        key: 'goPlusLabelText',
        label: 'GoPlus Labels',
        description: 'Color for GoPlus analysis labels',
        hasOpacity: true,
      },
      {
        key: 'goPlusValueText',
        label: 'GoPlus Values',
        description: 'Color for GoPlus analysis values',
        hasOpacity: true,
      },
      {
        key: 'goPlusHeadingText',
        label: 'GoPlus Headings',
        description: 'Color for GoPlus section titles',
        hasOpacity: true,
      }
    ],
  },
  {
    category: 'Status & Monitoring',
    colors: [
      {
        key: 'statusGood',
        label: 'Good Status',
        description: 'Color for positive status indicators',
        hasOpacity: true,
      },
      {
        key: 'statusWarning',
        label: 'Warning Status',
        description: 'Color for warning status indicators',
        hasOpacity: true,
      },
      {
        key: 'statusBad',
        label: 'Bad Status',
        description: 'Color for negative status indicators',
        hasOpacity: true,
      },
      {
        key: 'perfMonitorBackground',
        label: 'Performance Monitor Background',
        description: 'Background color for the performance monitor',
        hasOpacity: true,
      },
      {
        key: 'perfMonitorText',
        label: 'Performance Monitor Text',
        description: 'Text color for the performance monitor',
        hasOpacity: true,
      },
      {
        key: 'borderColor',
        label: 'Border Color',
        description: 'Color for borders and dividers',
        hasOpacity: true,
      }
    ],
  }
];

export const UIColorTweaks: React.FC = () => {
  const { colors, setColors } = useColors();
  const [isExpanded, setIsExpanded] = useState<string>('Layout');
  const [hasChanges, setHasChanges] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const savedColors = localStorage.getItem('uiColors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  const getOpacityFromRgba = (rgba: string): number => {
    const match = rgba.match(/rgba\(.*,\s*([\d.]+)\)/);
    return match ? parseFloat(match[1]) : 1;
  };

  const handleColorChange = (key: keyof ColorScheme, newValue: string, isOpacity = false) => {
    const newColors = { ...colors };
    
    if (isOpacity) {
      const currentColor = colors[key];
      if (currentColor?.startsWith('rgba')) {
        const rgba = currentColor.match(/rgba\((.*)\)/)?.[1].split(',');
        if (rgba) {
          newColors[key] = `rgba(${rgba[0]},${rgba[1]},${rgba[2]}, ${newValue})`;
        }
      }
    } else {
      const hex = newValue;
      const opacity = colors[key]?.startsWith('rgba') ? getOpacityFromRgba(colors[key]) : 1;
      newColors[key] = `rgba(${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}, ${opacity})`;
    }
    
    setColors(newColors);
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('uiColors', JSON.stringify(colors));
    setHasChanges(false);
  };

  const handleSaveAsDefault = () => {
    localStorage.setItem('defaultUiColors', JSON.stringify(colors));
    handleSave();
  };

  const handleReset = () => {
    const savedDefaults = localStorage.getItem('defaultUiColors');
    const newColors = savedDefaults ? JSON.parse(savedDefaults) : defaultColors;
    setColors(newColors);
    setHasChanges(true);
  };

  const handleGradientToggle = (key: keyof ColorScheme) => {
    const newColors = { ...colors };
    newColors[key] = !colors[key];
    
    const config = gradientConfig[key as keyof typeof gradientConfig];
    if (config) {
      // Ensure secondary color exists and is initialized
      const secondaryKey = config.secondary as keyof ColorScheme;
      if (!newColors[secondaryKey]) {
        newColors[secondaryKey] = defaultColors[secondaryKey];
      }
      
      if (newColors[key]) {
        const primaryColor = newColors[config.primary as keyof ColorScheme];
        const secondaryColor = newColors[secondaryKey];
        const direction = newColors.globalGradientDirection === 'horizontal' ? 'to right' : 'to bottom';
        document.documentElement.style.setProperty(
          config.var,
          `linear-gradient(${direction}, ${primaryColor}, ${secondaryColor})`
        );
      } else {
        document.documentElement.style.removeProperty(config.var);
      }
    }
    
    setColors(newColors);
    setHasChanges(true);
  };

  const handleDirectionChange = (newDirection: 'horizontal' | 'vertical') => {
    const newColors = { ...colors, globalGradientDirection: newDirection };
    setColors(newColors);
    setHasChanges(true);

    // Update all active gradients with new direction
    Object.entries(gradientConfig).forEach(([key, config]) => {
      if (colors[key as keyof ColorScheme]) {
        const direction = newDirection === 'horizontal' ? 'to right' : 'to bottom';
        const primaryColor = colors[config.primary as keyof ColorScheme];
        const secondaryColor = colors[config.secondary as keyof ColorScheme];
        document.documentElement.style.setProperty(
          config.var,
          `linear-gradient(${direction}, ${primaryColor}, ${secondaryColor})`
        );
      }
    });
  };

  return (
    <div className="ui-tweaks-container">
      <div className="ui-tweaks-header">
        <div className="header-left">
          <button 
            className="minimize-button"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '▼' : '▲'}
          </button>
          <h3>UI Color Settings</h3>
        </div>
        <div className="ui-tweaks-actions">
          <button 
            className={`save-button ${hasChanges ? 'has-changes' : ''}`} 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </button>
          <button 
            className="save-default-button"
            onClick={handleSaveAsDefault}
          >
            Save as Default
          </button>
          <button 
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="color-categories">
          {colorConfigs.map(config => (
            <div key={config.category} className="color-category">
              <button
                className="category-toggle"
                onClick={() => setIsExpanded(
                  isExpanded === config.category ? '' : config.category
                )}
              >
                {config.category} {isExpanded === config.category ? '▼' : '▶'}
              </button>
              
              {isExpanded === config.category && (
                <div className="color-pickers-grid">
                  {config.colors.map(({ key, label, description, hasOpacity, hasSecondary, secondaryKey, gradientToggleKey, isDirectionControl }) => (
                    <div key={key} className="color-picker-group">
                      <label>
                        {label}
                        {isDirectionControl ? (
                          <div className="direction-toggle">
                            <button
                              className={`direction-button ${colors.globalGradientDirection === 'horizontal' ? 'active' : ''}`}
                              onClick={() => handleDirectionChange('horizontal')}
                            >
                              Horizontal
                            </button>
                            <button
                              className={`direction-button ${colors.globalGradientDirection === 'vertical' ? 'active' : ''}`}
                              onClick={() => handleDirectionChange('vertical')}
                            >
                              Vertical
                            </button>
                          </div>
                        ) : (
                          <div className="color-picker-inputs">
                            <input
                              type="color"
                              value={colors[key]?.startsWith('rgba') ? rgbaToHex(colors[key]) : colors[key] || defaultColors[key]}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                            />
                            {hasOpacity && (
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={colors[key]?.startsWith('rgba') ? getOpacityFromRgba(colors[key]) : 1}
                                onChange={(e) => handleColorChange(key, e.target.value, true)}
                                className="opacity-slider"
                              />
                            )}
                          </div>
                        )}
                      </label>
                      {hasSecondary && secondaryKey && gradientToggleKey && (
                        <div className="secondary-color-controls">
                          <div className="gradient-toggle">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={!!colors[gradientToggleKey]}
                                onChange={() => handleGradientToggle(gradientToggleKey)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <span>Use Gradient</span>
                          </div>
                          {colors[gradientToggleKey] && (
                            <div className="secondary-color-picker">
                              <label>Secondary Color</label>
                              <div className="color-picker-inputs">
                                <input
                                  type="color"
                                  value={colors[secondaryKey]?.startsWith('rgba') ? rgbaToHex(colors[secondaryKey]) : colors[secondaryKey] || defaultColors[secondaryKey]}
                                  onChange={(e) => handleColorChange(secondaryKey, e.target.value)}
                                />
                                {hasOpacity && (
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={colors[secondaryKey]?.startsWith('rgba') ? getOpacityFromRgba(colors[secondaryKey]) : 1}
                                    onChange={(e) => handleColorChange(secondaryKey, e.target.value, true)}
                                    className="opacity-slider"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="color-description">{description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 