import {useState} from "react";


export default function Btn({x = 0, y = 0, scale = 0.2, text = "", tx = 10, ty= 165, fontSize = 80, active = false}) {
   const [hover, setHover] = useState(false)
    return <g
        onMouseOver={()=>{
        setHover(true)
    }} onMouseOut={()=>{
        setHover(false)
    }} transform={`translate(${x} ${y}) scale(${scale})`}>

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


