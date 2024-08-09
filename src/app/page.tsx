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
import HomeLoading from "@/ui/HomeLoading";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
    if (isNaN(value)) {
      return <>
        {getDesc(opt, key)}
        <Input key={`${key}-input`} value={0} sx={InputStyle} onChange={(e) => handleChange(path, key, e.target.value)} color="primary" />
      </>
    }
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

type ConfigInfo = {
  title: string;
  desc: string;
  author: string;
  version: string;
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
  borderRadius: "10px",
  border: "1px solid transparent",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid white",
  }
}

const InputStyle = {
  width: "80%",
  color: "white",
}

const getInfo = (opt: Opt): ConfigInfo => {
  return opt["__info__"] as ConfigInfo;
}

export default function Home() {
  const [opt, setOpt] = useState<Opt>();

  // 値改变事件
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

  const optDetails = (opt: Opt | undefined) => {
    if (opt === undefined || !opt["__info__"]) {
      return
    }
    if (opt["__info__"]) {
      const info = opt["__info__"] as ConfigInfo;
      return <Box sx={{
        display: "flex", flexDirection: "column", alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "10px",
        minWidth: "40%",
        maxWidth: "80%",
        transition: "all 0.3s",
        ":hover": {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "1px solid white",
        }
      }}>
        <Typography sx={{ margin: "10px", fontSize: "1rem" }}>配置文件信息</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Box sx={{ margin: "10px", color: "white", fontSize: "1rem" }}>
            <Typography sx={{ margin: "10px", fontSize: "1rem" }}>标题</Typography>
            <Typography sx={{ margin: "10px", color: "white" }}>{info.title}</Typography>
          </Box>
          <Box sx={{ margin: "10px", color: "white", fontSize: "1rem" }}>
            <Typography sx={{ margin: "10px", fontSize: "1rem" }}>作者</Typography>
            <Typography sx={{ margin: "10px", color: "white" }}>{info.author}</Typography>
          </Box>
          <Box sx={{ margin: "10px", color: "white", fontSize: "1rem" }}>
            <Typography sx={{ margin: "10px", fontSize: "1rem" }}>版本</Typography>
            <Typography sx={{ margin: "10px", color: "white" }}>{info.version}</Typography>
          </Box>
        </Box>
        <Box sx={{ margin: "10px", color: "white", fontSize: "1rem" }}>
          <Typography sx={{ margin: "10px", fontSize: "1rem" }}>描述</Typography>
          <Typography sx={{ margin: "10px", color: "white" }}>{info.desc}</Typography>
        </Box>
        <Button onClick={handleEdit}>编辑</Button>
      </Box>
    }
    return
  }

  // 编辑基础信息弹出窗口
  const [showEdit, setShowEdit] = useState(false);
  const handleEdit = () => {
    setShowEdit(true);
  }

  const handleSaveInfo = (info: ConfigInfo) => {
    let currentOpt: any = { ...opt };
    currentOpt["__info__"] = info;
    setOpt(currentOpt);
    saveOpt(currentOpt);
    setShowEdit(false);
  }

  const infoChange = (key: string, value: string) => {
    let currentOpt: any = { ...opt };
    currentOpt["__info__"][key] = value;
    setOpt(currentOpt);
    saveOpt(currentOpt);
  }

  const EditInfo = () => {
    if (opt === undefined) {
      return
    }
    const info = getInfo(opt);

    return <>
      <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
        <DialogTitle minWidth={400}>编辑基础信息</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px" }}>
            <TextField style={{ margin: "10px" }} label="标题" value={info.title} onChange={(e) => infoChange("title", e.target.value)} />
            <TextField style={{ margin: "10px" }} label="作者" value={info.author} onChange={(e) => infoChange("author", e.target.value)} />
            <TextField style={{ margin: "10px" }} label="版本" value={info.version} onChange={(e) => infoChange("version", e.target.value)} />
            <TextField
              style={{ margin: "10px" }}
              label="描述"
              multiline
              rows={4}
              value={info.desc}
              onChange={(e) => infoChange("desc", e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={() => handleSaveInfo(info)}>保存</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  }

  return (<>
    <HeadBar />
    <InteractiveFab onOptChange={setOpt} />
    {showEdit && EditInfo()}
    <Box style={{ marginTop: "80px", color: "white" }} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {optDetails(opt)}
      {opt && GetKeys(opt).map((key, index) => {
        if (key.startsWith("__")) {
          return
        }
        return <Card key={`${key}-${index}`} sx={{ ...CardStyle }}>
          {ParseOpt(opt, key, [], handleChange)}
        </Card>;
      })}
      {!opt && <>
        <HomeLoading />
      </>}
    </Box>
  </>);
}