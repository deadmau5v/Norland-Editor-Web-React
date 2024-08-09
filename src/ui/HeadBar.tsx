"use client"
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';


function HeadBar() {

  const router = useRouter();

  return (
    <AppBar component="nav" sx={{ background: "rgba(0, 0, 0, 0.8)" }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Image src={"/logo.webp"} alt="logo" width={100} height={50} />
          </Link>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button key="head_link_create" onClick={() => {
              router.push("/")
            }} sx={{ color: "#fff", ml: 2 }}>生成配置</Button>
            <Button key="head_link_edit" onClick={() => {
              router.push("/edit")
            }} sx={{ color: "#fff", ml: 2 }}>编辑配置</Button>
            <Button key="head_link_public" onClick={() => {
              router.push("/public")
            }} sx={{ color: "#fff", ml: 2 }}>公共配置</Button>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeadBar;
