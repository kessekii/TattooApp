//useAsync implementation
import { useState } from 'react';
export const useAsync = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState<any>(null);

    const run = async (promise: any) => {
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const data = await promise;
            setData(data);
            setStatus('success');
        } catch (error) {
            setError(error);
            setStatus('error');
        }
    };

    return { run, status, data, error };
};
