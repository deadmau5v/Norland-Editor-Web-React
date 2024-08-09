"use client"
import HeadBar from "@/ui/HeadBar";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useEffect, useState } from "react";
import { getDefaultOpt, saveOpt } from "@/ui/InteractiveFab";
import { Opt } from "@/ui/InteractiveFab";
import { useRouter } from "next/navigation";

// 将用户上传的opt 混合到有注释的opt中
const margeOpt = (opt: any, data: any) => {
    for (let key in opt) {
        if (data[key] === undefined) {
            data[key] = opt[key];
        }
        if (data[key] !== undefined && typeof data[key] === "object") {
            data[key] = margeOpt(opt[key], data[key]);
        }
    }
    return data;
}

export default function Edit() {

    const router = useRouter();

    const comment = <Typography variant="h4" component="h1" sx={{ color: "rgba(255, 255, 255, 0.3)", fontWeight: "bold" }}>拖动
        <span style={{ margin: "0 10px", color: "rgba(255, 255, 255, 0.5)" }}>gameplay_variables.json</span>
        文件到此</Typography>

    const commentDragOver = <Typography variant="h4" component="h1" sx={{ color: "rgba(255, 255, 255, 0.3)", fontWeight: "bold" }}>松开以上传</Typography>
    const [isDroped, setIsDroped] = useState(false);

    useEffect(() => {
        async function init() {
            let opt_ = localStorage.getItem("opt");
            if (opt_) {
                let opt = JSON.parse(opt_)
                saveOpt(opt);
            } else {
                saveOpt(await getDefaultOpt());
            }
        }
        init();
    }, []);


    return <>
        <HeadBar />
        <Box style={{ marginTop: "80px", color: "white" }} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{
                width: "80%", height: "80vh", backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "30px"
                , border: isDroped ? "4px dashed rgba(255, 255, 255, 0.3)" : "4px solid rgba(255, 255, 255, 0.3)"
                , display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDroped(true);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = async (e) => {
                        const data = JSON.parse(e.target?.result as string);
                        const defaultOpt = await getDefaultOpt();

                        let opt = margeOpt(defaultOpt, data);
                        console.log(opt);
                        saveOpt(opt);
                        router.push("/");
                    }
                    setIsDroped(false);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDroped(false);
                }}
            >
                <FileUploadIcon sx={{ fontSize: "100px", color: "rgba(255, 255, 255, 0.3)" }} />
                {isDroped ? commentDragOver : comment}
            </Box>
        </Box>
    </>
}