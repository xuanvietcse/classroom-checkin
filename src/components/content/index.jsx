import React, { useEffect, useState } from "react";

import { db } from '../../core/firebase.js';
import { ref, query, onValue } from 'firebase/database';

import Calendar from "./Calendar";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";

const Content = (props) => {

    const {currClassInfo, currClassId } = props;

    const [state, setState] = useState({
        currClassStudents: [],
        currDate: new Date(),
        currClassCheckinInfo: [],
    });

    const classQuery = query(ref(db, "students"));
    const face_recognize = query(ref(db, `List_reconize/${state.currDate}/${currClassId}`));

    const addLeadingZero = (num) => {
        return num < 10 ? `0${num}` : num;
    };

    useEffect(() => {
        onValue(classQuery, (snapshot) => {
            const records = snapshot.val() || {};
            if (records !== null) {
                const data = Object.values(records);
                const students = [];
                data.map((item) => {
                    if (item?.classJoin?.includes(currClassId)) {
                        students.push(item);
                    }
                });

                setState(prev => ({...prev, currClassStudents: students}));
            };
        });
    },[currClassId]);

    const handleChangeDate = (date) => {
        const dateCollection = `${addLeadingZero(date.getDate())}-${addLeadingZero(date.getMonth() + 1)}-${date.getFullYear()}`;
        setState(prev => ({...prev, currDate: dateCollection}));
    };

    useEffect(() => {
        onValue(face_recognize, (snapshot) => {
            const records = snapshot.val() || {};
            if (records !== null) {
                const data = Object.values(records);
                setState(prev => ({...prev, currClassCheckinInfo: data}));
            };
        })
    },[state.currDate, currClassId]);

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-2">
            <Calendar handleChangeDate={handleChangeDate}/>
            <div className="flex items-center flex-grow">
                <div className="w-[40%] h-full">
                    <LeftContent
                        currClassInfo={currClassInfo}
                        currClassCheckinInfo={state.currClassCheckinInfo}
                    />
                </div>
                <div className="w-[60%] h-full">
                    <RightContent
                        currClassStudents={state.currClassStudents}
                        currClassId={currClassId}
                    />
                </div>
            </div>
        </div>
    );
};

export default Content