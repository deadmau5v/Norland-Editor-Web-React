"use client"
import Fab from '@mui/material/Fab';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const getDesc = (opt: Opt, key: string) => {
  return opt["__desc__" + key]
}

const getDefaultOpt = async () => {
  const response = await fetch("http://localhost:8080/api/default", {
    method: "GET",
  })
  if (response.ok) {
    return await response.json()
  } else {
    console.log("获取默认参数失败")
  }
}

type Opt = {
  [key: string]: (number | Opt | string)
}

// 弃用
// // filterOpt 筛选掉 __desc__ 和 __type__ 的键值对
// const filterOpt = (opt: Opt) => {
//   for (const key in opt) {
//     if (key.startsWith("__desc__") || key.startsWith("__type__")) {
//       delete opt[key]
//       continue
//     }

//     const value: number | Opt | string = opt[key]
//     if (typeof value === "object") {
//       opt[key] = filterOpt(value)
//     }
//   }
//   return opt
// }

const saveOpt = (opt: Opt) => {
  localStorage.setItem("opt", JSON.stringify(opt))
}



function InteractiveFab({ onOptChange }:
  { onOptChange: Dispatch<SetStateAction<Opt | undefined>>; }
) {

  const [defaultOpt, setDefaultOpt] = useState<Opt | null>(null)

  const loadOpt = async () => {
    const opt = localStorage.getItem("opt")
    const defaultOpt = await getDefaultOpt()
    setDefaultOpt(defaultOpt)
    if (opt) {
      onOptChange(JSON.parse(opt))
    } else {
      onOptChange(defaultOpt)
      saveOpt(defaultOpt)
    }
  }



  const init = async () => {
    loadOpt()
  }

  useEffect(() => {
    init()
  }, [])

  const handleReset = async () => {
    onOptChange(defaultOpt ?? {})
    saveOpt(defaultOpt ?? {})
  }

  const handleDownload = () => {
    console.log("下载")
  }

  return (<>
    <Fab aria-label="reset" sx={{ position: 'fixed', bottom: 32, right: 102, display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={handleReset}>
      <RestoreIcon />
      <Typography>重置</Typography>
    </Fab>
    <Fab aria-label="save" sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={handleDownload}>
      <SaveIcon />
      <Typography>下载</Typography>
    </Fab>
  </>);
}

export default InteractiveFab
export { getDesc, getDefaultOpt, saveOpt }
export type { Opt };
