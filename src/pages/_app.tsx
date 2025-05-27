import type { AppProps } from "next/app"
import SEOHead from "@/component/Head/Head"
import Menu from "@/component/Menu/Menu"
import Footer from "@/component/Footer/Footer"
import '@/style/global.css'
import '@/style/global.scss'
export default function MyApp({ Component, pageProps }:AppProps){
    return (
        <>
            <SEOHead/>
            <Menu/>
            <Component {...pageProps}/> 
            <Footer/>
        </>
    )

}