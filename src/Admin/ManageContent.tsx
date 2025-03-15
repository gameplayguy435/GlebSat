import { Box } from "@mui/material";
import ManageNews from "./ManageNews";
import ManageImages from "./ManageImages";

const ManageContent = () => {
    return (
        <Box sx={{ p: 3, width: "100%" }}>
            <ManageNews />
            <ManageImages />
        </Box>
    );
};

export default ManageContent;