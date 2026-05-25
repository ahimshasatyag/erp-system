import api from '../../../services/api'
import type { MenuItem } from '../types'

export const getSidebarMenus = async (): Promise<MenuItem[]> => {
    const response = await api.get('/menu/sidebar')
    return response.data
}
