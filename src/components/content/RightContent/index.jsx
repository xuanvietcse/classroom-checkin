import React, { useState } from "react";

import IconPlus from '../../../assets/icons/iconPlus.svg?react';

import Student from "./Student";
import ModalStudent from "../ModalStudent";

const RightContent = (props) => {

    const { currClassStudents, currClassId } = props;

    const [state, setState] = useState({
        isVisibleModalStudent: false,
        modalType: '',
        studentSelected: {},
    });

    const handleModalStudent = (type, studentSelected) => {
        setState(prev => ({
            ...prev,
            isVisibleModalStudent: !state.isVisibleModalStudent,
            modalType: type,
            studentSelected: studentSelected,
        }));
    };

    return (
        <>
            <div style={{height: 'calc(100vh - (221px))'}} className="border border-[rgb(219,219,219)] p-3 rounded-lg flex flex-col overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">Danh sách lớp</div>
                    <div
                        title='Thêm sinh viên'
                        className="p-1 hover:bg-[rgb(219,219,219)] transition-all duration-300 cursor-pointer"
                        onClick={() => handleModalStudent('add')}
                    >
                        <IconPlus />
                    </div>
                </div>
                {currClassStudents.map((item, index) => {
                    return (
                        <div key={`student-${index}`}>
                            <Student data={item} handleModalStudent={handleModalStudent}/>
                        </div>
                    )
                })}
            </div>
            {
                state.isVisibleModalStudent &&
                <ModalStudent
                    handleModalStudent={handleModalStudent}
                    type={state.modalType}
                    studentSelected={state.studentSelected}
                    currClassId={currClassId}
                    currClassStudents={currClassStudents}
                />
            }
        </>
    );
};

export default RightContent;