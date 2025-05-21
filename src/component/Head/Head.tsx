import Head from "next/head";
import Image from "next/image";
export default function SEOHead(){
    return(
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>小遊戲網站</title>
            <meta name="description" content="小遊戲區" />
            <meta name="keywords" content="遊戲 ReactJS Next" />
            <meta name="author" content="劉星緯" />
            <link href="/selficon3.svg"></link>
        </Head>
    )
}