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

// filterOpt 筛选掉 __ 开头
const filterOpt = (opt: Opt) => {
  for (const key in opt) {
    if (key.startsWith("__") && key !== "__info__") {
      delete opt[key]
      continue
    }

    const value: number | Opt | string = opt[key]
    if (typeof value === "object") {
      opt[key] = filterOpt(value)
    }
  }
  return opt
}

// 格式化json字符串
const formatJson = (str: string) => {
  return JSON.stringify(JSON.parse(str), null, 2)
}

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
      let opt_ = JSON.parse(opt)
      onOptChange(opt_)
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

  const handleDownload = async () => {
    let opt = localStorage.getItem("opt")
    const opt_ = filterOpt(JSON.parse(opt ?? "{}"))
    opt = formatJson(JSON.stringify(opt_))
    if (opt) {
      const blob = new Blob([opt], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gameplay_variables.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
