import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const skeletonStyle = {
    borderRadius: "10px", backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px"
}

export default function HomeLoading() {
    return <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", margin: "0 auto", backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "10px" }}>
        <Typography variant="h5" component="h1" sx={{ color: "#fff", fontWeight: "bold", margin: "20px" }}>加载中...</Typography>
        {Array.from({ length: 16 }).map((_, index) => (
            <Skeleton key={index} animation="wave" variant="rectangular" width={"80%"} height={80} sx={skeletonStyle} />
        ))}
    </Box>
}