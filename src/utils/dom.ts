import { Observable } from 'rxjs';

export const domElementObserver = (selector: keyof HTMLElementTagNameMap | string, onElementObserved: (e: HTMLElement[]) => void) => {

    let elements: Array<HTMLElement> = [];

    const observer = new MutationObserver((mutationsList, _) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {

                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement && node.matches(selector)) {
                        elements.push(node);
                    }
                });

                if (elements.length > 0) {
                    onElementObserved(elements);
                    elements = [];
                }

            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


export function queryForElement(selector: string) {
    return new Promise<HTMLElement>(resolve => {

        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector) as HTMLElement);
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector) as HTMLElement);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}


/**
 * Creates an Observable that emits a list of MutationRecords whenever a DOM mutation occurs
 * on the target element.
 * @param target The DOM element to observe.
 * @param config The MutationObserver configuration options.
 * @returns An Observable of MutationRecord arrays.
 */
export const observeOnMutation = (target: Node, config: MutationObserverInit = { childList: true, subtree: true }): Observable<MutationRecord[]> => {
  return new Observable((observer) => {
    // Create the MutationObserver instance
    const mutation = new MutationObserver((mutations) => {
      // When a mutation occurs, emit the records to the observable's observer
      observer.next(mutations);
    });

    // Start observing the target element with the specified configuration
    mutation.observe(target, config);

    // Provide a teardown logic to stop observing when the observable is unsubscribed
    return () => {
      mutation.disconnect();
    };
  });
};