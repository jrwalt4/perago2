/**
 * Sidebar component for detail views or other information
 * Primarily for details of selected entity and recent tasks
 */

import Drawer, { DrawerProps } from "@mui/material/Drawer";

import { TitlebarSpacer } from "./Titlebar";

export type SidebarProps = React.PropsWithChildren<{
    width?: number;
} & Pick<DrawerProps, 'anchor' | 'variant'>
>;

export default function Sidebar({ children, anchor, width, variant }: SidebarProps) {
    return (
        <Drawer
            anchor={anchor} variant={variant}
            sx={{ width, flexShrink: 0 }}
            PaperProps={{sx: {width}}}
        >
            <TitlebarSpacer />
            {children}
        </Drawer>
    )
}

(Sidebar as React.FunctionComponent<SidebarProps>).defaultProps = {
    width: 250,
    variant: "permanent"
}
