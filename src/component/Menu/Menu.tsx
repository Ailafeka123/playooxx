import React,{useState} from "react";
import Link from "next/link";
import style from '@/style/Menu/menu.module.scss'
import getConfig from "next/config";
export default function Menu(){
    const [navCollapse,setNavCollapse] = useState(false);
    const   { publicRuntimeConfig } = getConfig();
    const basePath = publicRuntimeConfig.basePath || "";
    return(
        <header className={`${style.header} bg-sky-300`} >
            <nav className={style.menuNav}>
                <div className={`${style.menuButtonDiv} hover:bg-sky-400 focus:bg-sky-600 active:bg-sky-600`} onClick={()=>{setNavCollapse(!navCollapse)}}>
                    <span className={style.menuButton1}> </span>
                    <span className={style.menuButton2}> </span>
                    <span className={style.menuButton3}> </span>
                </div>
                <div className={`${style.navLinkDiv} ${navCollapse?`flex`:`hidden`}`}>
                    <div className={`${style.iconDiv}`}>
                        <img  src={`${basePath}/selficon3.svg`} alt="icon" className={`${style.navIcon}`} width={40} height={40}/>
                    </div>
                    <ul className={` `}>
                        <li><Link href={'/Snake'}>貪吃蛇</Link></li>
                        <li><Link href={'/'}>井字遊戲</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    )

}