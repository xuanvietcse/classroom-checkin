import React, { useEffect, useState } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import CheckinBlock from "./CheckinBlock";

import IconNodata from '../../../assets/icons/iconNodata.svg?react';
import IconDownload from '../../../assets/icons/iconDownload.svg?react';
import { getDownloadURL,getMetadata } from "firebase/storage";
import { storage } from "../../../core/firebase.js";
import { ref, listAll } from 'firebase/storage';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const LeftContent = (props) => {
    const [maSV, setMaSV] = useState([])
    const { currClassInfo, currClassCheckinInfo, currClassStudents, selectedDate, selectedShift } = props;
    const [imageUrls, setImageUrls] = useState([]);
    const classTime = {
        0: 'Thứ 2',
        1: 'Thứ 3',
        2: 'Thứ 4',
        3: 'Thứ 5',
        4: 'Thứ 6',
        5: 'Thứ 7',
        6: 'Chủ nhật',
    }[currClassInfo?.classDate];


    // Hàm để lấy tất cả các file trong folder và metadata của chúng
    async function getFilesAndMetadata(folderPath) {
        const folderRef = ref(storage, folderPath);
        const filesSnapshot = await listAll(folderRef);
        const filesData = [];
        for (const itemRef of filesSnapshot.items) {
            const metadata = await getMetadata(itemRef);
            const downloadURL = await getDownloadURL(itemRef);

            filesData.push({
                name: metadata.name,
                url: downloadURL,
                contentType: metadata.contentType,
                size: metadata.size,
                timeCreated: metadata.timeCreated,
                updated: metadata.updatedaq
            });
        }

        return filesData;
    }
    const [presentImages, setPresentImages] = useState([]);
    const [imagesOfDay, setImagesOfDay] = useState([]);
    useEffect(() => {
        if (!selectedDate) return
        getFilesAndMetadata('AttendanceInformation'+'/'+getDate())
            .then((filesData) => {
                setImagesOfDay(filesData);
            })
            .catch((error) => {
                console.log('Lỗi khi lấy metadata:', error);
            });
    }, [selectedDate]);

    useEffect(()=>{

        const images= imagesOfDay.filter((imageInfo)=>{
                    
            const date = new Date(imageInfo.timeCreated);

            // Lấy ngày, giờ, phút
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return selectedShift.includes(getStudyShift(hours,minutes,seconds))
        })
        
        const resolvedImages= images.map((value)=>{

            const date = new Date(value.timeCreated);

            // Lấy ngày, giờ, phút
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');



            const parts = value.name.split('_');
        // Lấy tên và MSSV
        const name = parts[0];
        const mssv = parts[1].split('-')[0];
            return {...value,
                name,
                mssv,
                formatDate: hours+' : '+minutes+' : '+seconds
            }
        })

        setPresentImages(resolvedImages)
       console.log(resolvedImages)
    }, [selectedShift])





    function getStudyShift(hours, minutes, seconds) {
        // Convert the time into minutes for easier comparison
        var totalMinutes = hours * 60 + Number(minutes);
        // Define study shifts with their start and end times in minutes
        var studyShifts = [
            { startTime: 420, endTime: 510 }, // 7:00 - 8:30 1
            { startTime: 510, endTime: 600 }, // 8:30 - 10:00 2
            { startTime: 600, endTime: 690 }, // 10:00 - 11:30 3
            { startTime: 690, endTime: 780 }, // 11:30 - 13:00 4
            { startTime: 780, endTime: 870 }, // 13:00 - 14:30 5
            { startTime: 870, endTime: 960 }, // 14:30 - 16:00 6
            { startTime: 960, endTime: 1050 }, // 16:00 - 17:30 7
            { startTime: 1050, endTime: 1140 }, // 17:30 - 19:00 8
            { startTime: 1140, endTime: 1290 } // 19:00 - 21:30 9
        ];
        // Find the study shift corresponding to the given time
        for (var i = 0; i < studyShifts.length; i++) {
            var shift = studyShifts[i];
            if (totalMinutes >= shift.startTime && totalMinutes < shift.endTime) {
                return (i + 1);
            }
        }

        // If the time does not match any study shift, return an error message
        return "Không có ca học cho thời gian này!";
    }

    const getDate = () => {
        // Tạo đối tượng Date từ chuỗi ngày
        const date = new Date(selectedDate);

        // Lấy ngày, tháng, năm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
        const year = date.getFullYear();

        // Ghép lại thành định dạng DDMMYYYY
        const formattedDate = `${day}${month}${year}`;
        return formattedDate
    }

    const handeDownloadExcel = () => {
        const currStudentCheckinId = currClassCheckinInfo.map(item => item?.mssv);
        const spans = document.querySelectorAll('span.masv');
        const masvArray = Array.from(spans).map(span => span.textContent);
        const tg = document.querySelectorAll('span.tgdd');
        const tgs = Array.from(tg).map(span => span.textContent);
        let excelData = currClassStudents?.map((item, index) => {
            if (currStudentCheckinId.includes(item?.mssv)) {
                return {
                    ...item,
                    checkin: true,
                }
            } else {
                return item;
            }
        }).filter(item => {
            return masvArray.includes(item.mssv)
        })
        // .map((item, index)=>{
        //     return {...item, Time: tgs[index]}
        // });

        excelData = masvArray.map((itemA, index) => {
            const studentInfo = excelData.find(itemB => itemB.mssv === itemA);
            if (studentInfo) {
                return { ...studentInfo, time: tgs[index] };
            }
            return null; // hoặc bạn có thể xử lý trường hợp sinh viên không được tìm thấy ở đây
        }).filter(item => item !== null);



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

    function getUniqueMSSV() {
        // Tạo một Set để lưu trữ các MSSV duy nhất
        const uniqueMSSVSet = new Set();
    
        // Duyệt qua mảng data và thêm MSSV vào Set
        presentImages.forEach(item => {
            uniqueMSSVSet.add(item.mssv);
        });
    
        // Chuyển Set thành mảng và trả về
        return Array.from(uniqueMSSVSet);
    }



    return (
        <div className="border border-[rgb(219,219,219)] h-full rounded-lg mr-3">
            <div className="leading-3 p-3">{`Môn học: ${currClassInfo?.className}`}</div>
            <div className="flex items-center justify-between border-b border-[rgb(219,219,219)]">
                <div className="leading-3 p-3 ">{`Sĩ số: ${getUniqueMSSV().length}/${currClassStudents?.length}`}</div>
                <div
                    title='Xuất file excel'
                    className="p-1 mr-2 hover:bg-[rgb(219,219,219)] transition-all duration-300 cursor-pointer"
                    onClick={handeDownloadExcel}
                >
                    <IconDownload />
                </div>
            </div>
            <div className="p-3 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vh - 329px)' }}>
                <div>
                    <div>
                        {presentImages.length > 0 ? (
                            <div>
                                {presentImages.map((value,index) => {
                                    return (<div style={{ display: "flex", alignItems: "center", "padding-bottom": "10px" }}>
                                        <img width={100} key={index} src={value.url} alt={`Downloaded from Firebase ${value.url}`} />
                                        <span style={{ "padding-left": "5px" }}>
                                            <span>{value.name}  - </span>
                                            <span class={"masv"}>{value.mssv}</span> -
                                            <span class={"tgdd"}> {value.formatDate}</span>
                                        </span>
                                    </div>)
                                })}
                            </div>
                        ) : (
                            <p>
                                <IconNodata />
                                <div className="">Không có dữ liệu</div>
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LeftContent;