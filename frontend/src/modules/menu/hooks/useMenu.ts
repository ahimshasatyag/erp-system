import { useQuery } from '@tanstack/react-query'
import { getSidebarMenus } from '../api'

export const useSidebarMenus = () => {
    return useQuery({
        queryKey: ['sidebar-menus'],
        queryFn: getSidebarMenus,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    })
}
