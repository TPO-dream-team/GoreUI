//Tests: PU-02, PU-04:E1
import { test, expect } from '../fixtures';
declare global {
  interface Window {
    activeMockReader: any;
    NDEFReader: any;
  }

  interface NDEFReader{
  onreading : any
  } 
}

//Tests: PU-02, PU-04
test('test new verify: PU-02, PU-04', async ({ page, context }) => {
   await page.addInitScript(() => {
    window.NDEFReader = class extends EventTarget {
        constructor() { 
            super(); 
            window.activeMockReader = this;
        }
        async scan() { return Promise.resolve(); }
        
        _triggerScan(id:any) {
            const event = new Event('reading');
            
            Object.defineProperty(event, 'serialNumber', { value: id });
            Object.defineProperty(event, 'message', { 
                value: { records: [] } 
            });

            if (typeof (this as any).onreading === 'function') {
                (this as any).onreading(event);
            }
            
            this.dispatchEvent(event);
        }
        };
    });
    await page.goto('/');

    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 46.440600, longitude: 13.654200 });

    const client = await page.context().newCDPSession(page);
    await client.send('Browser.grantPermissions', {
        permissions: ['nfc'],
        origin: page.url()
    });

    await page.waitForTimeout(10);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('#loginUsername').fill('admin');
    await page.locator('#loginPassword').fill('admin');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await page.waitForTimeout(10);
    await page.getByRole('button', { name: 'Scan' }).click();
    await page.getByRole('button', { name: 'Scan Location' }).click();

    await page.getByRole('button', { name: 'Scan Tag' }).click();

    await page.evaluate(() => {
        if (window.activeMockReader) {
            window.activeMockReader._triggerScan("4539123412345680");
        }
    });

    await page.getByRole('button', { name: 'Send data' }).click();
    await expect(page.getByText('Successfully saved!')).toBeVisible();
});

