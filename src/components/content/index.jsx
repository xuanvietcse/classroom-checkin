import React from "react";

import Calendar from "./Calendar";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";

const Content = () => {
    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-2">
            <Calendar />
            <div className="flex items-center flex-grow">
                <div className="w-[40%] h-full">
                    <LeftContent />
                </div>
                <div className="w-[60%] h-full">
                    <RightContent />
                </div>
            </div>
        </div>
    );
};

export default Content