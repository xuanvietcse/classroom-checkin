import React, { useEffect, useState } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import CheckinBlock from "./CheckinBlock";

import IconNodata from '../../../assets/icons/iconNodata.svg?react';
import IconDownload from '../../../assets/icons/iconDownload.svg?react';
import { getDownloadURL } from "firebase/storage";
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

    useEffect(() => {
        if (!selectedDate) return
        const date = selectedDate

        // Trích xuất ngày, tháng và năm từ đối tượng Date
        const day = String(date.getDate()).padStart(2, "0"); // Chèn số 0 vào trước nếu cần
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        const year = date.getFullYear();

        // Kết hợp các thành phần thành chuỗi theo định dạng "ddMMyyyy"
        const dateString = day + month + year;

        const imagesRef = ref(storage, `AttendanceInformation/${dateString}/`);

        // Lấy danh sách các hình ảnh
        listAll(imagesRef)
            .then((result) => {
                // Tạo các promise để lấy URL tải xuống cho mỗi tệp
                const promises = result.items.map((imageRef) => getDownloadURL(imageRef));

                // Chờ tất cả các promise hoàn thành và cập nhật state
                Promise.all(promises)
                    .then((urls) => {
                        setImageUrls(urls);
                    })
                    .catch((error) => {
                        console.error('Error getting download URLs:', error.message);
                    });
            })
            .catch((error) => {
                console.error('Error listing files:', error.message);
            });
    }, [selectedDate]);

    /*async function  getImageByDate(date){
        const imagesRef = ref(storage, `AttendanceInformation/${date}/`);
 
        // Lấy danh sách các hình ảnh
        await listAll(imagesRef)
            .then((result) => {
                // Tạo các promise để lấy URL tải xuống cho mỗi tệp
                const promises = result.items.map((imageRef) => getDownloadURL(imageRef));
 
                // Chờ tất cả các promise hoàn thành và cập nhật state
                Promise.all(promises)
                    .then((urls) => {
                        setImageUrls(urls);
                    })
                    .catch((error) => {
                        console.error('Error getting download URLs:', error.message);
                    });
            })
            .catch((error) => {
                console.error('Error listing files:', error.message);
            });
    }*/
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
        }).filter(item=>{
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

    const extractFileName = (url) => {
        const parts = url.split('/');
        const fileNameWithToken = parts.pop().split('?')[0];
        return decodeURIComponent(fileNameWithToken);
    };

    const fileInfoObjects = imageUrls.map(extractFileName).map((fileInfo) => {
        // Tách chuỗi thành mảng các phần bằng cách tách dấu gạch chéo
        const parts = fileInfo.split('/');

        // Phần đầu tiên chứa thông tin về ngày
        const datePart = parts[1]; // Lấy phần trước dấu chấm
        const checkout = parts[2];
        const name = checkout.split("_")[0]
        const other = checkout.split("_")[1].split("-")
        const masv = other[0];
        const hour = other[1].substring(0, 2);
        const minute = other[1].substring(2, 4);
        const second = other[1].substring(4, 6);

        // Tạo và trả về một object chứa thông tin đã tách
        return {
            date: datePart,
            name: name,
            maSV: masv,
            hour: hour,
            minute: minute,
            second: second,
        };
    })

    const filesss = fileInfoObjects.filter((x) => {
        return selectedShift.includes(getStudyShift(x.hour, x.minute, x.second))
    });
    const getPresent = () => {
        const students = fileInfoObjects.map(e => e.maSV)
        const uniqueMaSVSet = new Set(students);
        const uniqueMaSVArray = Array.from(uniqueMaSVSet);
        const maSVInClass = currClassStudents.map(e => e.mssv);

        return uniqueMaSVArray.filter(item => maSVInClass.indexOf(item) !== -1).length;
    }
    getPresent()

    // Define a function to get the study shift based on the given time
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

    // Define a function to format time in minutes to hours:minutes
    function formatTime(minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins;
    }

    return (
        <div className="border border-[rgb(219,219,219)] h-full rounded-lg mr-3">
            <div className="leading-3 p-3">{`Môn học: ${currClassInfo?.className}`}</div>
            {/* <div className="leading-3 p-3">{`Lịch học: ${classTime}`}</div> */}
            <div className="flex items-center justify-between border-b border-[rgb(219,219,219)]">
                <div className="leading-3 p-3 ">{`Sĩ số: ${getPresent()}/${currClassStudents?.length}`}</div>
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
                        {/* Kiểm tra nếu imageUrls tồn tại thì hiển thị */}
                        {imageUrls.length > 0 ? (
                            <div>
                                {imageUrls.filter((e, index) => {
                                    const date1 = fileInfoObjects[index].date; // Định dạng ngày tháng năm (ddMMyyyy)
                                    const date2 = new Date(selectedDate);
                                    const parts = date1.match(/(\d{2})(\d{2})(\d{4})/); // Tách chuỗi thành ngày, tháng, năm
                                    const day = parseInt(parts[1]);
                                    const month = parseInt(parts[2]) - 1; // Giảm đi 1 vì tháng trong JavaScript bắt đầu từ 0 (0-11)
                                    const year = parseInt(parts[3]);
                                    const date1Obj = new Date(year, month, day);
                                    return date1Obj.getFullYear() === date2.getFullYear() &&
                                        date1Obj.getMonth() === date2.getMonth() &&
                                        date1Obj.getDate() === date2.getDate() &&
                                        selectedShift.includes(getStudyShift(fileInfoObjects[index].hour, fileInfoObjects[index].minute, fileInfoObjects[index].second))

                                }).map((url, index) => {
                                        return  (<div style={{ display: "flex", alignItems: "center", "padding-bottom": "10px" }}>
                                              <img width={100} key={index} src={url} alt={`Downloaded from Firebase ${index}`} />
                                              <span style={{ "padding-left": "5px" }}>
                                                  <span>{filesss[index].name}  - </span>
                                                  <span class={"masv"}>{filesss[index].maSV}</span> -
                                                  <span class={"tgdd"}> {filesss[index].hour} : {filesss[index].minute} : {filesss[index].second}</span>
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
                {/*   {currClassCheckinInfo?.map((item, index) => {
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
                )}*/}
            </div>

        </div>
    );
};

export default LeftContent;