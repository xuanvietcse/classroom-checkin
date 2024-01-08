import React from 'react';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Content from './components/content';

function App() {

    return (
        <div className='flex flex-col w-screen h-screen'>
            <div className='w-full h-[12%] border-b border-[rgb(219,219,219)]'>
                <Header />
            </div>
            <div className='w-full flex items-center h-[88%] bg-[#ECECEC]'>
                <div className='h-full w-[30%] ml-4 py-2 mr-4'>
                    <Sidebar />
                </div>
                <div className='h-full w-[70%] mr-4 py-2'>
                    <Content />
                </div>
            </div>
        </div>
    )
}

export default App
