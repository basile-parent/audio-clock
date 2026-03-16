'use client'
import { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        // créer l'instance du worker
        const worker = new Worker(
            new URL('./web-worker.ts', import.meta.url),
            { type: 'module' }
        );

        // démarrer le worker
        worker.postMessage('start');

        // réception des messages contenant la date
        worker.onmessage = (e: MessageEvent<string>) => {
            setTime(new Date(e.data));
        };

        return () => {
            // on demande l'arrêt et on détruit le worker
            worker.postMessage('stop');
            worker.terminate();
        };
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return (
        <div id="clock-container">
            <div>
                <time dateTime={time.toISOString()} className="flex gap-8 items-end justify-center leading-none mb-4">
                    <span className='hours'>{hours.toString().padStart(2, '0')}</span>
                    <span className='minutes'>{minutes.toString().padStart(2, '0')}</span>
                    <span className='seconds'>{seconds.toString().padStart(2, '0')}</span>
                </time>
                <p className="date m-0 text-center leading-none">
                    {
                        time.toLocaleDateString("fr-FR", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })
                    }
                </p>
            </div>
        </div>
    );
}

export default Clock;