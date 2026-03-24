import { OptionEntity } from "@/utils/store";
import { fromEventPattern, debounceTime, filter, map, connect, concat, bufferCount, take } from 'rxjs';

type OnUpdatedArgs = Parameters<Parameters<typeof browser.tabs.onUpdated.addListener>[number]>;
type WebNavigationArgs = Parameters<Parameters<typeof browser.webNavigation.onCompleted.addListener>[0]>[0];

export default defineBackground({
  persistent: true,
  main() {

    fromEventPattern<OnUpdatedArgs>(h => browser.tabs?.onUpdated.addListener(h), h => browser.tabs?.onUpdated.removeListener(h))
      .pipe(map(([tabId, { url }, _]) => ({ tabId, url: url! })))
      .pipe(filter((o) => !!o.url))
      .pipe(connect(value => concat(value.pipe(take(1)), value.pipe(debounceTime(100)))))
      .subscribe(onPageUpdated);

    fromEventPattern<WebNavigationArgs>(h => browser.webNavigation?.onCompleted.addListener(h), h => browser.webNavigation?.onCompleted.removeListener(h))
      .pipe(bufferCount(1))
      .pipe(map(([{ tabId, url }]) => ({ tabId, url })))
      .pipe(filter((o) => !!o.url))
      .pipe(debounceTime(100))
      .subscribe(onPageUpdated);


    onMessage('getOptions', () => {
      return new OptionRepository().getOptions();
    });

    
    onMessage('getTabInfo', async () => {

      const patterns = [
        new MatchPattern('*://*.odoo.com/pos/*'),
      ];

      let [tab] = (await browser.tabs.query({ active: true, currentWindow: true }))
        .filter(t => patterns.some(u => t.url && u.includes(t.url)));

      return tab;
    });

    onMessage('setOptions', async ({ data: { options } }) => {
      await onOptionsUpdated({ options });
    });

  }
});

const onPageUpdated = async ({ tabId, url }: { tabId: number, url: string }) => {

  if (!url) return;

  const patterns = [
    new MatchPattern('*://*.odoo.com/*'),
  ];

  if (patterns.every(u => !u.includes(url))) return;

  await onInitOptions({ tabId });

  await sendMessage('onPageUpdated', { url }, tabId);
}


const onInitOptions = async ({ tabId }: { tabId: number }) => {
  const optionsRepository = new OptionRepository();
  await optionsRepository.initialize();
}


const onOptionsUpdated = async ({ options }: { options: Partial<OptionEntity> }) => {

  const optionsRepository = new OptionRepository();

  await optionsRepository.setOptions(options);

  const updatedOptions = await optionsRepository.getOptions();

  const patterns = [
    new MatchPattern('*://*.odoo.com/pos/*'),
  ];

  let [tab] = (await browser.tabs.query({ active: true, currentWindow: true }))
    .filter(t => patterns.some(u => t.url && u.includes(t.url)));

  if (!updatedOptions || !tab) return;

  await sendMessage('onOptionsUpdated', { options: updatedOptions }, tab.id);

}