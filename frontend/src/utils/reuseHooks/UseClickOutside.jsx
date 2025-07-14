// hooks/useClickOutsideMulti.js
import { useEffect } from 'react';

const useClickOutsideMulti = (refs = [], callback) => {
    useEffect(() => {
        const handler = (event) => {
            const clickedOutsideAll = refs.every(
                ref => ref.current && !ref.current.contains(event.target)
            );

            if (clickedOutsideAll) {
                callback();
            }
        };

        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [refs, callback]);
};

export default useClickOutsideMulti;
