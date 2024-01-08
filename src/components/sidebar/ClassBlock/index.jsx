import React from "react";

import IconBook from '../../../assets/icons/iconBook.svg?react';

const ClassBlock = (props) => {

    const { data, handleSelectClass, currClassId } = props;

    return (
        <div
            className={`h-[100px] w-full transition-all duration-300 hover:border-[#0096c7] rounded-lg border border-[rgb(189,189,189)] p-2 flex flex-col justify-between cursor-pointer mb-2 ${currClassId === data?.classId ? 'bg-blue-200' : ''}`}
            onClick={() => handleSelectClass(data?.classId)}
        >
            <div className="flex items-center">
                <IconBook className='mr-2'/>
                <div className="">{data?.className}</div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                    <div className="">Phòng</div>
                    <div className="text-[rgb(25,103,210)] font-semibold">{data?.classRoom}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="">Sỉ số</div>
                    <div className="text-[rgb(25,103,210)] font-semibold">{data?.numberOfStudents}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="">Số tiết</div>
                    <div className="text-[rgb(25,103,210)] font-semibold">{data?.classTime}</div>
                </div>
            </div>
        </div>
    );
};

export default ClassBlock;