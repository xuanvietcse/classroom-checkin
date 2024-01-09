import React from "react";

import IconPlus from '../../../assets/icons/iconPlus.svg?react';

import Student from "./Student";

const RightContent = (props) => {

    const { currClassStudents } = props;

    return (
        <div style={{height: 'calc(100vh - (221px))'}} className="border border-[rgb(219,219,219)] p-3 rounded-lg flex flex-col overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Danh sách lớp</div>
                <div title='Thêm sinh viên' className="p-1 hover:bg-[rgb(219,219,219)] transition-all duration-300 cursor-pointer">
                    <IconPlus />
                </div>
            </div>
            {currClassStudents.map((item, index) => {
                return (
                    <div key={`student-${index}`}>
                        <Student data={item}/>
                    </div>
                )
            })}
        </div>
    );
};

export default RightContent;