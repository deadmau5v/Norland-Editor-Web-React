"use client"
import HeadBar from "@/ui/HeadBar";
import InteractiveFab from "@/ui/InteractiveFab";
import { useState } from "react";
import { Opt } from "@/ui/InteractiveFab";
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getDesc } from "@/ui/InteractiveFab";
import { saveOpt } from "@/ui/InteractiveFab";

const renderDescription = (opt: Opt, key: string, style: React.CSSProperties): React.ReactNode => {
  const desc = getDesc(opt, key);
  if (typeof desc === 'string') {
    return <Typography sx={style}>{desc}</Typography>;
  }
}

const ParseOpt = (opt: Opt, key: string, path: string[], handleChange: (path: string[], key: string, value: any) => void): React.ReactNode => {
  const value = opt[key];

  if (typeof value === "object") {
    return <>
      {renderDescription(opt, key, {
        margin: "10px",
        fontSize: "1.5rem",
      })}
      {GetKeys(value).map((subkey: string, index: number) => {
        if (subkey.startsWith("__")) {
          return
        }
        const subValue = ParseOpt(value, subkey, [...path, key], handleChange)
        return <Card key={`${key}-${subkey}-${index}`} sx={CardStyle}>
          {renderDescription(opt, subkey, {
            marginTop: "10px",
          })}
          {subValue}
        </Card>;
      })}
    </>
  } else if (typeof value === "number") {
    return <>
      {getDesc(opt, key)}
      <Input key={`${key}-input`} value={value} sx={InputStyle} onChange={(e) => handleChange(path, key, e.target.value)} color="primary" />
    </>
  } else {
    return <></>
  }
}

const GetKeys = (opt: Opt): string[] => {
  const keys = [];
  for (const key in opt) {
    keys.push(key);
  }
  return keys;
}

const CardStyle = {
  margin: "10px",
  width: "80%",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  color: "white",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const InputStyle = {
  width: "80%",
  color: "white",
}

export default function Home() {
  const [opt, setOpt] = useState<Opt>();


  const handleChange = (path: string[], key: string, value: string) => {
    
    let number_value = Number(value)

    let currentOpt: any = { ...opt };
    let target = currentOpt;
    for (let i = 0; i < path.length; i++) {
      target[path[i]] = { ...target[path[i]] };
      target = target[path[i]];
    }
    target[key] = number_value;
    setOpt(currentOpt);
    saveOpt(currentOpt)
  }

  return (<>
    <HeadBar />
    <InteractiveFab onOptChange={setOpt} />

    <Box style={{ marginTop: "80px", color: "white" }} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {opt && GetKeys(opt).map((key, index) => {
        if (key.startsWith("__")) {
          return 
        }
        return <Card key={`${key}-${index}`} sx={{ ...CardStyle, border: "1px solid white" }}>
          {ParseOpt(opt, key, [], handleChange)}
        </Card>;
      })}
      {!opt && <>
        <div>
          <h1>加载中...</h1>
        </div>
      </>}
    </Box>
  </>);
}