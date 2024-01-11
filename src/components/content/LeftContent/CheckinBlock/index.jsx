import React, { useEffect, useState } from "react";

import { db } from '../../../../core/firebase.js';
import { ref, get, child } from 'firebase/database';

import PreviewImage from "./PreviewImage/index.jsx";

const CheckinBlock = (props) => {

    const { data } = props;

    const [state, setState] = useState({
        currStudent: {},
        isPreviewImage: false,
    });

    useEffect(() => {
        if (data?.mssv) {
            get(child(ref(db), `students/${data?.mssv}`)).then((snapshot) => {
                const student = snapshot.val() || {};
                if (student !== null) {
                    setState(prev => ({...prev, currStudent: student}));
                };
            })
        };
    },[data]);

    const handleVisiblePreview = () => {
        setState(prev => ({...prev, isPreviewImage: !state.isPreviewImage}));
    }

    return (
        <>
            <div className="h-20 p-2 flex w-full border border-[rgb(159,159,159)] rounded-md">
                <div className="mr-2">
                    <img src={data?.avt} className="h-full rounded-md cursor-pointer" onClick={handleVisiblePreview}/>
                </div>
                <div className="flex flex-col">
                    <div className="text-blue-500 font-medium">{state.currStudent?.name}</div>
                    <div>{data?.time}</div>
                </div>
            </div>
            {state.isPreviewImage && (
                <PreviewImage url={data?.avt} handleVisiblePreview={handleVisiblePreview}/>
            )}
        </>
    );
};

export default CheckinBlock;