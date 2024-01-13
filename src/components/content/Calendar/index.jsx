import React, { useState, useEffect } from "react";

import IconLeft from '../../../assets/icons/iconLeft.svg?react';
import IconRight from '../../../assets/icons/iconRight.svg?react';

const lookupMonth = {
    0: 'Tháng 1',
    1: 'Tháng 2',
    2: 'Tháng 3',
    3: 'Tháng 4',
    4: 'Tháng 5',
    5: 'Tháng 6',
    6: 'Tháng 7',
    7: 'Tháng 8',
    8: 'Tháng 9',
    9: 'Tháng 10',
    10: 'Tháng 11',
    11: 'Tháng 12',
};

const weeks = [ "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" ];

const Calendar = (props) => {

    const { handleChangeDate, currClassId } = props;

    const [state, setState] = useState({
        currDate: ``,
        weeklyDate: [],
        currDateOfWeek: ``,
        isCurrWeek: false,
        currDay: null,
    });

    const addLeadingZero = (num) => {
        return num < 10 ? `0${num}` : num;
    };
    
    const firstAndLastDateOfWeek = (date) => {
        const dateIn = new Date(date);
        let firstDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay()));
        firstDayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), 0, 0, 0);
    
        let secondDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 1));
        secondDayOfWeek = new Date(secondDayOfWeek.getFullYear(), secondDayOfWeek.getMonth(), secondDayOfWeek.getDate(), 0, 0, 0)
    
        let thirdDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 2));
        thirdDayOfWeek = new Date(thirdDayOfWeek.getFullYear(), thirdDayOfWeek.getMonth(), thirdDayOfWeek.getDate(), 0, 0, 0)
    
        let fourthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 3));
        fourthDayOfWeek = new Date(fourthDayOfWeek.getFullYear(), fourthDayOfWeek.getMonth(), fourthDayOfWeek.getDate(), 0, 0, 0)
    
        let fifthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 4));
        fifthDayOfWeek = new Date(fifthDayOfWeek.getFullYear(), fifthDayOfWeek.getMonth(), fifthDayOfWeek.getDate(), 0, 0, 0)
    
        let sixthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 5));
        sixthDayOfWeek = new Date(sixthDayOfWeek.getFullYear(), sixthDayOfWeek.getMonth(), sixthDayOfWeek.getDate(), 0, 0, 0)
    
        let lastDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 6));
        lastDayOfWeek = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), 23, 23, 59)
        
        return [ firstDayOfWeek, secondDayOfWeek, thirdDayOfWeek, fourthDayOfWeek, fifthDayOfWeek, sixthDayOfWeek, lastDayOfWeek ];
    };
    

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`;
        const minutes = now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`;
        const time = (hour >= 0 && hour < 12) ? 'AM' : 'PM';
        const currTime = `${hour}:${minutes} ${time}`;
        
        const year = now.getFullYear();
        const month = lookupMonth[now.getMonth()];
        const date = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
        const currDate = `${date} ${month} ${year}`;

        const firstAndLast = firstAndLastDateOfWeek(now);
        handleChangeDate(now);

        setState(prev => ({...prev, currTime: currTime, currDate: currDate, weeklyDate: firstAndLast, currDateOfWeek: now, currDay: date, isCurrWeek: true}));
    },[]);

    const goToPreviousWeek = () => {
        const previousWeek = new Date(state.currDateOfWeek);
        previousWeek.setDate(previousWeek.getDate() - 7);
        const weeklyDate = firstAndLastDateOfWeek(previousWeek);

        const currDate = `${weeklyDate[0]?.getFullYear()}-${addLeadingZero(weeklyDate[0]?.getMonth() + 1)}-${addLeadingZero(weeklyDate[0]?.getDate())}  -  ${weeklyDate[6]?.getFullYear()}-${addLeadingZero(weeklyDate[6]?.getMonth() + 1)}-${addLeadingZero(weeklyDate[6]?.getDate())}`;

        setState(prev => ({...prev, currDateOfWeek: previousWeek, weeklyDate: weeklyDate, currDate: currDate}));
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(state.currDateOfWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const weeklyDate = firstAndLastDateOfWeek(nextWeek);

        const currDate = `${weeklyDate[0]?.getFullYear()}-${addLeadingZero(weeklyDate[0]?.getMonth() + 1)}-${addLeadingZero(weeklyDate[0]?.getDate())}  -  ${weeklyDate[6]?.getFullYear()}-${addLeadingZero(weeklyDate[6]?.getMonth() + 1)}-${addLeadingZero(weeklyDate[6]?.getDate())}`;

        setState(prev => ({...prev, currDateOfWeek: nextWeek, weeklyDate: weeklyDate, currDate: currDate}));
    };

    const goToCurrentWeek = () => {
        const now = new Date();
        const firstAndLast = firstAndLastDateOfWeek(now);

        const year = now.getFullYear();
        const month = lookupMonth[now.getMonth()];
        const date = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
        const currDate = `${date} ${month} ${year}`;

        handleChangeDate(now);

        setState(prev => ({...prev, weeklyDate: firstAndLast, currDate: currDate, isCurrWeek: true, currDay: date}));
    };

    const handleChangeSelectedDate = (date) => {
        setState(prev => ({...prev, currDay: addLeadingZero(date?.getDate())}));
        handleChangeDate(date);
    };

    return (
        <div className="w-full mb-5">
            <div className="w-full flex items-center justify-between mb-3">
                <div className="">
                    <IconLeft className="transform scale-75 cursor-pointer" onClick={goToPreviousWeek}/>
                </div>
                <div className="font-bold cursor-pointer select-none" onClick={goToCurrentWeek}>{state.currDate}</div>
                <div className="">
                    <IconRight className="transform scale-75 cursor-pointer" onClick={goToNextWeek}/>
                </div>
            </div>
            <div className="w-full flex justify-between">
                {weeks.map((item ,index) => {
                    return (
                        <div 
                            className={`font-semibold p-1 transition-all duration-200 rounded cursor-pointer ${state.currDay < addLeadingZero(state.weeklyDate[index]?.getDate()) ? '' : 'hover:bg-[rgb(59,118,239)] hover:text-white'} flex flex-col items-center ${state.isCurrWeek && addLeadingZero(state.weeklyDate[index]?.getDate()) === state.currDay ? 'bg-[rgb(59,118,239)] text-white rounded': ''}`} 
                            key={index}
                            onClick={() => handleChangeSelectedDate(state.weeklyDate[index])}
                        >
                            <div className="select-none">{item}</div>
                            <div className="select-none">{addLeadingZero(state.weeklyDate[index]?.getDate())}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Calendar;
