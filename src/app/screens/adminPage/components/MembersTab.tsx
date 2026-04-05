import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import AdminService from "../../../services/AdminService";
import { Member } from "../../../../lib/types/member";
import { serverApi } from "../../../../lib/config";
import Swal from "sweetalert2";

export default function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = () => {
    const admin = new AdminService();
    admin
      .getAllMembers()
      .then((data) => setMembers(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleToggleStatus = async (member: Member) => {
    const newStatus = member.memberStatus === "ACTIVE" ? "BLOCK" : "ACTIVE";
    const action = newStatus === "BLOCK" ? "block" : "unblock";

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${member.memberNick}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "BLOCK" ? "#d32f2f" : "#2e7d32",
      confirmButtonText: `Yes, ${action}`,
    });

    if (result.isConfirmed) {
      try {
        const admin = new AdminService();
        await admin.blockMember(String(member._id), newStatus);
        await Swal.fire({
          icon: "success",
          title: `Member ${action}ed!`,
          timer: 1000,
          showConfirmButton: false,
        });
        fetchMembers();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#122717", mb: 3 }}>
        Members ({members.length})
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nickname</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Points</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id} hover>
                <TableCell>
                  <Avatar
                    src={member.memberImage ? `${serverApi}/${member.memberImage}` : "/icons/default-user.svg"}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{member.memberNick}</TableCell>
                <TableCell>{member.memberPhone}</TableCell>
                <TableCell>
                  <Chip
                    label={member.memberType}
                    size="small"
                    sx={{
                      bgcolor: member.memberType === "ADMIN" ? "#fff3e0" : "#e3f2fd",
                      color: member.memberType === "ADMIN" ? "#e65100" : "#1565c0",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.memberPoints}
                    size="small"
                    sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.memberStatus}
                    size="small"
                    sx={{
                      bgcolor: member.memberStatus === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                      color: member.memberStatus === "ACTIVE" ? "#2e7d32" : "#c62828",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {member.memberType !== "ADMIN" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleToggleStatus(member)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: "12px",
                        color: member.memberStatus === "ACTIVE" ? "#c62828" : "#2e7d32",
                        borderColor: member.memberStatus === "ACTIVE" ? "#c62828" : "#2e7d32",
                      }}
                    >
                      {member.memberStatus === "ACTIVE" ? "Block" : "Unblock"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
