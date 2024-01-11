import React from "react";

import CheckinBlock from "./CheckinBlock";

import IconNodata from '../../../assets/icons/iconNodata.svg?react';

const LeftContent = (props) => {

    const { currClassInfo, currClassCheckinInfo } = props;

    const classTime = {
        0: 'Thứ 2',
        1: 'Thứ 3',
        2: 'Thứ 4',
        3: 'Thứ 5',
        4: 'Thứ 6',
        5: 'Thứ 7',
        6: 'Chủ nhật',
    }[currClassInfo?.classDate];

    return (
        <div className="border border-[rgb(219,219,219)] h-full rounded-lg mr-3">
            <div className="leading-3 p-3">{`Môn học: ${currClassInfo?.className}`}</div>
            <div className="leading-3 p-3">{`Lịch học: ${classTime}`}</div>
            <div className="leading-3 p-3 border-b border-[rgb(219,219,219)]">{`Sỉ số: ${currClassCheckinInfo?.length}/${currClassInfo?.numberOfStudents}`}</div>
            <div className="p-3 overflow-y-auto scrollbar-hide" style={{height: 'calc(100vh - 329px)'}}>
                {currClassCheckinInfo?.map((item, index) => {
                    return (
                        <div className="my-2" key={`checkin-${index}`}>
                            <CheckinBlock data={item}/>
                        </div>
                    )
                })}
                {currClassCheckinInfo?.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                        <IconNodata/>
                        <div className="">Không có dữ liệu</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftContent;