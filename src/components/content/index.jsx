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
    });

    const classQuery = query(ref(db, "students"));

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

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-2">
            <Calendar />
            <div className="flex items-center flex-grow">
                <div className="w-[40%] h-full">
                    <LeftContent currClassInfo={currClassInfo} />
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