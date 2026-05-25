export interface SubMenuItem {
    title: string
    path: string
}

export interface MenuItem {
    title: string
    path?: string | null
    icon?: string
    submenu?: SubMenuItem[] | null
}
