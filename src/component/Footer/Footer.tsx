import style from '@/style/footer/footer.module.scss'

export default function Footer (){
    return(
        <footer className={`${style.footerDiv} bg-sky-300`}>
            <div>
                <p >聯繫方法</p>
                <p >電話號碼:0917-871-819</p>
                <p >信箱:ailafeka@gmail.com</p>
                <p >聯繫時間:1000~2000</p>
            </div>
            <div>
                <p>本網站是以Next製作，並放在github上使用，僅供用於展示</p>
                <p>Copyright© 劉星緯 2025</p>
            </div>
        </footer>
    )
}