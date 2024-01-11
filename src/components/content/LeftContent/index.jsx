import React from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import CheckinBlock from "./CheckinBlock";

import IconNodata from '../../../assets/icons/iconNodata.svg?react';
import IconDownload from '../../../assets/icons/iconDownload.svg?react';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const LeftContent = (props) => {

    const { currClassInfo, currClassCheckinInfo, currClassStudents } = props;

    const classTime = {
        0: 'Thứ 2',
        1: 'Thứ 3',
        2: 'Thứ 4',
        3: 'Thứ 5',
        4: 'Thứ 6',
        5: 'Thứ 7',
        6: 'Chủ nhật',
    }[currClassInfo?.classDate];

    const handeDownloadExcel = () => {
        const currStudentCheckinId = currClassCheckinInfo.map(item => item?.mssv);

        const excelData = currClassStudents?.map((item, index) => {
            if (currStudentCheckinId.includes(item?.mssv)) {
                return {
                    ...item,
                    checkin: true,
                }
            } else {
                return item;
            }
        });

        const modifiedData = excelData.map(student => {
            const { classJoin, avt, ...rest } = student;
            return rest;
        });

        const ws = XLSX.utils.json_to_sheet(modifiedData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `List_checkin_${currClassInfo?.className}.xlsx`);
    }

    return (
        <div className="border border-[rgb(219,219,219)] h-full rounded-lg mr-3">
            <div className="leading-3 p-3">{`Môn học: ${currClassInfo?.className}`}</div>
            <div className="leading-3 p-3">{`Lịch học: ${classTime}`}</div>
            <div className="flex items-center justify-between border-b border-[rgb(219,219,219)]">
                <div className="leading-3 p-3 ">{`Sỉ số: ${currClassCheckinInfo?.length}/${currClassInfo?.numberOfStudents}`}</div>
                <div
                    title='Xuất file excel'
                    className="p-1 mr-2 hover:bg-[rgb(219,219,219)] transition-all duration-300 cursor-pointer"
                    onClick={handeDownloadExcel}
                >
                    <IconDownload />
                </div>
            </div>
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