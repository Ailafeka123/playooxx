import type { AppProps } from "next/app"
import SEOHead from "@/component/Head/Head"
import '@/style/global.scss'
export default function MyApp({ Component, pageProps }:AppProps){
    return (
        <>
            <SEOHead/>
            <Component {...pageProps}/> 
        </>
    )

}