import {useState} from "react";


export default function Btn({x = 0, y = 0, scale = 0.2, text = "", tx = 10, ty= 165, fontSize = 80, active = false}) {
   const [hover, setHover] = useState(false)
    return <g
        onMouseOver={()=>{
        setHover(true)
    }} onMouseOut={()=>{
        setHover(false)
    }} transform={`translate(${x} ${y}) scale(${scale})`}>
        <defs>
            <linearGradient id="gradient_btn_1" gradientUnits="userSpaceOnUse" x1="338.162" y1="48.202" x2="0.162" y2="48.202">
                <stop offset="0" stopColor="#2D5E6B"/>
                <stop offset="0.49" stopColor="#29A1AB"/>
                <stop offset="1" stopColor="#2D5E6B"/>
            </linearGradient>
            <radialGradient id="gradient_btn_2" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
                            gradientTransform="matrix(0 48.763 -168.834 0 168.834 48.763)">
                <stop offset="0" stopColor="#871E1E"/>
                <stop offset="1" stopColor="#24C2C9"/>
            </radialGradient>
            <filter colorInterpolationFilters="sRGB" x="-155" y="-85" width="157" height="87" id="filter_btn_3">
                <feFlood floodOpacity="0" result="BackgroundImageFix_btn_1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceAlpha"/>
                <feOffset dx="0" dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.251 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix_btn_1" result="Shadow_btn_2"/>
                <feBlend mode="normal" in="SourceGraphic" in2="Shadow_btn_2" result="Shape_btn_3"/>
            </filter>
            <filter id="blurFilter_btn">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8"/>
            </filter>


            <linearGradient id="gradient_btn_hover_1" gradientUnits="userSpaceOnUse" x1="338.162" y1="48.202" x2="0.162" y2="48.202">
                <stop offset="0" stopColor="#4C495C" />
                <stop offset="0.49" stopColor="#391FC4" />
                <stop offset="1" stopColor="#4C495C" />
            </linearGradient>
            <radialGradient id="gradient_btn_hover_2" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="matrix(0 29.1 -100.755 0 100.755 29.1)">
                <stop offset="0" stopColor="#871E1E" />
                <stop offset="1" stopColor="#B9B1E0" />
            </radialGradient>

            <filter colorInterpolationFilters="sRGB" x="-182.065" y="-35.059" width="184.065" height="37.059" id="filter_btn_hover_3">
                <feFlood floodOpacity="0" result="BackgroundImageFix_1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="SourceAlpha" />
                <feOffset dx="0" dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.251 0" />
                <feBlend mode="normal" in2="BackgroundImageFix_btn_hover_1" result="Shadow_btn_hover_2" />
                <feBlend mode="normal" in="SourceGraphic" in2="Shadow_btn_hover_btn_hover_2" result="Shape_btn_hover_3" />
            </filter>
        </defs>
        <g transform="translate(2 89.798)">
            <path
                d="M0 21.4975L26.2168 0L320.365 0L337.668 14.6813L337.668 74.9791L313.549 97.5252L17.3032 97.5252L0 82.3197L0 21.4975Z"
                fill={hover?"url(#gradient_btn_hover_1)":active?"url(#gradient_btn_hover_1)":"url(#gradient_btn_1)"} fillRule="evenodd" strokeWidth="4" stroke={hover?"url(#gradient_btn_hover_2)":active?"url(#gradient_btn_hover_2)":"url(#gradient_btn_2)"}/>
            <path filter="url(#blurFilter_btn)"
                  d="M0 2.72308C0 1.21917 28.6538 0 64 0C99.3462 0 128 1.21917 128 2.72308C128 4.227 99.3462 5.44617 64 5.44617C28.6538 5.44617 0 4.227 0 2.72308Z"
                  fill="#79E3EB" fillRule="evenodd" transform="translate(104.162 91.756)"/>
            <path filter="url(#blurFilter_btn)"
                  d="M0 2.72308C0 1.21917 28.6538 0 64 0C99.3462 0 128 1.21917 128 2.72308C128 4.227 99.3462 5.44617 64 5.44617C28.6538 5.44617 0 4.227 0 2.72308Z"
                  fill="#79E3EB" fillRule="evenodd" transform="translate(104.162 0.202)"/>
        </g>
        <g filter={hover?"url(#filter_btn_hover_3)":active?"url(#filter_btn_hover_3)":"url(#filter_btn_3)"} transform={`translate(${tx} ${ty})`}>
            <text fill={"#A7EAF2"} fontSize={fontSize}>{text}</text>
        </g>

    </g>
}


