import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        history: 'readonly',
        location: 'readonly',
        
        // Timer globals
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        
        // Web APIs
        AudioContext: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        IntersectionObserverCallback: 'readonly',
        IntersectionObserverEntry: 'readonly',
        ResizeObserver: 'readonly',
        
        // DOM types
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        DOMRectReadOnly: 'readonly',
        
        // TypeScript/React
        React: 'readonly',
        JSX: 'readonly',
        
        // Node.js (for config files)
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        
        // Web Audio
        OscillatorNode: 'readonly',
        BiquadFilterNode: 'readonly',
        GainNode: 'readonly',
        
        // Window interface
        Window: 'readonly',
        
        // Date
        Date: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Let TypeScript handle this
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '*.config.js', '*.config.ts'],
  },
];
