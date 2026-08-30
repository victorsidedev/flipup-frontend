import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2563eb",
            dark: "#1d4ed8",
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#0f172a",
            secondary: "#475569",
        },
        divider: "#e2e8f0",
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif",
        ].join(","),
        h1: { fontWeight: 700, letterSpacing: "-0.03em" },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f8fafc",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: "1px solid #e2e8f0",
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                },
                containedPrimary: {
                    boxShadow: "0 12px 22px rgba(37, 99, 235, 0.2)",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                size: "small",
            },
        },
        MuiFormControl: {
            defaultProps: {
                fullWidth: true,
                size: "small",
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "#e2e8f0",
                },
                head: {
                    fontWeight: 700,
                    color: "#0f172a",
                    backgroundColor: "#f8fafc",
                },
            },
        },
    },
});

// Custom, non-MUI design tokens (e.g. the dark sidebar) live here.
theme.custom = {
    sidebar: {
        background: "#0f172a",
        hoverBackground: "rgba(148, 163, 184, 0.12)",
        text: "#cbd5e1",
        activeText: "#ffffff",
    },
};

export default theme;
