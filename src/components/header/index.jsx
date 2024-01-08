import React from "react";

import logo from '../../assets/image/logouit.png';

const Header = () => {
    return (
        <div className="h-full w-full flex items-center px-3">
            <img src={logo} className="w-[80px] mr-3"/>
            <div className="text-xl font-normal">Quản lý lớp học</div>
        </div>
    );
};

export default Header;