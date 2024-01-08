import React from "react";

import Student from "./Student";

const RightContent = () => {
    return (
        <div style={{height: 'calc(100vh - (221px))'}} className="border border-[rgb(219,219,219)] p-3 rounded-lg flex flex-col overflow-y-auto scrollbar-hide">
            <div className="text-sm font-medium mb-3">Danh sách lớp</div>
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
            <Student />
        </div>
    );
};

export default RightContent;