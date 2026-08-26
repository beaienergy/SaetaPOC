import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Reglas de arquitectura (app -> pages -> features -> shared), igual que en el
// proyecto de referencia TMEIC-Ports-Frontend: una capa solo importa hacia la
// derecha, y una feature se consume solo por su barrel.
const FEATURE_BARRELS_ONLY = {
  group: ['@/features/*/*'],
  message: 'Importa una feature solo por su barrel (index.ts), no por su interior.',
}
const NO_IMPORT_APP = {
  group: ['@/app', '@/app/*'],
  message: 'app es la raiz de composicion; ninguna capa inferior debe importarla.',
}
const restrictedImports = (...patterns) => ['error', { patterns }]

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': restrictedImports(FEATURE_BARRELS_ONLY, NO_IMPORT_APP),
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/main.tsx'],
    rules: {
      'no-restricted-imports': restrictedImports(FEATURE_BARRELS_ONLY),
    },
  },
)
