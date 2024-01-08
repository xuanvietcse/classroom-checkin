import React, { useState, useEffect } from "react";

import IconLeft from '../../../assets/icons/iconLeft.svg?react';
import IconRight from '../../../assets/icons/iconRight.svg?react';

const lookupMonth = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
};

const weeks = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

const Calendar = () => {

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
        firstDayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let secondDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 1));
        secondDayOfWeek = new Date(secondDayOfWeek.getFullYear(), secondDayOfWeek.getMonth(), secondDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let thirdDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 2));
        thirdDayOfWeek = new Date(thirdDayOfWeek.getFullYear(), thirdDayOfWeek.getMonth(), thirdDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let fourthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 3));
        fourthDayOfWeek = new Date(fourthDayOfWeek.getFullYear(), fourthDayOfWeek.getMonth(), fourthDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let fifthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 4));
        fifthDayOfWeek = new Date(fifthDayOfWeek.getFullYear(), fifthDayOfWeek.getMonth(), fifthDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let sixthDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 5));
        sixthDayOfWeek = new Date(sixthDayOfWeek.getFullYear(), sixthDayOfWeek.getMonth(), sixthDayOfWeek.getDate(), 0, 0, 0).getDate();
    
        let lastDayOfWeek = new Date(dateIn.setDate(dateIn.getDate() - dateIn.getDay() + 6));
        lastDayOfWeek = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), 23, 23, 59).getDate();
    
        return [
            addLeadingZero(firstDayOfWeek),
            addLeadingZero(secondDayOfWeek),
            addLeadingZero(thirdDayOfWeek),
            addLeadingZero(fourthDayOfWeek),
            addLeadingZero(fifthDayOfWeek),
            addLeadingZero(sixthDayOfWeek),
            addLeadingZero(lastDayOfWeek)
        ];
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
        const currDate = `${year} ${month} ${date}`;

        const firstAndLast = firstAndLastDateOfWeek(now);

        setState(prev => ({...prev, currTime: currTime, currDate: currDate, weeklyDate: firstAndLast, currDateOfWeek: now, currDay: date, isCurrWeek: true}));
    },[]);

    const goToPreviousWeek = () => {
        const previousWeek = new Date(state.currDateOfWeek);
        previousWeek.setDate(previousWeek.getDate() - 7);
        const weeklyDate = firstAndLastDateOfWeek(previousWeek);

        const year = previousWeek.getFullYear();
        const month = lookupMonth[previousWeek.getMonth()];
        const date = previousWeek.getDate() >= 10 ? previousWeek.getDate() : `0${previousWeek.getDate()}`;
        const currDate = `${year} ${month} ${date}`;

        setState(prev => ({...prev, currDateOfWeek: previousWeek, weeklyDate: weeklyDate, currDate: currDate}));
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(state.currDateOfWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const weeklyDate = firstAndLastDateOfWeek(nextWeek);

        const year = nextWeek.getFullYear();
        const month = lookupMonth[nextWeek.getMonth()];
        const date = nextWeek.getDate() >= 10 ? nextWeek.getDate() : `0${nextWeek.getDate()}`;
        const currDate = `${year} ${month} ${date}`;

        setState(prev => ({...prev, currDateOfWeek: nextWeek, weeklyDate: weeklyDate, currDate: currDate}));
    };

    const goToCurrentWeek = () => {
        const now = new Date();
        const firstAndLast = firstAndLastDateOfWeek(now);

        const year = now.getFullYear();
        const month = lookupMonth[now.getMonth()];
        const date = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
        const currDate = `${year} ${month} ${date}`;

        setState(prev => ({...prev, weeklyDate: firstAndLast, currDate: currDate, isCurrWeek: true, currDay: date}));
    };

    return (
        <div className="w-full">
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
                            className={`font-semibold p-1 transition-all duration-200 rounded cursor-pointer ${state.currDay < state.weeklyDate[index] ? '' : 'hover:bg-[rgb(59,118,239)] hover:text-white'} flex flex-col items-center ${state.isCurrWeek && state.weeklyDate[index] === state.currDay ? 'bg-[rgb(59,118,239)] text-white rounded': ''}`} 
                            key={index}
                        >
                            <div className="select-none">{item}</div>
                            <div className="select-none">{state.weeklyDate[index]}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Calendar;
