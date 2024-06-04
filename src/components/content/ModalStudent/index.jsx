import React, { useRef, useEffect, useState } from "react";

import { set, ref, update, get, child } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../core/firebase';

import IconClose from '../../../assets/icons/iconClose.svg?react';
import IconStudent from '../../../assets/icons/iconStudent.svg?react';

const ModalStudent = (props) => {

    const { handleModalStudent, type, studentSelected, currClassId, currClassStudents } = props;

    const [state, setState] = useState({
        name: '',
        email: '',
        mssv: '',
        phone: '',
        class: '',
        avt: '',
    });

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                handleModalStudent();
            };
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    useEffect(() => {
        setState(prev => ({
            ...prev,
            name: studentSelected?.name || '',
            email: studentSelected?.gmail || '',
            mssv: studentSelected?.mssv || '',
            phone: studentSelected?.phone || '',
            class: studentSelected?.class || '',
            avt: studentSelected?.avt || '',
        }));
    },[studentSelected]);

    const title = {
        'add': 'Thêm sinh viên',
        'edit': 'Chỉnh sửa sinh viên',
    }[type];

    const btnTitle = {
        'add': 'Thêm',
        'edit': 'Cập nhật',
    }[type];

    const infoTitle = [
        {label: 'Tên', key: 'name', state: 'name'},
        {label: 'Email', key: 'email', state: 'email'},
        {label: 'MSSV', key: 'mssv', state: 'mssv'},
        {label: 'Số điện thoại', key: 'phone', state: 'phone'},
        {label: 'Lớp sinh hoạt', key: 'class', state: 'class'},
    ];

    const handleUpdateStudent = (type) => {
        if (type === 'add') {
            if (!state.name || !state.email || !state.mssv || !state.phone || !state.class) {
                alert('Hãy nhập đủ thông tin');
                return;   
            };

            
            get(child(ref(db), "students/")).then((snapshot) => {
                const record = snapshot.val() ?? [];
                let classJoin = [];
                const values = Object.values(record);
                const isStudentExisting = values.some((item) => item.mssv === state.mssv);
                
                if (isStudentExisting) {
                    values.map((item) => {
                        if (item.mssv === state.mssv) {
                            classJoin = item?.classJoin ? [...item?.classJoin, currClassId] : [currClassId];
                        };
                    })
                } else {
                    classJoin = [currClassId];
                };

                const newStudent = {
                    name: state.name,
                    gmail: state.email,
                    mssv: state.mssv,
                    phone: state.phone,
                    class: state.class,
                    studentId: state.mssv,
                    classJoin: classJoin,
                };

                const isExist = currClassStudents.some(item => item.mssv === newStudent.mssv);
                if (isExist) {
                    alert('Sinh viên đã có trong lớp học');
                    handleModalStudent();
                    return;
                };

                set(ref(db, `students/${newStudent.mssv}`), newStudent);
            });
        };

        if (type === 'edit' && state.mssv) {
            update(ref(db, `students/${state.mssv}`),
            {
                name: state.name,
                gmail: state.email,
                mssv: state.mssv,
                phone: state.phone,
                class: state.class,
                avt: state.avt,
            });
        };

        if (type === 'remove' && state.mssv) {
            update(ref(db, `students/${state.mssv}`),
            {
                classJoin: studentSelected?.classJoin?.filter(item => item !== currClassId),
            });
        };

        handleModalStudent();
    };

    const handleChangeAvatar = (e) => {
        const file = e.target.files[0]
        const imageRef = storageRef(storage, `students_avt/${file.name}`)
        uploadBytes(imageRef, file)
            .then( (snapshot) => {
                getDownloadURL(imageRef)
                    .then(async(url) => {
                        setState(prev => ({...prev, avt: url}));
                    })
                    .catch( (error) => {
                        // console.log("err: ",error.message)
                    })
            })
            .catch( (error) => {
                // console.log(error.message)
            })
    }

    return (
        <div
        className="fixed w-screen h-screen top-0 left-0 bottom-0 right-0 bg-[rgb(89,89,89)] bg-opacity-90 flex justify-center items-center drop-shadow-2xl shadow-2xl z-[120]"
        >
            <div
                ref={modalRef}
                className="w-2/5 h-fit bg-white relative rounded-lg"
            >
                <div className="h-12 p-3 flex mb-3 items-center justify-between border-b border-[rgb(219,219,219)]">
                    <div className="font-medium">{title}</div>
                    <div
                        className="transition-all duration-200 cursor-pointer p-1 hover:bg-[rgb(219,219,219)]"
                        onClick={handleModalStudent}
                    >
                        <IconClose />
                    </div>
                </div>
                <div className="w-full p-3 flex border-b border-[rgb(219,219,219)]">
                    <div className="p-2 flex flex-col items-center justify-start cursor-pointer mr-6">
                        {state.avt.length === 0 && (
                            <IconStudent className='mb-2'/>
                        )}
                        <img src={state.avt} className={`w-[80px] h-[80px] object-cover rounded-md mb-2 ${state.avt.length === 0 ? 'hidden' : 'block'}`}/>
                        <label htmlFor="uploadAvatar" className="cursor-pointer">
                            <div className="cursor-pointer px-6 py-1 border transition-all duration-200 border-[rgb(159,159,159)] rounded-lg hover:bg-blue-200 text-sm font-medium">Đổi ảnh</div>
                        </label>
                        <input type="file" className="hidden" id="uploadAvatar" onChange={handleChangeAvatar}/>
                    </div>
                    <div className="flex-grow">
                        {infoTitle.map((item, index) => {
                            return (
                                <div
                                    key={`info-${index}`}
                                    className="flex items-center mb-4"
                                >
                                    <div className="w-1/3 text-sm">{item.label}</div>
                                    <input
                                        className="border text-sm border-[rgb(219,219,219)] outline-none p-2 rounded-lg w-2/3"
                                        value={state[item.state]}
                                        onChange={(e) => setState(prev => ({...prev, [item.state]: e.target.value}))}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={`flex h-12 ${type === 'edit' ? 'justify-between' : 'justify-end'} items-center`}>
                    {type === 'edit' && (
                        <div
                            className="text-sm px-5 ml-3 py-1 mr-3 bg-red-400 text-white rounded-md cursor-pointer"
                            onClick={() => handleUpdateStudent('remove')}
                        >
                            Xóa khỏi lớp
                        </div>
                    )}
                    <div
                        className="text-sm px-5 py-1 mr-3 bg-blue-400 text-white rounded-md cursor-pointer"
                        onClick={() => handleUpdateStudent(type)}
                    >
                        {btnTitle}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalStudent;