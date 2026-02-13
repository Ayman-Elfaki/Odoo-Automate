export default defineBackground({
  persistent: true,
  async main() {

    const patterns = [
      new MatchPattern('*://*.odoo.com/pos/ui/*/product/*'),
      new MatchPattern('*://*.odoo.com/pos/ui/*/payment/*')
    ];

    const optionsRepository = new OptionRepository();

    await optionsRepository.initialize();

    onMessage('getOptions', () => {
      return optionsRepository.getOptions();
    });

    onMessage('setOptions', async (message) => {

      await optionsRepository.setOptions(message.data.options);

      const options = await optionsRepository.getOptions();

      let [tab] = (await browser.tabs.query({ active: true, currentWindow: true }))
        .filter(t => patterns.some(u => t.url && u.includes(t.url)));

      if (!options || !tab) return;

      await sendMessage('onOptionsUpdated', { options }, tab.id);

    });

    browser.tabs?.onUpdated.addListener(async (tabId, { url }, _) => {
      if (!url) return;
      await sendMessage('onPageUpdated', url, tabId);
    });

    browser.webNavigation?.onCompleted.addListener(async ({ tabId, url }) => {
      if (!url) return;
      await sendMessage('onPageUpdated', url, tabId);
    }, { url: [{ hostContains: 'odoo.com' }] });

  },
});