import React, { useEffect,useState } from "react";

import ClassBlock from "./ClassBlock";

import avt from '../../assets/image/avt.png';
import IconLogout from '../../assets/icons/iconLogout.svg?react';

const Sidebar = (props) => {

    const { classList, handleSelectClass, currClassId, handleLogout, currUser, classInfo } = props;
    classList.forEach((classItem) => {
    // Tìm số sinh viên có classJoin là classId
    const numberOfStudents = classInfo().data.filter(
        (student) => student.classJoin.includes(classItem.classId)).length;
    // Cập nhật lại biến numberOfStudents trong class
    if(numberOfStudents !== 0){
        classItem.numberOfStudents = numberOfStudents.toString();
    }
});


    return (
        <div className="bg-white w-full h-full rounded-lg shadow-lg p-2">
            <div className="flex justify-between p-4">
                <div className="flex">
                    <div className="mr-3">
                        <img src={currUser?.photoURL || avt} className="w-[80px] rounded-lg shadow-md"/>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-normal">{currUser?.displayName}</div>
                        <div className="font-normal text-xs opacity-65">{currUser?.email}</div>
                    </div>
                </div>
                <div
                    className="cursor-pointer h-fit flex items-center justify-center p-1 hover:bg-[rgb(219,219,219)]"
                    onClick={handleLogout}
                >
                    <IconLogout />
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto scrollbar-hide" style={{height: 'calc(100vh - (225px))'}}>
                {classList?.map((item, index) => {
                    return (
                        <div key={`class-${index}`}>
                            <ClassBlock currClassId={currClassId} data={item} handleSelectClass={handleSelectClass}/>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Sidebar;