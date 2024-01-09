import React from "react";

const LeftContent = (props) => {

    const { currClassInfo } = props;

    return (
        <div className="border border-[rgb(219,219,219)] h-full p-3 rounded-lg mr-3">
            <div className="">{`Môn học: ${currClassInfo?.className}`}</div>
        </div>
    );
};

export default LeftContent;