import { defineConfig } from 'wxt';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Odoo Automate',
    description: 'Odoo Automate - Automate Repetitive Actions Within Odoo',
    permissions: ['tabs', 'webNavigation'],
    web_accessible_resources: [
      {
        matches: ['<all_urls>'],
        resources: ['injected.js'],
      },
    ]
  },
  autoIcons: {
    developmentIndicator: 'overlay'
  },
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  vite: () => ({
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: false,
        routesDirectory: 'src/entrypoints/popup/routes',
        generatedRouteTree: 'src/entrypoints/popup/routeTree.gen.ts',
      }),
    ]
  }),
});