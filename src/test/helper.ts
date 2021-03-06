import WhatsApp from "../whatsapp";
import { Color } from "../utils";

let wa_instance: WhatsApp

/** Get WA after initialized */
export function testHelperLoadWa(): Promise<WhatsApp> {
    if (wa_instance) return Promise.resolve(wa_instance)
    const wa = new WhatsApp();
    return new Promise((res, rej) => {
        wa.connect().then(
            info => {
                console.log(Color.g('Test whatsapp:'),
                    info.pushname,
                    info.phone.device_manufacturer,
                    info.phone.device_model
                );
            }
        ).catch(rej)
        wa.on('initialized', () => res(wa_instance = wa))
    })
}

export function testHelperDisconnectWa(afterSecond: number = 1) {
    return new Promise((res, rej) => {
        // just disable watchdog
        wa_instance.client.ws.stopWatchdog()
        /* setTimeout(() => {
            try {
                wa_instance.close()
                res(true)
            } catch (error) {
                rej(error)
            }
        }, afterSecond * 1000) */
    })
}

export async function testHelperSequential(jobs: (() => Promise<any>)[]) {
    const stat = {
        ok: 0,
        get fail() {
            return this.errors.length
        },
        errors: []
    }

    for (let job of jobs) {
        try {
            await job()
            stat.ok++
        } catch (error) {
            stat.errors.push(error)
        }
    }
    return stat
}