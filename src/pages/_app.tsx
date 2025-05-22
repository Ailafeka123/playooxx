import type { AppProps } from "next/app"

import SEOHead from "@/component/Head/Head"
export default function MyApp({ Component, pageProps }:AppProps){
    return (
        <>
            <SEOHead/>
            <Component {...pageProps}/> 
        </>
    )

}