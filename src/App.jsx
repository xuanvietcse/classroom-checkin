import React, { useEffect, useState } from 'react';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Content from './components/content';

import { db } from './core/firebase.js';
import { ref, query, onValue } from 'firebase/database';

function App() {

    const [state, setState] = useState({
        classList: [],
    });

    const classQuery = query(ref(db, "class"));

    useEffect(() => {
        onValue(classQuery, (snapshot) => {
            const records = snapshot.val() || {};
            if (records !== null) {
                const data = Object.values(records);
                setState(prev => ({...prev, classList: data}));
            };
        });
    },[]);

    return (
        <div className='flex flex-col w-screen h-screen'>
            <div className='w-full h-[12%] border-b border-[rgb(219,219,219)]'>
                <Header />
            </div>
            <div className='w-full flex items-center h-[88%] bg-[#ECECEC]'>
                <div className='h-full w-[30%] ml-4 py-2 mr-4'>
                    <Sidebar 
                        classList={state.classList}
                    />
                </div>
                <div className='h-full w-[70%] mr-4 py-2'>
                    <Content />
                </div>
            </div>
        </div>
    )
}

export default App
