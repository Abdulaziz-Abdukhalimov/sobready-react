import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, IconButton, Menu, MenuItem, Typography, Stack } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    handleClose();
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: "inherit",
          gap: 0.5,
          borderRadius: 2,
          px: 1,
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        <LanguageIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontSize: "13px" }}>
          {currentLang.flag}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 160, mt: 1 },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
            sx={{ py: 1 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography fontSize="18px">{lang.flag}</Typography>
              <Typography variant="body2">{lang.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
