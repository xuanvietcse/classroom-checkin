import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import Content from '../../components/content';

import { db, auth } from '../../core/firebase.js';
import { ref, query, onValue, get, child } from 'firebase/database';

function Mainpage() {

    const [state, setState] = useState({
        classList: [],
        currClassStudents: [],
        currClassId: '',
        currClassInfo: {},
        currUser: {},
    });
    const contentRef = useRef();
    const [x, setX] = useState(1)
    const navigate = useNavigate();

    const classQuery = query(ref(db, "class"));

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate({
                    pathname: '/login'
                });
            } else {
                setState(prev => ({ ...prev, currUser: user }));
            }
        });
    }, []);

    useEffect(() => {
        onValue(classQuery, (snapshot) => {
            const records = snapshot.val() || {};
            if (records !== null) {
                const data = Object.values(records);
                const firstClassId = state.currClassId.length > 0 ? state.currClassId : data[0]?.classId;
                handleSelectClass(firstClassId);

                get(child(ref(db), `class/${firstClassId}`)).then((snapshot) => {
                    const classRecords = snapshot.val() || {};
                    if (classRecords !== null) {
                        setState(prev => ({ ...prev, currClassInfo: classRecords }));
                    };
                });

                setState(prev => ({ ...prev, classList: data, currClassId: firstClassId }));
            };
        });
    }, []);
    const [selectedShift, setSelectedShift] = useState([0])
    const handleSelectClass = (classId) => {

        get(child(ref(db), `class/${classId}`)).then((snapshot) => {
            const classRecords = snapshot.val() || {};
            var numbersArray = classRecords.classTime.split(" ").map(Number);
            setSelectedShift(numbersArray)
            if (classRecords !== null) {
                setState(prev => ({ ...prev, currClassInfo: classRecords, currClassId: classId }));
            };
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('currUser');
        auth.signOut();
    };

    return (
        <div className='flex flex-col w-screen h-screen'>
            <div className='w-full h-[93px] border-b border-[rgb(219,219,219)]'>
                <Header />
            </div>
            <div className='w-full flex items-center flex-grow bg-[#ECECEC]'>
                <div className='h-full w-[30%] ml-4 py-2 mr-4'>
                    <Sidebar
                        classInfo={contentRef.current?.classInfo}
                        classList={state.classList.filter(x => {
                            return x.classDate == contentRef.current?.classInfo().day.getDay()
                        })}
                        currClassId={state.currClassId}
                        handleSelectClass={handleSelectClass}
                        handleLogout={handleLogout}
                        currUser={state.currUser}
                    />
                </div>
                <div className='h-full w-[70%] mr-4 py-2'>
                    <Content
                        ref={contentRef}
                        selectedShift={selectedShift}
                        setX={setX}
                        currClassStudents={state.currClassStudents}
                        currClassInfo={state.currClassInfo}
                        currClassId={state.currClassId}
                    />
                </div>
            </div>
        </div>
    )
}

export default Mainpage;
