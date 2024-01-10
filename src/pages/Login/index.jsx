import React from "react";

import { useNavigate } from "react-router-dom";

import { ref, set, child, get } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, app } from '../../core/firebase.js';

import Button from "../../components/button";

import { v4 as uuidv4 } from 'uuid';

const Login = () => {

    const navigate = useNavigate();

    const signUpAuth = () => {
        signOut(auth)
            .then(async () => {
                var id = uuidv4();
                const provider = new GoogleAuthProvider(app);

                provider.setCustomParameters({
                    login_hint: "user@example.com",
                });

                await signInWithPopup(auth, provider)
                    .then((result) => {
                        const newUser = {
                            userId: id,
                            name: result._tokenResponse.email.slice(0, result._tokenResponse.email.lastIndexOf("@")),
                            email: result._tokenResponse.email,
                            password: "123456",
                            pic: result._tokenResponse.photoUrl,
                            createAt: new Date().getTime(),
                        };

                        get(child(ref(db), "users/")).then((snapshot) => {
                            const record = snapshot.val() ?? [];
                            const values = Object.values(record);
                            const isUserExisting = values.some((item) => item.email === newUser.email);
                            
                            if (!isUserExisting) {
                                set(ref(db, `users/${id}/`), newUser).then(() => {
                                    alert("Đăng nhập thành công !")
                                });
                            }
                            localStorage.setItem('currUser', JSON.stringify(newUser));
                            setTimeout(() => {
                                navigate({
                                    pathname: '/'
                                });
                            }, 3000);
                        });
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="font-black text-[36px] uppercase text-[#004599] mb-3">Phần mềm quản lý lớp học</h1>

            <Button 
                content={`Đăng nhập với Google`}
                isTextGradient={true}
                primaryColor={"#003B93"}
                secondaryColor={"#00F0FF"}
                logoGg={true}
                onClick={() => {
                    signUpAuth();
                }}
            />
        </div>
    );
};

export default Login;