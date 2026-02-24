import { OptionEntity } from "@/utils/store";
import { OptionsUpdatedEvent } from "@/utils/events";

export default defineContentScript({
  matches: ['*://*.odoo.com/pos/*'],
  async main() {

    const patterns = [
      new MatchPattern('*://*.odoo.com/pos/ui/*/product/*'),
      new MatchPattern('*://*.odoo.com/pos/ui/*/payment/*'),
      new MatchPattern('*://*.odoo.com/pos/*'),
    ];

    onMessage('onOptionsUpdated', async ({ data: { options } }) => {

      handleCustomerChange();
      handleNotifcation(options);
      handleAutoInvoiceChange(options);

    });

    onMessage('onPageUpdated', async ({ data: { url } }) => {

      if (patterns.every(u => !u.includes(url))) return;

      const options = await sendMessage('getOptions');

      handleCustomerChange();
      handleNotifcation(options);
      handleAutoInvoiceChange(options);

    });

    await injectScript('/injected.js', {
      keepInDom: true,
      modifyScript(script) { script.defer = true; }
    });

  }

});

const handleNotifcation = (options?: OptionEntity) => {
  if (!options) return;
  document.dispatchEvent(new OptionsUpdatedEvent('onOptionsUpdated', { detail: { options } }));
}


const handleCustomerChange = () => {
  domElementObserver('tr.partner-line', (elements) => {
    elements.forEach((element) => {
      element.addEventListener('click', async () => {
        const id = parseInt(element.dataset['id']!);
        const name = element.querySelector('td:nth-child(1) > b')?.textContent;
        if (!id || !name) return;
        await sendMessage('setOptions', { options: { customer: { id, name } } });
      });
    })
  });
}


const handleAutoInvoiceChange = async (options?: OptionEntity) => {
  const button = await queryForElement('button.button.js_invoice');
  if (options && button) {
    options.autoInvoice === 'true' ?
      button.style.setProperty('display', 'none', 'important') :
      button.style.setProperty('display', 'flex', 'important');
  }
}