import { Box, Typography } from "@mui/material";
import ManageNews from "./ManageNews";
import ManageImages from "./ManageImages";

const ManageContent = () => {
    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Gestão de Conteúdo
            </Typography>
            <ManageNews />
            <ManageImages />
        </Box>
    );
};

export default ManageContent;