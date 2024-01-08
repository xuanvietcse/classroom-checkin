import { useEffect } from 'react';

import { ref, child, get } from 'firebase/database';
import { db } from './core/firebase';

function App() {

    const dbref = ref(db);

    useEffect(() => {
        get(child(dbref, 'students')).then((snapshot) => {
            const records = snapshot.val() ?? [];
            const values = Object.values(records);
            console.log(values);
        })
    },[]);

    return (
        <>
        </>
    )
}

export default App
